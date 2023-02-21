import { SlashCommandBuilder } from "discord.js";
import { CommandCategory,Command } from "@src/types/command.js";
import { Speaker } from "@src/core/speaker.js";
import { GuildMember } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("読み上げを開始します。"),
  execute(client, interaction) {
    if (interaction.guildId && interaction.guild) {
      const voiceChannel = (() => {
        return (
          (interaction.member as GuildMember).voice.channel ??
          interaction.guild.voiceStates.cache.first()?.channel
        );
      })();
      if (voiceChannel == null || interaction.channel === null || !("send" in interaction.channel)) {
        interaction.followUp("VoiceChannelが見つかりませんでした")
        return;
      }
      if (client.speakers.has(interaction.guildId)) {
        client.speakers
          .get(interaction.guildId)
          ?.start(voiceChannel, interaction.channel);
      } else {
        const speaker = new Speaker(client, voiceChannel, interaction.channel);
        client.speakers.set(interaction.guildId, speaker);
        speaker.start(voiceChannel, interaction.channel);
      }
      interaction.followUp("読み上げが開始しました。")
    }
  },
};
