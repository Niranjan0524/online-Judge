const mongoose=require('mongoose');


const testCaseSchema = new mongoose.Schema({
  input: mongoose.Schema.Types.Mixed,
  output: mongoose.Schema.Types.Mixed,
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
});

const TestCase = mongoose.model("Testcase", testCaseSchema);
module.exports = TestCase;