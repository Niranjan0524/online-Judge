const generateAIReview=async(code)=>{



  return {message:"this is your AI review", code: code, score: 85, feedback: "Good job! Your code is well structured and follows best practices."};
}


module.exports={generateAIReview};