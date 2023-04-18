import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("lobby", { title: "Steven's term project" });
});

export default router;
