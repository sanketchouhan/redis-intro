import express from "express";
import { connectRedis } from "../config";

const router = express.Router();

const redis = connectRedis();

const EMAIL_QUEUE_KEY = "email:queue";

router.post("/", async (req, res) => {
  const { email, subject, body } = req.body;
  const job = {
    email,
    subject,
    body,
    createdAt: new Date(),
  };
  try {
    await redis.lpush(EMAIL_QUEUE_KEY, JSON.stringify(job));
    res.status(201).json({ message: "Email job created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/process-one", async (req, res) => {
  try {
    const job = await redis.rpop(EMAIL_QUEUE_KEY);
    if (!job) {
      res.status(200).json({ message: "No email job found" });
      return;
    }
    res.status(200).json(JSON.parse(job));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
