import express from "express";
import emailQueue from "./queue";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, subject, body } = req.body;
  const job = { email, subject, body };
  await emailQueue.add("email", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
  res.status(201).json({ message: "Email job created" });
});

export default router;
