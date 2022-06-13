import { SlashCommandBuilder } from "@discordjs/builders";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";
import { Command, CommandCategory } from "@src/types/command";
import { MessageEmbed } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("channellist")
    .setDescription("読み上げを終了します。"),
  async execute(client, interaction) {
    const readChannels =
      ((
        await storage(StorageType.SETTINGS).get(
          `${interaction.guildId}:readChannels`
        )
      )?.value as string[]) || [];
    if (readChannels.length == 0) {
      interaction.followUp("チャンネルは登録されていません");
      return;
    }
    const channels = readChannels.map((i) =>
      interaction.guild?.channels.cache.get(i)
    );
    const embed = new MessageEmbed();
    embed
      .setTitle("登録済みチャンネル一覧")
      .setDescription(channels.map((i) => `\`${i?.name}\``).join("\n"));
    interaction.followUp({ embeds: [embed] });
  },
};
