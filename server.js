if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// NODE dependencies
// const path = require("path");
const http = require("http");

// PROJECT dependencies
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const express = require("express");
const flash = require("express-flash");
const exphbs = require("express-handlebars");
const session = require("express-session");

const passport = require("passport");

// init const
const app = express();
const port = 3000;

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const initPassport = require("./passport/setup.js");
initPassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

/**
 * INIT VIEW ENGINE
 */
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

/**
 * EXPOSE FILES
 */
app.use(express.static("public"));

/**
 * HANDLE REQUEST
 */
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

/**
 * INIT SESSION
 */
app.use(
  session({
    secret: process.env.API_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

/**
 * HANDLE USERS
 */
const users = [];

/**
 * HANDLE ROUTES
 */
app.get(
  "/",
  (request, response, next) => {
    if (!request.isAuthenticated()) {
      response.redirect("/signin");
    }

    next();
  },
  (request, response) => response.render("home", { name: request.user.name })
);
app.get("/signin", (request, response) =>
  response.render("signin", { message: request.flash("error") })
);
app.get("/signup", (request, response) => response.render("signup"));

app.post("/signup", (request, response) => {
  const saltRounds = 10;

  try {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) throw err;

      bcrypt.hash(request.body.password, salt, function (err, hash) {
        if (err) throw err;

        users.push({ ...request.body, ...{ id: Date.now(), password: hash } });
        console.log(users);

        response.redirect("/signin");
      });
    });
  } catch (err) {
    res.redirect("/signup");
    throw err;
  }
});

app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true, // "Invalid username or password."
  })
);

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/signin");
});

/**
 * SOCKET SYSTEM
 */
io.on("connection", (socket) => {
  //   console.log(socket);
  console.log("user connected");

  io.emit("user connected", "user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");

    io.emit("user disconnected", "user disconnected");
  });

  socket.on("message", (msg) => {
    console.log("message", msg);
    io.emit("message", msg);
  });
});

/**
 * SERVER INIT
 */
server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
