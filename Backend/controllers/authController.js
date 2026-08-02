const User = require("../models/user");
const expressValidator = require("express-validator");  
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const Solution = require("../models/solution");
const Submission = require("../models/submissions");

const namevalidator=expressValidator
  .check("name")
  .notEmpty()
  .withMessage("Name is Required")
  .isLength({min:3})
  .withMessage("Name should be at least 3 characters long")
  .matches(/^[a-zA-Z ]+$/)
  .withMessage("Name should only contain alphabets");


const emailvalidator=expressValidator
  .check("email")
  .notEmpty()
  .withMessage("Email is Required")
  .isEmail()
  .withMessage("Email is not valid");

  const passwordvalidator = expressValidator
    .check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password should contain at least one number");

    const confirmPasswordValidator = expressValidator
      .check("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is Required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      });

exports.preSignup=[
  namevalidator,
  emailvalidator,
  passwordvalidator,
  confirmPasswordValidator,
  (req,res,next)=>{

    const errors=expressValidator.validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).json({
        errors:errors.array().map((error)=>error.msg)
      })
    }
    next();
  }
];


exports.signup = (req, res) => {
  console.log("signup req from the client");
  console.log("req body:", req.body);
  const { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        // If user exists, send response and STOP further execution
        return res.status(422).json({
          message: "Email already exists"
        });
      }
      // If user does not exist, hash password and create user
      return bcrypt.hash(req.body.password, 12)
        .then((hashedPassword) => {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            type: req.body.type,
          });

          return user.save();
        })
        .then((result) => {
     
          res.status(200).json({
            message: "User signed up successfully",
            user: result,
          });
        });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "Error creating user",
        error: error,
      });
    });
};
  

exports.login=async(req,res)=>{
  console.log("inside login controller");

  const {email,password}=req.body;

    const user =await  User.findOne({ email: email });
    console.log(user,"user");
    if(!user){
      return res.status(422).json({
        message:"User does not exist"
      })
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    console.log(user.password,"user password");
    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(422).json({
        message:"Invalid email or password"
      })
    }

    const token=jwt.sign({email,id:user._id},process.env.JWT_SECRET,{
      expiresIn:"10d"
    });

    res.json({
      message:"User Logged in successfully",
      token:token,
      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        type:user.type
      }
    }); 
}


exports.getUser=async(req,res)=>{
 
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({
      message:"Authorization header is missing"
    })
  }

  const token=authHeader.split(" ")[1];
  if(!token){
    return res.status(401).json({
      message:"Token is missing"
    })
  }

  console.log("valid token");

  const {id}=jwt.verify(token,process.env.JWT_SECRET);

  const user=await User.findById(id);

  if(!user){
    return res.status(401).json({
      message:"User not found"
    })
  }
  console.log("user in backend",user); 
  res.status(200).json({
    message:"User fetched Successfully",
    user:{
      _id:user._id,
      name:user.name,
      email:user.email,
      type:user.type
    },
    token:token
  })
}

exports.getPublicProfile=async(req,res)=>{
  try {
    const username = (req.params.username || "").trim();

    if (!username) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({
      name: { $regex: `^${escapedUsername}$`, $options: "i" }
    }).select("name type");

    if (!user) {
      return res.status(404).json({
        message: "User profile not found"
      });
    }

    const [submissionStats] = await Solution.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          acceptedSubmissions: {
            $sum: {
              $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalSubmissions: 1,
          acceptedSubmissions: 1
        }
      }
    ]);

    const [solvedStats] = await Solution.aggregate([
      {
        $match: {
          userId: user._id,
          status: "Accepted"
        }
      },
      {
        $group: {
          _id: "$problemId"
        }
      },
      {
        $count: "problemsSolved"
      }
    ]);

    const solvedByDifficulty = await Solution.aggregate([
      {
        $match: {
          userId: user._id,
          status: "Accepted"
        }
      },
      {
        $group: {
          _id: "$problemId"
        }
      },
      {
        $lookup: {
          from: "problems",
          localField: "_id",
          foreignField: "_id",
          as: "problem"
        }
      },
      { $unwind: "$problem" },
      {
        $group: {
          _id: "$problem.difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    const [contestStats] = await Submission.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: "$contestId"
        }
      },
      {
        $count: "totalContestsParticipated"
      }
    ]);

    const difficultyCounts = solvedByDifficulty.reduce((counts, item) => {
      counts[item._id] = item.count;
      return counts;
    }, { easy: 0, medium: 0, hard: 0 });

    const totalSubmissions = submissionStats?.totalSubmissions || 0;
    const acceptedSubmissions = submissionStats?.acceptedSubmissions || 0;
    const acceptanceRate = totalSubmissions
      ? Math.round((acceptedSubmissions / totalSubmissions) * 10000) / 100
      : 0;

    res.status(200).json({
      message: "Public profile fetched successfully",
      user: {
        name: user.name,
        username: user.name,
        type: user.type
      },
      stats: {
        problemsSolved: solvedStats?.problemsSolved || 0,
        easySolved: difficultyCounts.easy || 0,
        mediumSolved: difficultyCounts.medium || 0,
        hardSolved: difficultyCounts.hard || 0,
        totalSubmissions: totalSubmissions,
        acceptedSubmissions: acceptedSubmissions,
        acceptanceRate: acceptanceRate,
        totalContestsParticipated: contestStats?.totalContestsParticipated || 0
      }
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({
      message: "Error fetching public profile",
      error: error
    });
  }
}

exports.getSolutions=async(req,res)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({
      message:"Authorization header is missing"
    })
  }
  const token=authHeader.split(" ")[1];
  if(!token){
    return res.status(401).json({
      message:"Token is missing"
    })
  }
  console.log("valid token");
  const {id}=jwt.verify(token,process.env.JWT_SECRET);
  if(!id){
    return res.status(401).json({
      message:"Invalid token"
    })
  }
  console.log("id in getSolutions",id);
  const user=await User.findById(id);
  if(!user){
    res.status(404).json({
      message:"User not found"
    });
  }

  const solutions=await Solution.find({userId:id});


  res.status(200).json({
    message:"Solutions fetched successfully",
    solutions:solutions
  });
}
