const mongoose = require("mongoose");

const submissionSchema=new mongoose.Schema({

  contestId:{type:mongoose.Schema.Types.ObjectId,ref:'Contest',required:true},
  problemId:{type:mongoose.Schema.Types.ObjectId,ref:'Problem',required:true},
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  solutionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Solution',
    required:true
  },
});


const Submission=mongoose.model('Submission',submissionSchema);
module.exports=Submission;