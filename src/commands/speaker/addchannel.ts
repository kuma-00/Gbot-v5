import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandCategory } from "@src/types/command";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("addchannel")
    .setDescription("読み上げにチャンネルを追加する。読み上げが終了しても保存されます。"),
  execute(client, interaction: CommandInteraction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers.get(interaction.guildId)?.addChannel(interaction.channelId);
      interaction.followUp("チャンネルを登録しました");
    }
  },
};
