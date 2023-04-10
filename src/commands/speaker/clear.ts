import { SlashCommandBuilder } from "discord.js";
import { Command,CommandCategory } from "@src/types/command.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("読み上げをクリアします。"),
  execute(client, interaction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers.get(interaction.guildId)?.clear();
      interaction.followUp("読み上げをクリアしました。");
    }
  },
};
