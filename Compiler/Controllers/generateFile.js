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

const ensureJobDirectory = async (directoryPath) => {
  await fs.promises.mkdir(dirCodes, { recursive: true, mode: 0o711 });
  if (process.platform === "linux") await fs.promises.chmod(dirCodes, 0o711);
  await fs.promises.mkdir(directoryPath, { mode: 0o700 });
};

const generateFile = async (code, lang, className = null) => {
  const extension = languageExtensions[lang];
  if (!extension) throw new Error("Unsupported programming language");

  if (
    lang === "java" &&
    (typeof className !== "string" || !/^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(className))
  ) {
    throw new Error("Invalid Java class name");
  }

  const jobDir = path.join(dirCodes, uuid());
  try {
    await ensureJobDirectory(jobDir);
    const fileName = lang === "java" ? `${className}${extension}` : `main${extension}`;
    const filePath = path.join(jobDir, fileName);
    const credentials = process.platform === "linux" && process.geteuid?.() === 0
      ? { uid: randomInt(10000, 60000), gid: randomInt(10000, 60000) }
      : {};

    await fs.promises.writeFile(filePath, code, { encoding: "utf8", mode: 0o600, flag: "wx" });
    if (credentials.uid !== undefined) {
      await fs.promises.chown(jobDir, credentials.uid, credentials.gid);
      await fs.promises.chown(filePath, credentials.uid, credentials.gid);
    }
    jobCredentials.set(jobDir, credentials);
    return filePath;
  } catch (error) {
    await fs.promises.rm(jobDir, { recursive: true, force: true });
    jobCredentials.delete(jobDir);
    throw error;
  }
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
