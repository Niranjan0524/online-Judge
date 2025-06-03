const mongoose = require('mongoose');

const discussionSchema=new mongoose.Schema({
  problemId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Problem',
    required:true
  },
  title:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  updatedAt:{
    type:Date,
    default:Date.now
  }
});

const Discussion=mongoose.model('Discussion',discussionSchema);

module.exports=Discussion;  