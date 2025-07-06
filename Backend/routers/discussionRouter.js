const discussionRouter = require('express').Router();

const {getDiscussions,createDiscussion,addNewMessage,getAllMessages,deleteMessage,likeMessage,disLikeMessage}= require('../controllers/discussionController');
const { verifyUser } = require('../controllers/verifyUser');  

discussionRouter.get("/getAllDiscussions/:problemId", getDiscussions);
discussionRouter.post("/newDiscussion", createDiscussion);
discussionRouter.post("/newMessage", addNewMessage);
discussionRouter.get("/getAllMessages/:discussionId", getAllMessages);
discussionRouter.delete("/deleteMessage/:messageId", deleteMessage);
discussionRouter.post("/likeMessage/:messageId", likeMessage);
discussionRouter.post("/dislikeMessage/:messageId", disLikeMessage);

module.exports = discussionRouter;