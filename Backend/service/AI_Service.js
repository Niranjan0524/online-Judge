const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI=new GoogleGenerativeAI(
   process.env.API_KEY
);



const AI_Service = async (code,problem) => {
  const modelName = "gemini-2.0-flash";
  const prompt = `You are an expert code reviewer. Please review the following code and mention the errors if there are any, and provide feedback on its quality, structure, and adherence to best practices. Provide a score out of 100 and specific feedback.
  And dont give the updated or corrected code, just the give above mentioned things.
  Problem Title: ${problem.title}

  Here is the problem statement for context:

  ${problem.description}
Here is the code to review:
\`\`\`
${code}
\`\`\`
`;
  const model = genAI.getGenerativeModel({ model: modelName });

  try{
    const result =await model.generateContent(prompt);

    return result.response.text();
    
  }
  catch(err){
    console.error("Error generating AI response:", err);
    return {
      error: err.message || "An error occurred while generating the AI response." 
    };
  }
  
};

module.exports = { AI_Service };
