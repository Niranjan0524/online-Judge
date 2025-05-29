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
  titleName:{
    type:String,
    required:true
  },
  code:{
    type:String,
    required:true
  },
  status:{type:String,required:true,enum:['Accepted','Wrong Answer','Time Limit Exceeded','Error']},
  submittedAt:{type:Date,default:Date.now},
});


const Solution=mongoose.model('Solution',solutionSchema);
module.exports=Solution;