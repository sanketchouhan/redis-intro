import express from "express";
import { connectRedis } from "../config";

const router = express.Router();

const redis = connectRedis();

// Storing objects as JSON strings
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const value = await redis.get(`user:${id}:json`);
    if (value) {
      res.json(JSON.parse(value));
    } else {
      res.status(404).json({ error: "User profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    await redis.set(`user:${id}:json`, JSON.stringify({ name, email, phone }));
    res.status(201).json({ message: "User profile created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/exists", async (req, res) => {
  const { id } = req.params;
  try {
    const value = await redis.exists(`user:${id}:json`);
    res.json({ exists: value > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await redis.del(`user:${id}:json`);
    res.json({ message: "User profile deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Storing objects as HSET
router.get("/:id/hset", async (req, res) => {
  const { id } = req.params;
  try {
    const value = await redis.hgetall(`user:${id}:hset`);
    if (Object.keys(value || {}).length !== 0) {
      res.json(value);
    } else {
      res.status(404).json({ error: "User profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/hset", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    await redis.hset(`user:${id}:hset`, { name, email, phone });
    res.status(201).json({ message: "User profile created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/hset/exists", async (req, res) => {
  const { id } = req.params;
  try {
    const value = await redis.hexists(`user:${id}:hset`, "name");
    res.json({ exists: value > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id/hset", async (req, res) => {
  const { id } = req.params;
  try {
    await redis.hdel(`user:${id}:hset`, "name");
    res.json({ message: "User profile deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
