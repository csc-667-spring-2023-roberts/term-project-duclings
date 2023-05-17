const db = require("./connection.js");

// Create a new user
const create = (username, email, password) =>
  db.one(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
    [username, email, password]
  );

// Find a user by their email address
const findByEmail = (email) =>
  db.one("SELECT * FROM users WHERE email=$1", [email]);

// Find a user by their id
const getUsername = (user_id) =>
  db.one("SELECT username FROM users WHERE id=$1", [user_id]);

module.exports = {
  create,
  findByEmail,
  getUsername,
};
