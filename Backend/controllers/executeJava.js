const fs=require("fs");
const path=require("path");
const {exec}=require("child_process");
const { stderr } = require("process");

const outputPath=path.join(__dirname,"../","outputs");
if(!fs.existsSync(outputPath)){
  fs.mkdirSync(outputPath,{recursive:true});
}


const executeJava=async(filePath)=>{

  const fileName=path.basename(filePath).split(".")[0];
  const outputFileName=path.join(outputPath,fileName+".class");

  return new Promise((resolve,reject)=>{
    exec(
      `javac "${filePath}" -d "${outputPath}" && cd "${outputPath}" && java "${fileName}"`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      }
    );
  })
}

module.exports={executeJava};