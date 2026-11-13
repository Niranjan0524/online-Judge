const path = require("path");
const executeProcess = require("./executeProcess");
const { getJobCredentials } = require("./generateFile");

const executeJava = async (filePath, inputFilePath) => {
  const jobDir = path.dirname(filePath);
  const className = path.basename(filePath, ".java");
  const credentials = getJobCredentials(filePath);

  await executeProcess("javac", [filePath, "-d", jobDir], {
    cwd: jobDir,
    timeoutMs: 15000,
    cpuSeconds: 12,
    memoryKb: 786432,
    maxFileBlocks: 65536,
    ...credentials,
  });

  return executeProcess("java", ["-Xms16m", "-Xmx192m", "-XX:ActiveProcessorCount=1", "-cp", jobDir, className], {
    inputFilePath,
    cwd: jobDir,
    timeoutMs: 5000,
    memoryKb: 786432,
    ...credentials,
  });
};

module.exports={executeJava};
