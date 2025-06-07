const supabaseClient = require('../service/supabaseClient');




exports.uploadFile=async(req,res)=>{

  const file=req.file;

  if(!file){
    return res.status(400).json({message:"No file Uploaded"});
  }

  const fileName=`${Date.now()}-${file.originalname}`;
  
  const {data,error}=await supabaseClient.storage.from('inputfiles').upload(fileName,file.buffer,{
    contentType:file.mimetype,
    upsert:true
  })

  if(error){
    return res.status(500).json({message:"Error uploading file",error});
  }

  return res.status(200).json({message:"File uploaded successfully",data,fileName});
}

exports.deleteFile=async(req,res)=>{  

  const {fileName}=req.body;

  if(!fileName){
    return res.status(400).json({message:"File name is required"});
  }
  const {error}=await supabaseClient.storage.from('inputfiles').remove([fileName]);

  if(error){
    return res.status(500).json({message:"Error deleting file",error});
  }

  return res.status(200).json({message:"File deleted successfully"});

}