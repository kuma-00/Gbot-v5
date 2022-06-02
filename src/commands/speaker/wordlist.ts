import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandCategory,Command } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("wordlist")
    .setDescription("辞書に登録されてる単語の一覧を表示します。"),
  execute(client, interaction) {
  },
};
