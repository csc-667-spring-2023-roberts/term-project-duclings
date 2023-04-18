import express from "express";

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;

  res.render("games", { id, title: "Steven's term project" });
});

export default router;
