const fs = require("fs");
const path = require("path");
const executeProcess = require("./executeProcess");
const { getJobCredentials } = require("./generateFile");

const executeCpp = async (filePath, inputFilePath, timeout = 5000) => {
  const jobDir = path.dirname(filePath);
  const outputPath = path.join(jobDir, "program.out");
  const credentials = getJobCredentials(filePath);

  await executeProcess("g++", [filePath, "-o", outputPath], {
    cwd: jobDir,
    timeoutMs: 15000,
    cpuSeconds: 12,
    memoryKb: 786432,
    maxFileBlocks: 65536,
    ...credentials,
  });

  try {
    return await executeProcess(outputPath, [], {
      inputFilePath,
      cwd: jobDir,
      timeoutMs: timeout,
      cpuSeconds: Math.max(1, Math.ceil(timeout / 1000)),
      memoryKb: 262144,
      ...credentials,
    });
  } finally {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
};

module.exports = { executeCpp };
