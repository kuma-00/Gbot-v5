import { SlashCommandBuilder } from "discord.js";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";
import { CommandCategory, Command } from "@src/types/command";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("removeword")
    .setDescription("辞書から単語を削除します。")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("辞書に登録されている置き換えられる文字列")
        .setRequired(true)
    ),

  async execute(client, interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("word");
    if (!word) {
      const embed = new EmbedBuilder();
      embed
        .setTitle("エラー")
        .setDescription(
          "引数の数が適切ではないか、引数に空白が含まれています。"
        )
        .setColor([255, 0, 0]);
      interaction.followUp({ embeds: [embed] });
      return;
    } else if (
      (await storage(StorageType.WORDS, interaction.guild?.id).get(word))?.value
    ) {
      const embed = new EmbedBuilder();
      embed
        .setTitle("エラー")
        .setDescription("その単語は登録されていません")
        .setColor([255, 0, 0]);
      interaction.followUp({ embeds: [embed] });
      return;
    }
    storage(StorageType.SETTINGS).put(
      true,
      `${interaction.guild?.id}:dicChange`
    );
    await storage(StorageType.WORDS, interaction.guild?.id).delete(word);
    const embed = new EmbedBuilder();
    embed
      .setTitle("単語削除")
      .setDescription(`以下の単語が削除されました。\n\`${word}\``);
    interaction.followUp({ embeds: [embed] });
  },
};
