import express from "express";
import { connectRedis } from "../config";
import "./subscriber";

const router = express.Router();

const publisher = connectRedis();

router.post("/", async (req, res) => {
  const { email, subject, body } = req.body;
  const payload = { email, subject, body };
  await publisher.publish("email", payload);
  res.status(201).json({ message: "Email published" });
});

export default router;
