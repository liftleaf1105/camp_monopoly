import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
import { runBackupSync } from "../src/backup/scheduler.js";

dotenv.config();

const main = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("Missing MONGO_URL.");
  }

  if (!process.env.BACKUP_ENABLED) {
    process.env.BACKUP_ENABLED = "true";
  }

  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await runBackupSync("manual script");
};

main()
  .catch((err) => {
    console.error("[backup] manual sync failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
