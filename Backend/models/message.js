const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
  discussionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discussion",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [mongoose.Schema.Types.ObjectId],
  dislikes: [mongoose.Schema.Types.ObjectId],
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;