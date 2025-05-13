const express=require('express');

const authRouter=express.Router();

const {signup, preSignup}=require('../controllers/authController');
const { login } = require("../controllers/authController");

authRouter.post('/signup',preSignup,signup);
authRouter.post('/login',login);

module.exports=authRouter;