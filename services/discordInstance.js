import { Client, Intents } from "discord.js";

export default new Client({ intents: [Intents.FLAGS.GUILDS] });