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