const { spawn } = require("child_process");
const { createReadStream } = require("fs");

const OUTPUT_LIMIT_BYTES = 1024 * 1024;
const SAFE_PATH = process.env.PATH || "/usr/local/bin:/usr/bin:/bin";

const executeProcess = (
  command,
  args,
  {
    inputFilePath,
    timeoutMs = 5000,
    cpuSeconds = 4,
    memoryKb = 262144,
    maxFileBlocks = 16384,
    processLimit = 64,
    cwd,
    uid,
    gid,
  } = {}
) => new Promise((resolve, reject) => {
  const isLinux = process.platform === "linux";
  if (isLinux && (uid === undefined || gid === undefined)) {
    reject({ error: "Compiler sandbox is unavailable", stderr: "" });
    return;
  }
  const spawnCommand = isLinux ? "/bin/sh" : command;
  const spawnArgs = isLinux
    ? [
        "-c",
        `ulimit -t ${cpuSeconds} && ulimit -v ${memoryKb} && ulimit -f ${maxFileBlocks} && ulimit -u ${processLimit} && umask 077 && exec "$@"`,
        "compiler-job",
        command,
        ...args,
      ]
    : args;

  let child;
  try {
    child = spawn(spawnCommand, spawnArgs, {
      cwd,
      detached: isLinux,
      env: {
        PATH: SAFE_PATH,
        HOME: cwd || "/tmp",
        TMPDIR: cwd || "/tmp",
        LANG: "C",
      },
      stdio: ["pipe", "pipe", "pipe"],
      ...(isLinux ? { uid, gid } : {}),
    });
  } catch (error) {
    reject({ error, stderr: "" });
    return;
  }

  let stdout = "";
  let stderr = "";
  let outputBytes = 0;
  let failureReason = "";
  let settled = false;

  const killProcessGroup = () => {
    if (isLinux && child.pid) {
      try {
        process.kill(-child.pid, "SIGKILL");
        return;
      } catch {
        // The process may have already exited; fall back to the child handle.
      }
    }
    child.kill("SIGKILL");
  };

  const timer = setTimeout(() => {
    failureReason = "Execution timed out";
    killProcessGroup();
  }, timeoutMs);

  const appendOutput = (target, chunk) => {
    outputBytes += chunk.length;
    if (outputBytes > OUTPUT_LIMIT_BYTES) {
      failureReason = "Execution output exceeded the size limit";
      killProcessGroup();
      return target;
    }
    return target + chunk.toString("utf8");
  };

  child.stdout.on("data", (chunk) => {
    stdout = appendOutput(stdout, chunk);
  });
  child.stderr.on("data", (chunk) => {
    stderr = appendOutput(stderr, chunk);
  });
  child.stdin.on("error", () => {});

  child.on("error", (error) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    reject({ error, stderr });
  });

  child.on("close", (code, signal) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);

    if (failureReason) {
      reject({ error: failureReason, stderr });
    } else if (code !== 0) {
      reject({ error: `Process exited with ${signal || `code ${code}`}`, stderr });
    } else {
      resolve(stdout);
    }
  });

  if (inputFilePath) {
    const input = createReadStream(inputFilePath);
    input.on("error", (error) => {
      failureReason = "Unable to read program input";
      killProcessGroup();
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject({ error, stderr });
      }
    });
    input.pipe(child.stdin);
  } else {
    child.stdin.end();
  }
});

module.exports = executeProcess;
