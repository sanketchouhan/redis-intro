import express from "express";
import { connectRedis } from "./config";
import siteBannerRouter from "./site-banner";
import userProfileRouter from "./user-profile";
import otpTtlRouter from "./otp-ttl";
import emailQueueRouter from "./email-queue";
import bullMqRouter from "./bull-mq";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/site-banner", siteBannerRouter);

app.use("/user-profile", userProfileRouter);

app.use("/otp-ttl", otpTtlRouter);

app.use("/email-queue", emailQueueRouter);

app.use("/bull-mq", bullMqRouter);

app.get("/redis", async (req, res) => {
  const value = await connectRedis().get("test");
  res.send(value);
});

app.get("/mongodb", (req, res) => {
  res.send("MongoDB is running");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
