const fs=require("fs");
const path=require("path");
const {exec}=require("child_process");  


const executeJavaScript=async(filePath)=>{

  return new Promise((resolve,reject)=>{

    exec(`node "${filePath}"`,(error,stdout,stderr)=>{
      if(error){
        reject({error,stderr});
      }
      else if(stderr){
        reject(stderr);
      }
      else{
        resolve(stdout);
      }
    })
  })
}

module.exports={executeJavaScript};