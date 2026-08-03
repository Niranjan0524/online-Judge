const mongoose=require('mongoose')
const {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
  normalizeUsername,
  isReservedUsername,
} = require("../service/usernameValidation");

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
  username: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    minlength: USERNAME_MIN_LENGTH,
    maxlength: USERNAME_MAX_LENGTH,
    match: USERNAME_PATTERN,
    set: normalizeUsername,
    validate: {
      validator: (username) => !username || !isReservedUsername(username),
      message: "Username is reserved",
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  type:{type:String,enum:['user','admin'],default:'user'},
  privacySettings: { type: profilePrivacySchema, default: () => ({}) },
});

userSchema.index({ username: 1 }, { unique: true, sparse: true });

const User=mongoose.model('User',userSchema);
module.exports=User;
