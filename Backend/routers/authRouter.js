const express=require('express');
const jwt=require('jsonwebtoken');
const authRouter=express.Router();
const passport=require('passport');
const {verifyUser}=require('../controllers/verifyUser');
const {preSignup,signup,login,getUser,getSolutions,getPublicProfile,updateUserProfile,checkUsername,chooseUsername}=require('../controllers/authController');

authRouter.post('/auth/signup',preSignup,signup);
authRouter.post('/auth/login',login);
authRouter.get('/users/me',getUser);
authRouter.get('/users/me/solutions',getSolutions);
authRouter.get('/users/check-username',checkUsername);
authRouter.put('/users/me/username',verifyUser,chooseUsername);
authRouter.get('/users/profile/:username',getPublicProfile);
authRouter.put('/users/me',verifyUser,updateUserProfile);

authRouter.get("/users/me/profile", ensureAuthenticated, (req, res) => {
  res.send("This is your profile page.");
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);
module.exports=authRouter;
