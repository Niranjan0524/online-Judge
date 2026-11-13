const path = require("path");
const executeProcess = require("./executeProcess");
const { getJobCredentials } = require("./generateFile");

const executePython = (filePath, inputFilePath) =>
  executeProcess("python3", [filePath], {
    inputFilePath,
    cwd: path.dirname(filePath),
    timeoutMs: 5000,
    ...getJobCredentials(filePath),
  });

module.exports={executePython};
