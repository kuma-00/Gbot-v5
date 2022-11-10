import { SlashCommandBuilder } from "discord.js";
import { storage } from "@src/core/storage.js";
import { StorageType } from "@src/types/index.js";
import { CommandCategory, Command } from "@src/types/command.js";
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
        .setAutocomplete(true)
    ),

  async execute(client, interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("word", true);
    if (
      !(await storage(StorageType.WORDS, interaction.guild?.id).get(word))
        ?.value
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
  async autocomplete(client, interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const words = await storage(StorageType.WORDS, interaction.guild?.id).fetch(
      focusedOption.value?{ "key?pfx": focusedOption.value }:undefined,
      { limit: 10 }
    );
    const dic: string[] = [];
    words.items.forEach(({ key }, i) => {
      dic[i] = String(key);
    });
    await interaction.respond(
      dic.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
