import express from "express";

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Steven's term project" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Steven's term project" });
});

export default router;
