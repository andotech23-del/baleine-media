import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { reminderProcessor } from "./reminderProcessor.js";
import { dunningProcessor } from "./dunningProcessor.js";
import { webhookRetryProcessor } from "./webhookRetryProcessor.js";

const isTest = process.env.NODE_ENV === "test";

const createConnection = () => {
  if (isTest) {
    return null;
  }
  return new IORedis(env.redisUrl);
};

const connection = createConnection();

const createQueue = (name) => {
  if (isTest) {
    return {
      name,
      add: async () => {},
      close: async () => {}
    };
  }
  return new Queue(name, { connection });
};

const createWorker = (name, processor) => {
  if (isTest) {
    return {
      name,
      close: async () => {},
      on: () => {}
    };
  }
  return new Worker(name, processor, { connection });
};

export const reminderQueue = createQueue("appointment-reminders");
export const dunningQueue = createQueue("dunning-cadence");
export const webhookRetryQueue = createQueue("webhook-retry");

export const reminderWorker = createWorker("appointment-reminders", reminderProcessor);
export const dunningWorker = createWorker("dunning-cadence", dunningProcessor);
export const webhookRetryWorker = createWorker("webhook-retry", webhookRetryProcessor);

const workers = [reminderWorker, dunningWorker, webhookRetryWorker];

workers.forEach((worker) => {
  if (worker.on) {
    worker.on("completed", (job) => logger.info({ jobId: job.id, queue: worker.name }, "Job completed"));
    worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err }, "Job failed"));
  }
});

export const shutdownQueues = async () => {
  await Promise.all(workers.map((worker) => worker.close()));
  await reminderQueue.close();
  await dunningQueue.close();
  await webhookRetryQueue.close();
  if (connection) {
    connection.disconnect();
  }
};
