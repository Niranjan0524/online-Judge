const discussionRouter = require('express').Router();

const {getDiscussions,createDiscussion,addNewMessage,getAllMessages,deleteMessage,likeMessage,disLikeMessage}= require('../controllers/discussionController');
const { verifyUser } = require('../controllers/verifyUser');  

discussionRouter.get("/getAllDiscussions/:problemId", verifyUser, getDiscussions);
discussionRouter.post("/newDiscussion", verifyUser, createDiscussion);
discussionRouter.post("/newMessage", verifyUser, addNewMessage);
discussionRouter.get("/getAllMessages/:discussionId", verifyUser, getAllMessages);
discussionRouter.delete("/deleteMessage/:messageId", verifyUser, deleteMessage);
discussionRouter.post("/likeMessage/:messageId", verifyUser, likeMessage);
discussionRouter.post("/dislikeMessage/:messageId", verifyUser, disLikeMessage);

module.exports = discussionRouter;