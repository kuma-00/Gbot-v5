import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { translate } from "@src/core/translate.js";
import { Command, CommandCategory } from "@src/types/command.js";

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Google翻訳を使って翻訳します。")
    .addStringOption((option) =>
      option.setName("word").setDescription("翻訳したい単語").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription(
          "翻訳先の言語(https://cloud.google.com/translate/docs/languages)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription(
          "翻訳元の言語(https://cloud.google.com/translate/docs/languages)"
        )
    ),
  async execute(client, interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("word", true);
    const target = interaction.options.getString("target", true);
    const source = interaction.options.getString("source");
    const channel = interaction.channel;
    if (!channel) return;
    channel.sendTyping();
    const text = (await translate(word.replace(/[*`_~>]/, ""), source, target))
      .text;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guildId && interaction.guild) {
      const speaker = client.speakers.get(interaction.guildId);
      if (speaker) speaker.addQueue(text);
    }
  },
};
