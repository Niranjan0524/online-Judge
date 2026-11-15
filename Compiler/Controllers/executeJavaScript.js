const path = require("path");
const executeProcess = require("./executeProcess");
const { getJobCredentials } = require("./generateFile");

const executeJavaScript = (filePath, inputFilePath, signal) =>
  executeProcess("node", [filePath], {
    inputFilePath,
    signal,
    cwd: path.dirname(filePath),
    timeoutMs: 5000,
    ...getJobCredentials(filePath),
  });

module.exports={executeJavaScript};
