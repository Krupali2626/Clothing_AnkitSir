import cron from "node-cron";
import refreshAllBadges from "./badgeRefresher.js";

// Schedule badge refresh every day at midnight
export const initCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running Daily Badge Refresh...");
    await refreshAllBadges();
  });

  // Optional: Run once on startup if needed
  // refreshAllBadges();
};
