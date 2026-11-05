import express from "express";
import { connectRedis } from "../config";

const router = express.Router();

const redis = connectRedis();

function otpKey(id) {
  return `otp:${id}`;
}

router.post("/", async (req, res) => {
  const { phone } = req.body;
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  try {
    await redis.set(otpKey(phone), otp, "EX", 60 * 5);
    res.status(201).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const key = otpKey(phone);
  try {
    const value = await redis.get(key);
    if (value !== null && value === String(otp)) {
      await redis.del(key);
      res.status(200).json({ message: "OTP verified" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const key = otpKey(phone);
  try {
    const ttl = await redis.ttl(key);
    res.status(200).json({ ttl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
