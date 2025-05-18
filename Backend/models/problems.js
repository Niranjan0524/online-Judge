const mongoose=require('mongoose');

const problemSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    difficulty:{type:String,enum:['easy','medium','hard'],default:'easy'},
    tags:[{type:String}]
})

// problemSchema.pre('save', async function (next) {
//   if (this.isNew) {
//     const lastProblem = await this.constructor.findOne().sort({ seqNo: -1 });
//     this.seqNo = lastProblem ? lastProblem.seqNo + 1 : 1;
//   }
//   next();
// });
const Problem=mongoose.model('Problem',problemSchema);
module.exports=Problem;

