import { SlashCommandBuilder } from "discord.js";
import { Command,CommandCategory } from "@src/types/command.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("読み上げをスキップします。"),
  execute(client, interaction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers.get(interaction.guildId)?.skip();
      interaction.followUp("読み上げをスキップしました。");
    }
  },
};
