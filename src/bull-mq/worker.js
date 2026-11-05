import Worker from "bull";
import emailQueue from "./queue";

const worker = new Worker("email", emailQueue);

worker.process(async (job) => {
  console.log(`Sending email to ${job.data.email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Email sent to ${job.data.email}`);
  return { success: true };
});

worker.on("completed", (job) => {
  console.log(`Email sent to ${job.data.email}`);
});

worker.on("failed", (job, error) => {
  console.log(`Email sending failed for ${job.data.email}: ${error.message}`);
});

export default worker;