import { connectRedis } from "../config";

const subscriber = connectRedis();

subscriber.subscribe("email", (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Email subscribed");
});

subscriber.on("message", (channel, message) => {
  console.log(`Email received on channel ${channel}: ${JSON.parse(message)}`);
});

export default subscriber;