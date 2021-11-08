import { initDiscordNotification } from "./discordNotifications.js";
import { updater } from "./updater.js";
import webserver from "./webserver.js";

if (!process.env.AA_ADDRESS || !process.env.PORT || !process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_SECRET_KEY){
  throw new Error("Check your environment variables");
}

webserver();
updater();

if (process.env.DISCORD_TOKEN && process.env.DISCORD_CHANNEL) {
  initDiscordNotification();
}

setInterval(updater, process.env.UPDATE_INTERVAL_IN_MINUTES * 60 * 1000);