const fs=require("fs");
const path=require("path");
const {v4:uuid}=require("uuid");

const dirInputs=path.join(__dirname,"../","inputs");

if(!fs.existsSync(dirInputs)){
  fs.mkdirSync(dirInputs,{recursive:true});
}

const formatInput = (inputObj) => {
  // Join nums array as space-separated string
  const inputArray=inputObj.split("\n");
  const formattedInput=inputArray.map((line)=>line.trim()).join("\n");

  return formattedInput;
};

const generateInputFile=(inputObj)=>{
  const jobId=uuid();
  const inputFilePath=path.join(dirInputs,`${jobId}.txt`);
  let inputText = inputObj;
  if (typeof inputObj === "object") {
    // Use your formatInput function here!
    inputText = formatInput(inputObj);
  }
  fs.writeFileSync(inputFilePath,inputText);
  
  return inputFilePath;
}

module.exports={generateInputFile};