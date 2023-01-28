import { translate } from "@src/core/translate.js";
import { Command, CommandCategory } from "@src/types/command.js";
import { speak } from "@src/util/index.js";
import {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
} from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message)
    .setName("translateToJA"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true);
    interaction.channel?.sendTyping();
    const text = (
      await translate(msg.cleanContent.replace(/[*`_~>]/, ""), null, "ja")
    ).text;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if(interaction.guild)speak(client,interaction.guild,text,interaction.channelId);
  },
};
