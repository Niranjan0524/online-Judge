const Discussion = require('../models/discussion');
const Message = require('../models/message');
const User = require('../models/user');

const enrichMessagesWithUser = async (messages) => {
  const messageDocs = messages.map((msg) =>
    typeof msg.toObject === "function" ? msg.toObject() : { ...msg }
  );
  const userIds = [
    ...new Set(
      messageDocs
        .map((msg) => msg.userId?.toString())
        .filter(Boolean)
    ),
  ];

  if (userIds.length === 0) {
    return messageDocs.map((msg) => ({
      ...msg,
      name: undefined,
      username: undefined,
    }));
  }

  const users = await User.find({ _id: { $in: userIds } }).select("name username");
  const usersById = users.reduce((acc, user) => {
    acc[user._id.toString()] = user;
    return acc;
  }, {});

  return messageDocs.map((msg) => {
    const user = usersById[msg.userId?.toString()];
    return {
      ...msg,
      name: user ? user.name : undefined,
      username: user ? user.username : undefined,
    };
  });
};

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

    const [enrichedMessage] = await enrichMessagesWithUser([newMessage]);

    res.status(201).json({
      message: "Message added successfully",
      newMessage: enrichedMessage,
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
    const enrichedMessages = await enrichMessagesWithUser(messages);

    res.status(200).json({
      message: "Messages fetched successfully",
      messages: enrichedMessages,
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
    const enrichedMessages = await enrichMessagesWithUser(remainingMessages);

    res.status(200).json({
      message: "Message deleted successfully",
      remainingMessages: enrichedMessages,
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
