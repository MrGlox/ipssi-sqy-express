// NODE dependencies
// const path = require("path");
const http = require("http");

// PROJECT dependencies
const express = require("express");
const exphbs = require("express-handlebars");

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
 * HANDLE ROUTES
 */
app.get("/", (request, response) => response.render("home"));
app.get("/signin", (request, response) => response.render("signin"));
app.get("/signup", (request, response) => response.render("signup"));

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
