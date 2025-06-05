const Discussion = require('../models/discussion');
const Message = require('../models/message');

exports.getDiscussions=async(req,res)=>{
  const problemId = req.params.problemId;
 
  if (!problemId) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try{
    
     const discussions=await Discussion.find({ problemId: problemId });
   
    if (!discussions || discussions.length === 0) {
      return res.status(200).json({ message: "No discussions found for this problem",discussions: [] });
    }

    
  res
    .status(200)
    .json({
      message: "Discussions fetched successfully",
      discussions: discussions,
    });
  } catch(err){
    return res.status(500).json({ message: "Error fetching discussions"});
  }

}

exports.createDiscussion=async(req,res)=>{

  const { problemId, title } = req.body;
  if (!problemId || !title) {
    return res.status(400).json({ message: "Problem ID and title are required" });
  }

  
  try{
    const newDiscussion=new Discussion({
      problemId: problemId,
      title: title,
    });
    await newDiscussion.save();
    
  res
    .status(201)
    .json({ message: "Discussion created successfully", discussion: newDiscussion });
  }
  catch(err){
    return res.status(500).json({ message: "Error creating discussion", error: err.message });
  }

}

exports.addNewMessage=async(req,res)=>{

  const { discussionId, message } = req.body;
  const userId = req.userId; 
  if (!discussionId || !message) {
    return res.status(400).json({ message: "Discussion ID and message are required" });
  }

  try{
    const newMessage=new Message({
      discussionId: discussionId,
      userId: userId,
      message: message,
    });
    await newMessage.save();

    res.status(201).json({
      message: "Message added successfully",
      newMessage: newMessage,
    }); 
  }
  catch(err){
    return res.status(500).json({ message: "Error adding message", error: err.message });
  }
}

exports.getAllMessages=async(req,res)=>{  

  const discussionId=req.params.discussionId;

  if (!discussionId) {
    return res.status(400).json({ message: "Discussion ID is required" });
  } 

  try{
    const messages=await Message.find({discussionId});

    res.status(200).json({
      message: "Messages fetched successfully",
      messages: messages,
    });
  } catch(err){
    return res.status(500).json({ message: "Error fetching messages", error: err.message });
  }

}

exports.deleteMessage=async(req,res)=>{

  const messageId=req.params.messageId;

  if(!messageId){
    return res.status(400).json({
      message: "Message ID is required"
    })
  }

  try{
    const deletedMessage=await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    const discussionId=deletedMessage.discussionId;
    const remainingMessages=await Message.find({discussionId});

    res.status(200).json({
      message: "Message deleted successfully",
      remainingMessages: remainingMessages,
    });
  }
  catch(err){
    return res.status(500).json({ message: "Error deleting message", error: err.message });
  }
}


exports.likeMessage=async(req,res)=>{

  const messageId = req.params.messageId;
  if(!messageId){
    return res.status(400).json({ message: "Message ID is required" });
  }

  try{
    const message= await Message.findById(messageId);
    const userHadLiked=message.likes.includes(req.userId);

    if(userHadLiked){
      message.likes=message.likes.filter((uId)=>{
        return uId.toString()!== req.userId.toString();
      });
     
    }
    else{
      message.likes.push(req.userId);
      if(message.dislikes.includes(req.userId)){
        message.dislikes=message.dislikes.filter((uId)=>{
          return uId.toString()!== req.userId.toString();
        });
      }
      
    }
    
    await message.save();

    
    res.status(200).json({
      message: "Message liked successfully",
      likes: message.likes,
      dislikes: message.dislikes,
    });

  } catch(err){
    return res.status(500).json({ message: "Error liking message", error: err.message });
  }
}

exports.disLikeMessage=async(req,res)=>{

  const messageId = req.params.messageId;
  if(!messageId){
    return res.status(400).json({ message: "Message ID is required" });
  }

  try{
    const message= await Message.findById(messageId);
    
    const userHadDisliked=message.dislikes.includes(req.userId);
    console.log("status of disliked",userHadDisliked);
    if(userHadDisliked){
      console.log("user had disliked");
      message.dislikes=message.dislikes.filter((uId)=>{
        return uId.toString()!== req.userId.toString();
      });
    }
    else{
      message.dislikes.push(req.userId);
      if(message.likes.includes(req.userId)){
        message.likes=message.likes.filter((uId)=>{
          return uId.toString()!== req.userId.toString();
        });
      }
    }
    await message.save();
    
    res.status(200).json({
      message: "Message disliked successfully",
      dislikes: message.dislikes,
      likes: message.likes,
    });
  }
  catch(err){
    return res.status(500).json({ message: "Error disliking message", error: err.message });
  }
}