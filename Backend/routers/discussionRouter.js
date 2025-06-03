const discussionRouter = require('express').Router();

const {getDiscussions,createDiscussion,addNewMessage,getAllMessages}= require('../controllers/discussionController');
const { verifyUser } = require('../controllers/verifyUser');  

discussionRouter.get("/getAllDiscussions/:problemId", verifyUser, getDiscussions);
discussionRouter.post("/newDiscussion", verifyUser, createDiscussion);
discussionRouter.post("/newMessage", verifyUser, addNewMessage);
discussionRouter.get("/getAllMessages/:discussionId", verifyUser, getAllMessages);

module.exports = discussionRouter;