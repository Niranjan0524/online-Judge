const Contest = require('../models/contest');
const Submission = require('../models/submissions');
const Solution = require('../models/solution');
const Problem = require('../models/problems');
const Leaderboard = require('../models/leaderboard');
const User=require('../models/user');

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
      const sampleLeaderboardData =await getLeaderboardData(contestId);
      console.log("Sample Leaderboard Data:", sampleLeaderboardData);
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

const getLeaderboardData = async (contestId) => {
  console.log("Contest ID", contestId);

  try {
    const contestSubmissions = await Submission.find({ contestId: contestId });
    console.log("Contest Submissions:", contestSubmissions.length);

    const contestDetails = await Contest.findById(contestId);

    if (!contestDetails) {
      console.error("Contest not found");
      return [];
    }

    const userIDs = contestDetails.registeredUsers;

    if (!userIDs || userIDs.length === 0) {
      console.log("No registered users");
      return [];
    }

    const contestStartTime = new Date(contestDetails.startTime).getTime();

    let leaderboardData = await Promise.all(
      userIDs.map(async (userId) => {
        const userSubmissions = await Submission.find({
          contestId: contestId,
          userId: userId,
        }).sort({ createdAt: 1 });

        const uniqueProblemSolved = new Set();
        const totalSubmissions = userSubmissions.length;

        if (totalSubmissions === 0) return null;

        let totalPoints = 0;
        const problemFirstAttempt = new Map(); // Track first attempt for each problem

        let totalCorrectSubmissions = 0;
        // ✅ Fix: Proper scoring logic
        for (const sub of userSubmissions) {
          try {
            const sol = await Solution.findById(sub.solutionId);
            if (!sol) continue;

            const problemId = sol.problemId.toString();
            const problem = await Problem.findById(problemId);
            if (!problem) continue;

            const problemDifficulty = problem.difficulty;
            const submissionTime = new Date(sub.createdAt).getTime();

            // ✅ Track first attempt time for each problem
            if (!problemFirstAttempt.has(problemId)) {
              problemFirstAttempt.set(problemId, submissionTime);
            }
            
            if(sol.status == "Accepted") totalCorrectSubmissions++;

            // ✅ Only process if problem not yet solved
            if (!uniqueProblemSolved.has(problemId)) {
              if (sol.status === "Accepted") {
                uniqueProblemSolved.add(problemId);

                // Calculate time taken from first attempt to solve
                const firstAttemptTime = problemFirstAttempt.get(problemId);
                const timeToSolveMinutes =
                  (submissionTime - firstAttemptTime) / (1000 * 60);

                // ✅ Base points
                let basePoints = 0;
                switch (problemDifficulty) {
                  case "easy":
                    basePoints = 100;
                    break;
                  case "medium":
                    basePoints = 200;
                    break;
                  case "hard":
                    basePoints = 300;
                    break;
                  default:
                    basePoints = 100;
                }

                // ✅ Calculate final points (ensure no NaN)
                const timePoints = Math.max(0, timeToSolveMinutes) || 0;
                const problemPoints = Math.max(0, basePoints - timePoints);
                totalPoints += problemPoints;

              } else if (sol.status === "Wrong Answer") {
                totalPoints -= 20;
              } else if (sol.status === "Time Limit Exceeded") {
                totalPoints -= 10;
              }
            }
          } catch (innerErr) {
            console.error("Error processing submission:", innerErr);
            continue;
          }
        }

        // ✅ Ensure totalPoints is never NaN
        totalPoints = isNaN(totalPoints) ? 0 : totalPoints;
        totalPoints = Math.max(0, totalPoints); // Ensure non-negative

        // ✅ Fix: Better user name fetching with error handling
        let userName = "Unknown User";
        try {
          const user = await User.findById(userId);
          userName = user ? user.name : "Unknown User";
        } catch (userErr) {
          console.error("Error fetching user:", userErr);
        }

        const accuracy =
          totalSubmissions > 0
            ? (totalCorrectSubmissions / totalSubmissions) * 100
            : 0;

        // ✅ Validate all values before returning
        const leaderboardEntry = {
          userId: userId,
          userName: userName,
          noOfProblemsSolved: uniqueProblemSolved.size || 0,
          totalPoints: Math.round(totalPoints) || 0, // Ensure it's a valid number
          totalSubmissions: totalSubmissions || 0,
          accuracy: Math.round((accuracy || 0) * 100) / 100, // Round to 2 decimal places
          totalContestProblems: contestDetails.problems.length || 0,
        };

        // ✅ Final validation - check for NaN values
        Object.keys(leaderboardEntry).forEach((key) => {
          if (
            typeof leaderboardEntry[key] === "number" &&
            isNaN(leaderboardEntry[key])
          ) {
            console.error(`NaN detected in ${key}, setting to 0`);
            leaderboardEntry[key] = 0;
          }
        });

        console.log(`User ${userName}: ${leaderboardEntry.totalPoints} points`);
        return leaderboardEntry;
      })
    );

    // ✅ Filter out nulls and validate data
    leaderboardData = leaderboardData
      .filter((data) => data !== null)
      .filter((data) => !isNaN(data.totalPoints)) // Extra safety
      .sort((a, b) => b.totalPoints - a.totalPoints);

    console.log("Final leaderboard data:", leaderboardData);

    // ✅ Fix: Add contestName and better error handling
    try {
      await Leaderboard.updateOne(
        { contestId: contestId },
        {
          $set: {
            contestName: contestDetails.title,
            leaderboard: leaderboardData,
            lastUpdated: new Date(),
          },
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error("Error updating leaderboard in database:", dbErr);
    }

    return leaderboardData;
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    return [];
  }
};