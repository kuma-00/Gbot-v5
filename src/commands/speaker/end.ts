import { Command, CommandCategory } from "@src/types/command.ts";
import { SlashCommandBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("end")
    .setDescription("読み上げを終了します。"),
  execute(client, interaction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers.get(interaction.guildId)?.end();
      interaction.followUp("読み上げが終了しました。");
    }
  },
};
