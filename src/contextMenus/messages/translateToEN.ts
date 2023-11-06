import { translate } from "@src/core/translate.js";
import { Command, CommandCategory } from "@src/types/command.js";
import { speak } from "@src/util/index.ts";
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
} from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message)
    .setName("translateToEN"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true);
    const channel = interaction.channel;
    if (!channel) return;
    channel.sendTyping();
    const text = (
      await translate(msg.cleanContent.replace(/[*`_~>]/, ""), null, "en")
    ).text;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guild)
      speak(client, interaction.guild, text, interaction.channelId);
  },
};
