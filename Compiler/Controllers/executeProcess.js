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
    signal,
  } = {}
) => new Promise((resolve, reject) => {
  const isLinux = process.platform === "linux";
  const supportsProcessGroups = process.platform !== "win32";
  if (signal?.aborted) {
    reject({ error: "Execution cancelled", stderr: "" });
    return;
  }
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
      detached: supportsProcessGroups,
      env: {
        PATH: SAFE_PATH,
        HOME: cwd || "/tmp",
        TMPDIR: cwd || "/tmp",
        LANG: "C",
      },
      stdio: ["pipe", "pipe", "pipe"],
      ...(isLinux ? { uid, gid } : {}),
      windowsHide: true,
    });
  } catch (error) {
    reject({ error, stderr: "" });
    return;
  }

  let stdout = "";
  let stderr = "";
  let outputBytes = 0;
  let failureReason = "";
  let processError;
  let settled = false;
  let inputStream;

  const killProcessTree = () => {
    if (!child.pid) return;

    if (supportsProcessGroups) {
      try {
        process.kill(-child.pid, "SIGKILL");
        return;
      } catch {
        // The process group may already have exited; try the direct child next.
      }
    } else {
      let taskkill;
      try {
        taskkill = spawn("taskkill.exe", ["/pid", String(child.pid), "/t", "/f"], {
          stdio: "ignore",
          windowsHide: true,
        });
      } catch {
        child.kill("SIGKILL");
        return;
      }
      taskkill.once("error", () => child.kill("SIGKILL"));
      taskkill.once("close", (code) => {
        if (code !== 0) child.kill("SIGKILL");
      });
      return;
    }

    child.kill("SIGKILL");
  };

  const terminate = (reason) => {
    if (!failureReason) failureReason = reason;
    killProcessTree();
  };

  const onAbort = () => terminate("Execution cancelled");
  const timer = setTimeout(() => terminate("Execution timed out"), timeoutMs);

  const appendOutput = (target, chunk) => {
    outputBytes += chunk.length;
    if (outputBytes > OUTPUT_LIMIT_BYTES) {
      terminate("Execution output exceeded the size limit");
      return target;
    }
    return target + chunk.toString("utf8");
  };

  const cleanupListeners = () => {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
    inputStream?.destroy();
  };

  signal?.addEventListener("abort", onAbort, { once: true });
  if (signal?.aborted) onAbort();

  child.stdout.on("data", (chunk) => {
    stdout = appendOutput(stdout, chunk);
  });
  child.stderr.on("data", (chunk) => {
    stderr = appendOutput(stderr, chunk);
  });
  child.stdin.on("error", () => {});

  child.on("error", (error) => {
    processError = error;
    terminate("Process failed to start");
  });

  child.on("close", (code, childSignal) => {
    if (settled) return;
    settled = true;
    cleanupListeners();

    if (failureReason) {
      reject({ error: failureReason, stderr });
    } else if (processError) {
      reject({ error: processError, stderr });
    } else if (code !== 0) {
      reject({ error: `Process exited with ${childSignal || `code ${code}`}`, stderr });
    } else {
      resolve(stdout);
    }
  });

  if (inputFilePath) {
    inputStream = createReadStream(inputFilePath);
    inputStream.on("error", () => terminate("Unable to read program input"));
    inputStream.pipe(child.stdin);
  } else {
    child.stdin.end();
  }
});

module.exports = executeProcess;
