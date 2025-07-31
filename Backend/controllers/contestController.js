const Contest = require('../models/contest');
const Submission = require('../models/submissions');
const Solution = require('../models/solution');
const Problem = require('../models/problems');


exports.createContest=async(req,res)=>{
  const contestData=req.body;

  try{
    await Promise.all(contestData.map(async (contest)=>{
      if(!contest.title || !contest.description || !contest.startTime || !contest.endTime){
        return res.status(400).json({
          message: "All fields are required",
        })
      }
      if(new Date(contest.startTime) >= new Date(contest.endTime)){
        return res.status(400).json({
          message: "Start time must be before end time",
        })
      }

      if(new Date(contest.startTime) < new Date()){
        return res.status(400).json({
          message: "Start time must be in the future",
        })
      }
      
      const newContest=new Contest({
        title: contest.title,
        description: contest.description,
        problems: contest.problems || [],
        registeredUsers: contest.registeredUsers || [],
        startTime: new Date(contest.startTime),
        endTime: new Date(contest.endTime),
        createdBy: contest.createdBy,
        isActive: contest.isActive || false,
        createdAt: new Date(),
      });
      await newContest.save();
    }));  

    res.status(201).json({
      message: "Contest created successfully"
    })
  }
  catch(err){
    console.error("Error creating contest:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  } 

 
}



exports.getAllContests=async(req,res)=>{
  try{
    const contests=await Contest.find({});
    
    res.status(200).json({
      message: "Contests fetched successfully",
      contests: contests,
    })
  }
  catch(err){
    console.error("Error fetching contests:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

exports.getContestById=async(req,res)=>{

  const contestId=req.params.id;
  // console.log("Contest ID:", contestId);
  try{
    const contest=await Contest.findById(contestId);
    
    if(!contest){
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    res.status(200).json({
      message: "Contest fetched successfully",
      contest: contest,
    })
  }
  catch(err){
    console.error("Error fetching contest:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}



exports.registerUser=async(req,res)=>{
  const contestId=req.params.id;
  const userId=req.userId; // Assuming user ID is stored in req.user after authentication
  if(!contestId || !userId){
    return res.status(400).json({
      message: "Contest ID and User ID are required",
    });
  }

  try{
    const contest=await Contest.findById(contestId);
    
    if(!contest){
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // Check if user is already registered
    if(contest.registeredUsers.includes(userId)){
      return res.status(400).json({
        message: "User already registered for this contest",
      });
    }

    // Register user for the contest
    contest.registeredUsers.push(userId);
    await contest.save();

    res.status(200).json({
      message: "User registered for contest successfully",
      contest: contest,
    });

  }
  catch(err){
    console.error("Error registering user for contest:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

exports.unregisterUser=async(req,res)=>{
  const contestId=req.params.id;
  const userId=req.userId; // Assuming user ID is stored in req.user after authentication
  if(!contestId || !userId){
    return res.status(400).json({
      message: "Contest ID and User ID are required",
    });
  }

  try{
    const contest=await Contest.findById(contestId);
    
    if(!contest){
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // Check if user is registered
    if(!contest.registeredUsers.includes(userId)){
      return res.status(400).json({
        message: "User not registered for this contest",
      });
    }

    // Unregister user from the contest
    contest.registeredUsers = contest.registeredUsers.filter(id => id.toString() !== userId);
    await contest.save();

    res.status(200).json({
      message: "User unregistered from contest successfully",
      contest: contest,
    });

  }
  catch(err){
    console.error("Error unregistering user from contest:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

exports.submitSolution=async(req,res)=>{
  const { code, lang = "c++", problemId } = req.body;
  const {contestId} = req.params; 
  const id = req.userId;
  const userId = req.userId; // Assuming user ID is stored in req.user after authentication
  try{
    const response = await fetch(`${process.env.COMPILER_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        lang,
        problemId,
        id,
      }),
    });

    const submissionData=await response.json();
    console.log("Submission Data:", submissionData);
    const submission=await Submission.create({
      contestId: contestId,
      problemId: submissionData.solution.problemId,
      userId: userId,
      solutionId: submissionData.solutionId,
    });
    await submission.save();
  if(!response.ok){
    return res.status(500).json({
      message:"error"
    })
  }

  
  

  
  res.status(200).json({
    message: "Code submitted Successfully",
    output: submissionData.output,
    solution: submissionData.solution,
  });

  try{
    const io=req.app.get('io');
    if(io){
      const sampleLeaderboardData =getLeaderboardData(contestId);
      
      console.log("starting to emit leaderboard update");
      io.to(`contest-${contestId}`).emit("leaderboardUpdate",{
        contestId:contestId,
        leaderboard:sampleLeaderboardData,        
        message: "Leaderboard updated",
      });
      console.log("Leaderboard updated and emitted to contest room:", contestId);

    }
  }
  catch(err){
    console.error("Error emitting leaderboard update:", err);
  }

  }
  catch(err){
    console.log("Compiler Server Error:",err.message);
    res.status(500).json({
      message:"Compiler Error"
    });
  } 
}

exports.runCode = async (req, res) => {
  const { code, lang = "c++", problemId, input } = req.body;

  console.log("got it");
  try {
    const response = await fetch(`${process.env.COMPILER_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        lang,
        problemId,
        input,
      }),
    });

    const data = await response.json();


    if (!response.ok) {
      return res.status(500).json({
        message: "error",
      });
    }

    res.status(200).json({
      message: "Success",
      output: data.output,
    });
  } catch (err) {
    console.log("Compiler Server Error:", err.message);
    res.status(500).json({
      message: "Compiler Error",
    });
  }
};



exports.getTotalSolvedProblems=async(req,res)=>{
  const {contestId}=req.params;

  const userId = req.userId; 

  if(!contestId || !userId){
    return res.status(400).json({
      message: "Contest ID and User ID are required",
    });
  }


  try{
    let totalSolved=new Map();

    const submissions=await Submission.find({contestId:contestId,userId:userId});
    
    for(const sub of submissions){
      const solution = await Solution.findById(sub.solutionId);
      if(solution.status==="Accepted"){
        totalSolved.set(sub.problemId.toString(), sub);
      }
    }

    res.status(200).json({
      message: "Total solved problems fetched successfully",
      totalSolved: totalSolved.size
    });
  }
  catch(err){
    console.error("Error fetching total submissions:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
  
}

exports.getAllSubmissions=async(req,res)=>{
  const {contestId} = req.params;
  const userId = req.userId;
  if(!contestId || !userId){
    return res.status(400).json({
      message: "Contest ID and User ID are required",
    });
  }

  try{

  const submissions=await Submission.find({contestId: contestId, userId: userId});

  console.log("Submissions:", submissions.length);
  let allSubmissions=[];


  for(const sub of submissions){
    const sol=await Solution.findById(sub.solutionId);
    if(sol){
      const data={
        title:sol.titleName,
        lang: sol.lang,
        status: sol.status,
        submittedAt: sol.submittedAt,
        solutionId: sub.solutionId,
      }
      allSubmissions.push(data);
    }
  }
  console.log("All Submissions:", allSubmissions.length);
  res.status(200).json({
    message: "All submissions fetched successfully",
    submissions: allSubmissions,
  });
}
catch(err){
  console.error("Error fetching all submissions:", err);
  return res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });

}
}


const getLeaderboardData=async(contestId)=>{

  console.log("Contest ID",contestId);

  try{
    const contestSubmissions=await Submission.find({contestId:contestId});
    console.log("Contest Submissions:", contestSubmissions.length);
    
    const contestDetails=await Contest.find({_id:contestId});
    const userIDs=contestDetails.registeredUsers;


    const contestStartTime=new Date(contestDetails.startTime).getTime();


    let leaderboardData=await Promise.all(
      userIDs.map(async(userId)=>{
        const userSubmissions=await Submission.find({contestId: contestId, userId: userId}).sort({createdAt:1});

        const uniqueProblemSolved=new Set();
        const totalSubmissions=userSubmissions.length;
        if(totalSubmissions===0) return null;

        let lastcorrectSubmissionTime = contestStartTime;

        let totalPoints=0;
        
        userSubmissions.forEach(async(sub)=>{
          
          const sol=await Solution.findById(sub.solutionId);
          if(!sol) return;

          const problemId=sol.problemId.toString();
          const problem=await Problem.findById(problemId);
          if(!problem) return;
          const problemDifficulty=problem.difficulty;
          
          const submissionTime=new Date(sub.createdAt).getTime();
          const timeDiffInMinutes=(submissionTime - lastcorrectSubmissionTime)/ (1000 * 60);

          if (!uniqueProblemSolved.has(problemId) && sol.status === "Accepted") {
            uniqueProblemSolved.add(problemId);
            totalPoints+=problemDifficulty==='easy'? 100 : problemDifficulty==='medium'? 200 : 300;
            totalPoints-=timeDiffInMinutes;
            lastcorrectSubmissionTime = submissionTime;
          }
          else if(!uniqueProblemSolved.has(problemId) && sol.status === "Wrong Answer"){
            totalPoints-=20;
          }
          else if(!uniqueProblemSolved.has(problemId) && sol.status === "Time Limit Exceeded"){
            totalPoints-=10;
          }       
        });
        const userName = await User.findById(userId).then(user => user ? user.name : "Unknown User");
        
        const accuracy = (uniqueProblemSolved.size / totalSubmissions) * 100 || 0;
        return {
          userId:userId,
          userName:userName,
          noOfProblemsSolved: uniqueProblemSolved.size,
          totalPoints: totalPoints,
          totalSubmissions: totalSubmissions,
          accuracy: accuracy.toFixed(2)       
        }
      })
    );

    leaderboardData=leaderboardData.sort((a,b) => b.totalPoints - a.totalPoints);
    return leaderboardData.filter(data => data !== null);
    }
    catch(err){
      console.error("Error fetching leaderboard data:", err);
      return null;
    }
}