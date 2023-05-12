const express = require("express");
const createHttpError = require("http-errors");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const morgan = require("morgan");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);

const addSessionLocals = require("./middleware/add-session-locals.js");
const isAuthenticated = require("./middleware/is-authenticated.js");
const initSockets = require("./sockets/init.js");

require("dotenv").config();

const db = require("./db/connection.js");

const homeRoutes = require("./routes/static/home.js");
const gamesRoutes = require("./routes/static/games.js");
const lobbyRoutes = require("./routes/static/lobby.js");
const authenticationRoutes = require("./routes/static/authentication.js");
const chatRoutes = require("./routes/static/chat.js");
const testRoutes = require("./routes/test/index.js");
const apiGamesRoutes = require("./routes/api/games.js");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* After app creation and standard setup */
// Stores session information to database
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

const sessionMiddleware = session({
  store: new pgSession({ pgPromise: db }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
});

app.use(sessionMiddleware);
const server = initSockets(app, sessionMiddleware);

// Test middleware to print session info on every request
/*
app.use((req, res, next) => {
  console.log("Session object: ", req.session);
  next();
});
*/

// App setup (?)
const port = process.env.PORT || 3000;

app.set("views", path.join(".", "backend", "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(".", "backend", "static")));
app.use(addSessionLocals);

app.use("/", homeRoutes);
app.use("/games", isAuthenticated, gamesRoutes);
app.use("/api/games", isAuthenticated, apiGamesRoutes);
app.use("/lobby", isAuthenticated, lobbyRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/test", testRoutes);
app.use("/chat", chatRoutes);
app.use("/gamesession", (req, res) => {
  res.render("gamesession")
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use((_request, _response, next) => {
  next(createHttpError(404));
});
