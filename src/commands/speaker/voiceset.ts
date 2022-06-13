import { SlashCommandBuilder } from "@discordjs/builders";
import { Command,CommandCategory } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("voiceset")
    .setDescription(""),
  execute(client, interaction) {
  },
};
