const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // 1. Try to find user by googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Try to find user by email
        const email = profile.emails && profile.emails[0]?.value;
        user = await User.findOne({ email });
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // 3. If still not found, create new user
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: email,
          password: null
        });
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
