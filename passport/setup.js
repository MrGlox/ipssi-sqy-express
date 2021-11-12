const bcrypt = require("bcrypt");

const LocalStrategy = require("passport-local").Strategy;

const init = (passport, getByEmail, getByID) => {
  const authenticate = async (email, password, done) => {
    const user = getByEmail(email);

    if (!user) {
      return done(null, false, { message: "No user found" });
    }

    try {
      if (await bcrypt.compare(password, user.passport))
        return done(null, user);

      return done(null, false, { message: "Bad password" });
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ userNameField: "email" }, authenticate));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, getByID(id)));
};

module.export = init;
