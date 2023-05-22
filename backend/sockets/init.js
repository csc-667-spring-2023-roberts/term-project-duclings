// File to allow for websockets and the express application to use the same port

const http = require("http");
const { Server } = require("socket.io");

const initSockets = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", (_socket) => {
    console.log("Connection");

    _socket.on("join", (game_id) => {
      console.log(_socket.id + "is Joining room: " + game_id);
      _socket.join(game_id);
      console.log("all socket rooms connected:");
      console.log(_socket.adapter.rooms);
    });
  });

  app.set("io", io);

  return server;
};

module.exports = initSockets;
