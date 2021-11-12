const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;

const initPassport = (passport, getByEmail, getByID) => {
  console.log("initPassport");

  const authenticate = async (email, password, done) => {
    console.log("start Auth");
    const user = getByEmail(email);

    if (user == null) {
      console.log("Bad user");
      return done(null, false, { message: "No user found" });
    }

    try {
      //   console.log("password test", password, user.passport);
      if (await bcrypt.compare(password, user.password)) {
        console.log("Good password");
        return done(null, user);
      }

      console.log("Bad password");
      return done(null, false, { message: "Bad password" });
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticate));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, getByID(id)));
};

module.exports = initPassport;
