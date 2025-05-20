const fs=require('fs');
const path=require('path');
const { v4: uuid } = require("uuid");

const dirCodes=path.join(__dirname,"../","codes");

if(!fs.existsSync(dirCodes)){
  fs.mkdirSync(dirCodes,{recursive:true});
}

const generateFile=(code,lang,className=NULL)=>{
  let jobId;
  if(lang==="java"){
    jobId=className;
  }
  else{
    jobId=uuid();
  }
  
  const fileName=`${jobId}.${lang}`;
  const filePath=path.join(dirCodes,fileName);
  fs.writeFile(filePath,code,(err)=>{
    if(err) throw err;
  });

  return filePath;
};


module.exports={generateFile};