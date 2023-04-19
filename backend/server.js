/*
import express from "express";
import createHttpError from "http-errors";
import path from "path";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import homeRoutes from "./routes/home.js";
import gamesRoutes from "./routes/games.js";
import lobbyRoutes from "./routes/lobby.js";
import authenticationRoutes from "./routes/authentication.js";
*/

const express = require("express");
const createHttpError = require("http-errors");
const path = require("path");
const session = require("express-session");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const pgSession = require("connect-pg-simple")(session);

//const addSessionLocals = require("./middleware/add-session-locals.js");
//const isAuthenticated = require("./middleware/is-authenticated.js");
//const initSockets = require("./sockets/initialize.js");

require("dotenv").config();
//const db = require("./db/connection.js");

const homeRoutes = require("./routes/static/home.js");
const gamesRoutes = require("./routes/static/games.js");
const lobbyRoutes = require("./routes/static/lobby.js");
const authenticationRoutes = require("./routes/static/authentication.js");
//const testRoutes = require("./routes/static/test.js");
//const chatRoutes = require("./routes/static/chat.js");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
}

const port = process.env.PORT || 3000;

app.set("views", path.join(".", "backend", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(".", "backend", "static")));

app.use("/", homeRoutes);
app.use("/games", gamesRoutes);
app.use("/lobby", lobbyRoutes);
app.use("/authentication", authenticationRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use((_request, _response, next) => {
  next(createHttpError(404));
});
