import * as Discord from "discord.js";

import { getDecimals } from "./helpers/getDecimals.js";
import { getSymbol } from "./helpers/getSymbol.js";

import discordInstance from "./services/discordInstance.js";
import obyteInstance from "./services/obyteInstance.js";

const getAAPayload = (messages = []) => messages.find(m => m.app === 'data')?.payload || {};

export const initDiscordNotification = () => {
  obyteInstance.onConnect(async () => {
    await discordInstance.login(process.env.DISCORD_TOKEN);

    obyteInstance.justsaying("light/new_aa_to_watch", {
      aa: process.env.AA_ADDRESS
    });

    obyteInstance.subscribe(async (err, result) => {
      if (err) return null;

      const { subject, body } = result[1];

      if (subject === "light/aa_request") {
        const { messages, unit, authors: [{ address }] } = body.unit;
        const { repo, donate } = getAAPayload(messages);
        const payment = messages.find((m) => m.app === "payment" && (messages.length > 2 ? m?.payload?.asset : true))?.payload;

        if (donate && repo) {
          const amount = payment?.outputs && payment?.outputs.find((o) => o.address !== address)?.amount - (!(payment?.asset) ? 1e3 : 0);
          const decimals = await getDecimals(payment?.asset || "base");
          const symbol = await getSymbol(payment?.asset || "base")
          const embed = new Discord.MessageEmbed()
            .setAuthor(`Obyte cascading donation`)
            .setTitle(`New donation`)
            .setColor('#0099ff')
            .setDescription(`You can support this repository using [website](${process.env.URL}/repo/${repo})`)
            .setURL(`https://${process.env.TESTNET ? "testnet" : ""}explorer.obyte.org/#${unit}`)
            .addFields({ name: "Donor", value: `[${address}](${`https://${process.env.TESTNET ? "testnet" : ""}explorer.obyte.org/#${address}`})` })
            .addFields({ name: "Repository", value: `[${repo}](https://github.com/${repo})` })
            .addFields({ name: "Amount", value: `${amount / 10 ** decimals} ${symbol}` })
            .setThumbnail(`https://avatars.githubusercontent.com/${repo.split("/")[0]}`)

          await sendToDiscord({ embeds: [embed] })
        }
      }
    });

    const heartbeat = setInterval(function () {
      obyteInstance.api.heartbeat();
    }, 10 * 1000);

    obyteInstance.client.ws.addEventListener("close", () => {
      clearInterval(heartbeat);
    });

  });
}

function sendToDiscord(to_be_sent) {
  discordInstance.channels.fetch(process.env.DISCORD_CHANNEL).then((channel) => channel.send(to_be_sent));
}