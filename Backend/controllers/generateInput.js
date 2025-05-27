const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInputs = path.join(__dirname, "../", "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const formatInput = (inputObj) => {
 

  let formattedInput = "";
  for (const key in inputObj) {
    const value = inputObj[key];
    if (Array.isArray(value)) {
      formattedInput += value.join(" ") + "\n";
    } else {
      formattedInput += value + "\n";
    }
  }
  return formattedInput;
};

const generateInput= (inputObj) => {
  const jobId = uuid();
  const inputFilePath = path.join(dirInputs, `${jobId}.txt`);
  let inputText = inputObj;
  if (typeof inputObj === "object") {
    // Use your formatInput function here!
    inputText = formatInput(inputObj);
  }
  fs.writeFileSync(inputFilePath, inputText);

  return inputFilePath;
};

module.exports = { generateInput};
