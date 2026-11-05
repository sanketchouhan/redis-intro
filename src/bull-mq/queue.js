import Queue from "bull";
import { connectRedis } from "../config";

const redis = connectRedis();

const emailQueue = new Queue("email", redis);

export default emailQueue;