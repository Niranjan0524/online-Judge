const User = require("../models/user");
const expressValidator = require("express-validator");  
const bcrypt = require("bcryptjs");

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
  