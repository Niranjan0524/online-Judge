const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInputs = path.join(__dirname, "../", "inputs");

if (!fs.existsSync(dirInputs)) {
  console.log("Creating inputs directory...");
  fs.mkdirSync(dirInputs, { recursive: true });
}

const formatInput = (input) => {
  if (input === null || input === undefined) return "";

  // Primitives
  if (
    typeof input === "number" ||
    typeof input === "boolean" ||
    typeof input === "string"
  ) {
    return String(input);
  }
  // Array of primitives or arrays/objects
  if (Array.isArray(input)) {
    // If it's a 2D array, print each row on a new line
    if (input.length > 0 && Array.isArray(input[0])) {
      return input.map((row) => formatInput(row)).join("\n");
    }
    // 1D array: print space-separated
    return input.map((item) => formatInput(item)).join(" ");
  }

  // Object: print each key-value pair on a new line, or flatten if keys are standard (like LeetCode)
  if (typeof input === "object") {
    // Special handling for LeetCode-style objects (like {"capacity":2,"operations":[...]})
    // Print each value on a new line, in key order
    return Object.values(input)
      .map((val) => formatInput(val))
      .join("\n");
  }

  // Fallback
  return String(input);
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
