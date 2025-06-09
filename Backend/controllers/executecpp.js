const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const formatInput = (inputObj) => {
  const numsLine = Array.isArray(inputObj.nums) ? inputObj.nums.join(" ") : "";
  const targetLine = inputObj.target !== undefined ? inputObj.target : "";
  console.log("formatted input", `${numsLine}\n${targetLine}`);
  return `${inputObj.n}\n${numsLine}\n${targetLine}`;
};

const outputPath = path.join(__dirname, "../", "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeCpp = (filepath, inputFilePath, timeout = 5000) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${filepath}" -o "${outPath}"`,
      (compileErr, _, compileStderr) => {
        if (compileErr) {
          return reject({ error: compileErr, stderr: compileStderr });
        }

        const child = spawn(outPath, [], {
          stdio: ["pipe", "pipe", "pipe"],
        });

        const inputStream = fs.createReadStream(inputFilePath);
        inputStream.pipe(child.stdin);

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });
        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        let killed = false;
        const timer = setTimeout(() => {
          killed = true;
          child.kill("SIGKILL");
        }, timeout);

        child.on("close", (code) => {
          clearTimeout(timer);
          // Clean up input file here, after process is closed
          if (fs.existsSync(inputFilePath)) {
            fs.unlinkSync(inputFilePath);
          }
          if (killed) {
            return reject({ error: "Execution timed out" });
          }
          if (code !== 0 || stderr) {
            return reject({ error: `Exited with code ${code}`, stderr });
          }
          resolve(stdout);
        });

        child.on("error", (err) => {
          clearTimeout(timer);
          if (fs.existsSync(inputFilePath)) {
            fs.unlinkSync(inputFilePath);
          }
          reject({ error: err.message });
        });
      }
    );
  });
};


module.exports = {
  executeCpp,
};
