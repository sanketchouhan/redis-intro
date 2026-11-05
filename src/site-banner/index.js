import express from "express";
import { connectRedis } from "../config";

const router = express.Router();

const redis = connectRedis();

const BANNER_KEY = "app:banner";

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const value = await redis.get(`${BANNER_KEY}:${id}`);
    if (value) {
      res.json(JSON.parse(value));
    } else {
      res.status(404).json({ error: "Banner not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;
  try {
    await redis.set(
      `${BANNER_KEY}:${id}`,
      JSON.stringify({ title, description, image }),
    );
    res.status(201).json({ message: "Banner created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/exists", async (req, res) => {
  const { id } = req.params;
  try {
    const value = await redis.exists(`${BANNER_KEY}:${id}`);
    res.json({ exists: value > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await redis.del(`${BANNER_KEY}:${id}`);
    res.json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
