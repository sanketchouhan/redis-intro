import "dotenv/config";
import Redis from "ioredis";
import mongoose from "mongoose";

let redis;

export function connectRedis() {
  if (redis) {
    return redis;
  }

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is not set");
  }

  redis = new Redis(url);

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (error) => {
    console.error("Redis connection error:", error.message);
  });

  return redis;
}

export async function connectMongo() {
  const url = process.env.MONGODB_URL;
  if (!url) {
    throw new Error("MONGODB_URL is not set");
  }

  await mongoose.connect(url);
  console.log("MongoDB connected");
  return mongoose.connection;
}
