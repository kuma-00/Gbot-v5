import { SlashCommandBuilder } from "@discordjs/builders";
import { Command,CommandCategory } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("addword")
    .setDescription("辞書に単語を登録します。"),
  execute(client, interaction) {

  },
};
