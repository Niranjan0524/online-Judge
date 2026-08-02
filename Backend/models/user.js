const mongoose=require('mongoose')

const profilePrivacySchema = new mongoose.Schema(
  {
    publicProfile: { type: String, enum: ["public", "private"], default: "public" },
    solvedProblems: { type: String, enum: ["public", "private"], default: "public" },
    submissionHistory: { type: String, enum: ["public", "private"], default: "public" },
    contestHistory: { type: String, enum: ["public", "private"], default: "public" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  type:{type:String,enum:['user','admin'],default:'user'},
  privacySettings: { type: profilePrivacySchema, default: () => ({}) },
});


const User=mongoose.model('User',userSchema);
module.exports=User;
