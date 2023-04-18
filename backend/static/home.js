import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const name = "steven vasquez";

  res.render("home", { title: "Steven's term project" });
});

export default router;
