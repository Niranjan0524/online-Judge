const fs = require("fs");
const path = require("path");
const { randomInt } = require("crypto");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "../", "codes");
const languageExtensions = {
  cpp: ".cpp",
  py: ".py",
  js: ".js",
  java: ".java",
};
const jobCredentials = new Map();

const ensureJobDirectory = (directoryPath) => {
  fs.mkdirSync(dirCodes, { recursive: true, mode: 0o711 });
  if (process.platform === "linux") fs.chmodSync(dirCodes, 0o711);
  fs.mkdirSync(directoryPath, { mode: 0o700 });
};

const generateFile = (code, lang, className = null) => {
  const extension = languageExtensions[lang];
  if (!extension) throw new Error("Unsupported programming language");

  if (
    lang === "java" &&
    (typeof className !== "string" || !/^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(className))
  ) {
    throw new Error("Invalid Java class name");
  }

  const jobDir = path.join(dirCodes, uuid());
  ensureJobDirectory(jobDir);
  const fileName = lang === "java" ? `${className}${extension}` : `main${extension}`;
  const filePath = path.join(jobDir, fileName);
  const credentials = process.platform === "linux" && process.geteuid?.() === 0
    ? { uid: randomInt(10000, 60000), gid: randomInt(10000, 60000) }
    : {};

  fs.writeFileSync(filePath, code, { encoding: "utf8", mode: 0o600, flag: "wx" });
  if (credentials.uid !== undefined) {
    fs.chownSync(jobDir, credentials.uid, credentials.gid);
    fs.chownSync(filePath, credentials.uid, credentials.gid);
  }
  jobCredentials.set(jobDir, credentials);
  return filePath;
};

const getJobCredentials = (filePath) => jobCredentials.get(path.dirname(filePath)) || {};

const cleanupJob = (filePath) => {
  if (!filePath) return;

  const resolvedDirectory = path.resolve(path.dirname(filePath));
  const resolvedCodesDirectory = path.resolve(dirCodes);
  if (!resolvedDirectory.startsWith(`${resolvedCodesDirectory}${path.sep}`)) {
    throw new Error("Refusing to remove a path outside the job directory");
  }

  fs.rmSync(resolvedDirectory, { recursive: true, force: true });
  jobCredentials.delete(resolvedDirectory);
};

module.exports = { generateFile, cleanupJob, getJobCredentials, dirCodes };
