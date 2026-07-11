import { buildBackupSnapshot, snapshotToSheets } from "./snapshot.js";
import { writeSnapshotToGoogleSheets } from "./googleSheets.js";

const isBackupEnabled = () => process.env.BACKUP_ENABLED === "true";
const getDebounceMs = () => Number(process.env.BACKUP_DEBOUNCE_MS || 1000);

let timer = null;
let running = false;
let pendingReason = "";

export const runBackupSync = async (reason = "manual") => {
  if (!isBackupEnabled()) return;

  const snapshot = await buildBackupSnapshot();
  const sheets = snapshotToSheets(snapshot);
  await writeSnapshotToGoogleSheets(sheets);
  console.log(`[backup] synced snapshot (${reason}) at ${snapshot.generatedAtText}`);
};

const drainBackupQueue = async () => {
  if (running) return;
  running = true;
  const reason = pendingReason || "scheduled";
  pendingReason = "";

  try {
    await runBackupSync(reason);
  } catch (err) {
    console.error(`[backup] sync failed (${reason})`, err);
  } finally {
    running = false;
    if (pendingReason) {
      timer = setTimeout(drainBackupQueue, getDebounceMs());
    }
  }
};

export const scheduleBackupSync = (reason = "api update") => {
  if (!isBackupEnabled()) return;

  pendingReason = reason;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    drainBackupQueue();
  }, getDebounceMs());
};
