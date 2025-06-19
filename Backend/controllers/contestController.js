const Contest = require('../models/contest');

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