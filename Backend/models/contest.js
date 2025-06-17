const mongoose = require('mongoose');
const { create } = require('./user');

const contestSchema=new mongoose.Schema({
  title:{type:String,required:true},
  description:{type:String,required:true},
  problems:[{type:mongoose.Schema.Types.ObjectId, ref:'Problem'}],
  registeredUsers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  startTime:{type:Date,required:true},
  endTime:{type:Date,required:true},
  createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  isActive:{type:Boolean,default:true},
  createdAt:{type:Date,default:Date.now},
})

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;