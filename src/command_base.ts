import { SlashCommandBuilder } from "@discordjs/builders";
import { Command,CommandCategory } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("")
    .setDescription(""),
  execute(client, interaction) {
  },
};