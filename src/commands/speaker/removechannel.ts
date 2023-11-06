import { storage } from "@src/core/storage.js";
import { Command, CommandCategory } from "@src/types/command.js";
import { StorageType } from "@src/types/index.ts";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("removechannel")
    .setDescription(
      "読み上げからチャンネルを削除する。読み上げが開始されていなくても実行できます。",
    ),
  async execute(client, interaction: CommandInteraction) {
    if (interaction.guildId && interaction.guild) {
      client.speakers
        .get(interaction.guildId)
        ?.removeCollectors(interaction.channelId);
      const readChannels =
        (
          await storage(StorageType.SETTINGS).get(
            `${interaction.guildId}:readChannels`,
          )
        )?.value || [];
      if (Array.isArray(readChannels)) {
        await storage(StorageType.SETTINGS).put(
          readChannels.filter((id) => id != interaction.channelId),
          `${interaction.guildId}:readChannels`,
        );
      } else {
        await storage(StorageType.SETTINGS).put(
          [],
          `${interaction.guildId}:readChannels`,
        );
      }
      interaction.followUp("チャンネルを削除しました");
    }
  },
};
