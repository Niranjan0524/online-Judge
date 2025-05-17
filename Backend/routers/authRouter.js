const express=require('express');
const jwt=require('jsonwebtoken');
const authRouter=express.Router();
const passport=require('passport');
const {preSignup,signup,login,getUser}=require('../controllers/authController');

authRouter.post('/signup',preSignup,signup);
authRouter.post('/login',login);
authRouter.get('/getuser',getUser);

authRouter.get("/profile", ensureAuthenticated, (req, res) => {
  res.send("This is your profile page.");
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
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