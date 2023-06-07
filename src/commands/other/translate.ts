import { translate } from "@src/core/translate.ts";
import { Command, CommandCategory } from "@src/types/command.ts";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Google翻訳を使って翻訳します。")
    .addStringOption((option) =>
      option.setName("word").setDescription("翻訳したい単語").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription(
          "翻訳先の言語(https://cloud.google.com/translate/docs/languages)",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription(
          "翻訳元の言語(https://cloud.google.com/translate/docs/languages)",
        ),
    ),
  async execute(client, interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("word", true);
    const channel = interaction.channel;
    if (!channel) return;
    channel.sendTyping();
    const text = (await translate(word.replace(/[*`_~>]/, ""), null, "ja"))
      .text;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guildId && interaction.guild) {
      const speaker = client.speakers.get(interaction.guildId);
      if (speaker) speaker.addQueue(text);
    }
  },
};
