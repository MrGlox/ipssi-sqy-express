// NODE dependencies
// const path = require("path");
const http = require("http");

// PROJECT dependencies
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const express = require("express");
const exphbs = require("express-handlebars");

const passport = require("passport");

// init const
const app = express();
const port = 3000;

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

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
 * HANDLE USERS
 */
const users = [];

/**
 * HANDLE ROUTES
 */
app.get("/", (request, response) => response.render("home"));
app.get("/signin", (request, response) => response.render("signin"));
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
