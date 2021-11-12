const socket = io();

const form = document.forms[0];
const input = form.querySelector("input");

const list = document.querySelector("ul");

form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  socket.emit("message", input.value);
  input.value = "";
});

socket.on("message", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  list.appendChild(li);
});

socket.on("user connected", (msg) => {
  const li = document.createElement("li");
  li.textContent = `*${msg}*`;
  li.classList.add("newUser");
  list.appendChild(li);
});

socket.on("user disconnected", (msg) => {
  const li = document.createElement("li");
  li.textContent = `*${msg}*`;
  li.classList.add("newUser");
  list.appendChild(li);
});
