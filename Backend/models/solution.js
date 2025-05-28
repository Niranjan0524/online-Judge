const mongoose = require('mongoose');

const solutionSchema=new mongoose.Schema({
  problemId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Problem',
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  code:{
    type:String,
    required:true
  }
});


const Solution=mongoose.model('Solution',solutionSchema);
module.exports=Solution;