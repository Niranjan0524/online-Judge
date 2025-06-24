const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");


const executePython=async(filePath)=>{

  return new Promise((resolve,reject)=>{
    exec(`python "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  })

}

module.exports={executePython};