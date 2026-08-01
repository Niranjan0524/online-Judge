const discussionRouter = require('express').Router();

const {getDiscussions,createDiscussion,addNewMessage,getAllMessages,deleteMessage,likeMessage,disLikeMessage}= require('../controllers/discussionController');
const { verifyUser } = require('../controllers/verifyUser');  

discussionRouter.get("/problems/:problemId/discussions", getDiscussions);
discussionRouter.post("/problems/:problemId/discussions", createDiscussion);
discussionRouter.post("/discussions/:discussionId/messages", addNewMessage);
discussionRouter.get("/discussions/:discussionId/messages", getAllMessages);
discussionRouter.delete("/messages/:messageId", deleteMessage);
discussionRouter.post("/messages/:messageId/likes", likeMessage);
discussionRouter.post("/messages/:messageId/dislikes", disLikeMessage);

module.exports = discussionRouter;
