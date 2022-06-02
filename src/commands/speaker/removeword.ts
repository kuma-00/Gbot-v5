import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandCategory,Command } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("removeword")
    .setDescription("辞書から単語を削除します。"),
  execute(client, interaction) {
  },
};
