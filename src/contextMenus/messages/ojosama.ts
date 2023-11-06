import { Command, CommandCategory } from "@src/types/command.js";
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
} from "discord.js";
import { speak } from "./../../util/index.ts";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message)
    .setName("ojosama"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true);
    const channel = interaction.channel;
    if (!channel) return;
    channel.sendTyping();
    // const text = shuffle(tokenize(msg.cleanContent)).join("")
    const text = (
      await (
        await fetch("https://api.ojosama.jiro4989.com", {
          method: "POST",
          body: JSON.stringify({ Text: msg.cleanContent }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
      ).json()
    ).Result as string;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guild)
      speak(client, interaction.guild, text, interaction.channelId);
  },
};
