const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const formatInput = (inputObj) => {
  // Join nums array as space-separated string
  const numsLine = Array.isArray(inputObj.nums) ? inputObj.nums.join(" ") : "";
  // Target on next line
  const targetLine = inputObj.target !== undefined ? inputObj.target : "";
  console.log("formatted input", `${numsLine}\n${targetLine}`);
  return `${inputObj.n}\n${numsLine}\n${targetLine}`;
};


const outputPath = path.join(__dirname,"../", "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath,inputFilePath) => {

  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  // const formattedInput = formatInput(testCases[4].input);
  

  // const inputFilePath=path.join(outputPath,`${jobId}_input.txt`);
  // fs.writeFileSync(inputFilePath,formattedInput);

  return new Promise((resolve, reject) => {
    exec(
      `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
