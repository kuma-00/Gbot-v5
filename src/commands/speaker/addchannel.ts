import { SlashCommandBuilder } from "discord.js";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";
import { Command, CommandCategory } from "@src/types/command";
import { CommandInteraction, EmbedBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("addchannel")
    .setDescription(
      "読み上げにチャンネルを追加する。読み上げが終了しても保存されます。"
    ),
  async execute(client, interaction: CommandInteraction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers
        .get(interaction.guildId)
        ?.addCollectors(interaction.channelId);
      const readChannels =
        (
          await storage(StorageType.SETTINGS).get(
            `${interaction.guildId}:readChannels`
          )
        )?.value || [];
      if (Array.isArray(readChannels)) {
        readChannels.push(interaction.channelId);
        await storage(StorageType.SETTINGS).put(
          readChannels.filter((x, i, a) => a.indexOf(x) === i),
          `${interaction.guildId}:readChannels`
        );
      } else {
        await storage(StorageType.SETTINGS).put(
          [interaction.channelId],
          `${interaction.guildId}:readChannels`
        );
      }
      interaction.followUp("チャンネルを登録しました");
    }
  },
};
