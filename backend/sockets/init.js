// File to allow for websockets and the express application to use the same port

const http = require("http");
const { Server } = require("socket.io");

const initSockets = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  const io = new Server(server);

  io.engine.use(sessionMiddleware);

  io.on("connection", async (socket) => {
    // Whenever there's a new connection, handle it accordingly by joining it to the necessary game ID (roomID)
    console.log("Connection", socket.id);

    const gameID = socket.handshake.query.roomID;
    console.log("gameID: ", gameID);
    socket.join(gameID);
  });

  app.set("io", io);

  return server;
};

module.exports = initSockets;
