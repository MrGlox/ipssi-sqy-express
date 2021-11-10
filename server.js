const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

const http = require("http");
const server = http.createServer(app);

app.get("/", (request, response) => {
  response.sendFile(path.resolve(__dirname + "/index.html"));
});

app.use(express.static("public"));

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
