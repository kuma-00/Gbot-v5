import { ChatInputCommandInteraction, SlashCommandBuilder ,EmbedBuilder} from "discord.js";
import { Command, CommandCategory } from "@src/types/command.js";
import { storage } from "@src/core/storage.js";
import { StorageType } from "@src/types/index.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("addword")
    .setDescription("辞書に単語を登録します。")
    .addStringOption((option) =>
      option
        .setName("before")
        .setDescription("置き換えられる文字列")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("after")
        .setDescription("置き換えた文字列")
        .setRequired(true)
    ),

  execute(_client, interaction: ChatInputCommandInteraction) {
    const after = interaction.options.getString("after",true);
    const before = interaction.options.getString("before",true);
    storage(StorageType.SETTINGS).put(
      true,
      `${interaction.guild?.id}:dicChange`
    );
    storage(StorageType.WORDS, interaction.guild?.id).put(after, before);
    const embed = new EmbedBuilder();
    embed
      .setTitle("単語登録")
      .setDescription(
        `以下の単語が登録されました。\n\`${before}\` → \`${after}\``
      );
    interaction.followUp({ embeds: [embed] });
  },
};
