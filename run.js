import { initDiscordNotification } from "./discordNotifications.js";
import { updater } from "./updater.js";
import webserver from "./webserver.js";

webserver();
updater();

if (process.env.DISCORD_TOKEN && process.env.DISCORD_CHANNEL) {
  initDiscordNotification();
}

setInterval(updater, process.env.UPDATE_INTERVAL_IN_MINUTES * 60 * 1000);