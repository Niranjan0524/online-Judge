const express=require('express');

const authRouter=express.Router();

const {preSignup,signup,login,getUser}=require('../controllers/authController');

authRouter.post('/signup',preSignup,signup);
authRouter.post('/login',login);
authRouter.get('/getuser',getUser);

module.exports=authRouter;