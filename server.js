const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const express = require("express");
const app = express();

// morgan is a logging library
app.use(morgan("dev"));
// Support for JSON and url encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Support for cookoes
app.use(cookieParser());
// Immediately after epress app is created, allow pug template engine to use in any route
app.set("views", path.join(__dirname, "backend", "views"));
// Set template engine to 'pug'
app.set("view engine", "pug");
// Middleware to allow us to serve static webpages from backend/static/
app.use(express.static(path.join(__dirname, "backend", "static")));

// Mounts all routes defined in the root.js Router under "/"
const rootRoutes = require("./backend/routes/root");
app.use("/", rootRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use((request, response, next) => {
    next(createError(404))
});
