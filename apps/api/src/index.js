import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { reminderWorker, dunningWorker, webhookRetryWorker } from "./jobs/queues.js";

const server = app.listen(env.port, () => {
  logger.info(`API listening on port ${env.port}`);
});

process.on("SIGINT", async () => {
  await Promise.all([reminderWorker.close(), dunningWorker.close(), webhookRetryWorker.close()]);
  server.close(() => process.exit(0));
});
