const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../../db/users");

const router = express.Router();

// Salt rounds used to generate salt for hashing passwords
const SALT_ROUNDS = 10;

// Sign up route
router.get("/sign-up", (_req, response) => {
  response.render("sign-up", { title: "Team Ducling's term project" });
});

// Creating a new user and encrypting their password
router.post("/sign-up", async (request, response) => {
  const { username, email, password } = request.body;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  try {
    const { id } = await Users.create(username, email, hash);
    request.session.user = {
      id,
      username,
      email,
    };

    response.redirect("/home");
  } catch (error) {
    console.log({ error });

    response.render("sign-up", {
      title: "Team Ducling's term project",
      username,
      email,
    });
  }
});

// Login route
router.get("/login", (_req, response) => {
  response.render("login", { title: "Team Ducling's term project" });
});

// Checking to see if provided username and password are valid
router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const { id, username, password: hash } = await Users.findByEmail(email);
    const isValidUser = await bcrypt.compare(password, hash.trim());

    // console.log("password is ()" + password + "()");
    // console.log("hash is ()" + hash + "()");
    // console.log("isValidUser is " + isValidUser);

    // console.log("id is " + id);
    // console.log("username is " + username);

    if (isValidUser) {
      console.log("User is valid");
      request.session.user = {
        id,
        username,
        email,
      };

      console.log(request.session);
      response.redirect("/home");
    } else {
      throw "User did not provide valid credentials";
    }
  } catch (error) {
    console.log({ error });
    response.render("login", {
      title: "Team Ducling's term project",
      email,
      message: "Error!",
    });
  }
});

// Logout route
router.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    console.log({ error });
  });

  response.redirect("/");
});

module.exports = router;
