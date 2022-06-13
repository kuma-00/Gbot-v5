import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandCategory } from "@src/types/command";
import { CommandInteraction } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("removechannel")
    .setDescription("読み上げからチャンネルを削除する。読み上げが開始されていなくても実行できます。"),
  execute(client, interaction: CommandInteraction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers.get(interaction.guildId)?.removeChannel(interaction.channelId);
      interaction.followUp("チャンネルを削除しました");
    }
  },
};
