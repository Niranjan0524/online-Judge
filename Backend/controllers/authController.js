const User = require("../models/user");
const expressValidator = require("express-validator");  
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const Solution = require("../models/solution");
const Submission = require("../models/submissions");
const {
  normalizeProfilePrivacy,
  validateProfilePrivacy,
  getViewerIdFromRequest,
  isProfileOwner,
  canViewProfileSection,
} = require("../service/profilePrivacy");
const {
  normalizeUsername,
  validateUsername,
} = require("../service/usernameValidation");

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

const usernamevalidator=expressValidator
  .check("username")
  .notEmpty()
  .withMessage("Username is Required")
  .custom((value) => {
    const errors = validateUsername(value);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }
    return true;
  });

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
  usernamevalidator,
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
  const email = (req.body.email || "").trim().toLowerCase();
  const username = normalizeUsername(req.body.username);

  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((user) => {
      if (user) {
        if (user.username === username) {
          return res.status(422).json({
            message: "Username already exists"
          });
        }

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
            username: username,
            email: email,
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
      if (error.code === 11000 && error.keyPattern?.username) {
        return res.status(422).json({
          message: "Username already exists"
        });
      }
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(422).json({
          message: "Email already exists"
        });
      }
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
        username:user.username,
        email:user.email,
        type:user.type,
        privacySettings: normalizeProfilePrivacy(user.privacySettings)
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
      username:user.username,
      email:user.email,
      type:user.type,
      privacySettings: normalizeProfilePrivacy(user.privacySettings)
    },
    token:token
  })
}

exports.updateUserProfile=async(req,res)=>{
  try {
    const userId = req.userId;
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const requestedPrivacySettings = req.body.privacySettings;
    const errors = [];

    if (!name) {
      errors.push("Name is Required");
    }
    if (name && name.length < 3) {
      errors.push("Name should be at least 3 characters long");
    }
    if (name && !/^[a-zA-Z ]+$/.test(name)) {
      errors.push("Name should only contain alphabets");
    }
    if (!email) {
      errors.push("Email is Required");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Email is not valid");
    }
    if (requestedPrivacySettings) {
      errors.push(...validateProfilePrivacy(requestedPrivacySettings));
    }

    if (errors.length > 0) {
      return res.status(422).json({
        errors: errors
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const existingEmail = await User.findOne({
      email: email,
      _id: { $ne: userId }
    });
    if (existingEmail) {
      return res.status(422).json({
        message: "Email already exists"
      });
    }

    user.name = name;
    user.email = email;
    if (requestedPrivacySettings) {
      const currentPrivacySettings =
        user.privacySettings?.toObject?.() || user.privacySettings || {};
      user.privacySettings = normalizeProfilePrivacy({
        ...currentPrivacySettings,
        ...requestedPrivacySettings
      });
    }
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        type: user.type,
        privacySettings: normalizeProfilePrivacy(user.privacySettings)
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error
    });
  }
}

exports.checkUsername=async(req,res)=>{
  try {
    const username = normalizeUsername(req.query.username);
    const errors = validateUsername(username);

    if (!username || errors.length > 0) {
      return res.status(422).json({
        message: "Username is not valid",
        available: false,
        username: username,
        errors: !username ? ["Username is Required"] : errors
      });
    }

    const existingUser = await User.findOne({ username: username }).select("_id");

    res.status(200).json({
      message: existingUser ? "Username is not available" : "Username is available",
      available: !existingUser,
      username: username
    });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({
      message: "Error checking username",
      error: error
    });
  }
}

exports.chooseUsername=async(req,res)=>{
  try {
    const username = normalizeUsername(req.body.username);
    const errors = validateUsername(username);

    if (!username || errors.length > 0) {
      return res.status(422).json({
        errors: !username ? ["Username is Required"] : errors
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.userId,
        $or: [
          { username: { $exists: false } },
          { username: null },
          { username: "" }
        ]
      },
      { $set: { username: username } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      if (user.username) {
        return res.status(400).json({
          message: "Username is already set"
        });
      }

      return res.status(422).json({
        message: "Username already exists"
      });
    }

    res.status(200).json({
      message: "Username selected successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        type: updatedUser.type,
        privacySettings: normalizeProfilePrivacy(updatedUser.privacySettings)
      }
    });
  } catch (error) {
    console.error("Error choosing username:", error);
    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(422).json({
        message: "Username already exists"
      });
    }

    res.status(500).json({
      message: "Error choosing username",
      error: error
    });
  }
}

exports.getPublicProfile=async(req,res)=>{
  try {
    const username = (req.params.username || "").trim();

    if (!username) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    const user = await User.findOne({
      username: normalizeUsername(username)
    }).select("name username type privacySettings");

    if (!user) {
      return res.status(404).json({
        message: "User profile not found"
      });
    }

    const viewerId = getViewerIdFromRequest(req);
    const isOwner = isProfileOwner(user._id, viewerId);
    const privacySettings = normalizeProfilePrivacy(user.privacySettings);
    const visibility = {
      publicProfile: canViewProfileSection(privacySettings, "publicProfile", isOwner),
      solvedProblems: canViewProfileSection(privacySettings, "solvedProblems", isOwner),
      submissionHistory: canViewProfileSection(privacySettings, "submissionHistory", isOwner),
      contestHistory: canViewProfileSection(privacySettings, "contestHistory", isOwner)
    };
    const stats = {};

    if (visibility.solvedProblems || visibility.submissionHistory) {
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

      const totalSubmissions = submissionStats?.totalSubmissions || 0;
      const acceptedSubmissions = submissionStats?.acceptedSubmissions || 0;
      const acceptanceRate = totalSubmissions
        ? Math.round((acceptedSubmissions / totalSubmissions) * 10000) / 100
        : 0;

      if (visibility.submissionHistory) {
        stats.totalSubmissions = totalSubmissions;
        stats.acceptedSubmissions = acceptedSubmissions;
        stats.acceptanceRate = acceptanceRate;
      }
    }

    if (visibility.solvedProblems) {
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

      const difficultyCounts = solvedByDifficulty.reduce((counts, item) => {
        counts[item._id] = item.count;
        return counts;
      }, { easy: 0, medium: 0, hard: 0 });

      stats.problemsSolved = solvedStats?.problemsSolved || 0;
      stats.easySolved = difficultyCounts.easy || 0;
      stats.mediumSolved = difficultyCounts.medium || 0;
      stats.hardSolved = difficultyCounts.hard || 0;
    }

    if (visibility.contestHistory) {
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

      stats.totalContestsParticipated = contestStats?.totalContestsParticipated || 0;
    }

    res.status(200).json({
      message: "Public profile fetched successfully",
      user: {
        name: visibility.publicProfile ? user.name : undefined,
        username: user.username,
        type: visibility.publicProfile ? user.type : undefined
      },
      stats: stats,
      visibility: visibility
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
