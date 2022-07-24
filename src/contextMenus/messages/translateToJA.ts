import { ContextMenuCommandBuilder } from "discord.js";
import { translate } from "@src/core/translate";
import { Command, CommandCategory } from "@src/types/command";
import { ApplicationCommandType } from "discord-api-types/v9";
import { ContextMenuCommandInteraction, Message } from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message as number)
    .setName("translateToJA"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true) as Message;
    interaction.channel?.sendTyping();
    const text = (
      await translate(msg.cleanContent.replace(/[*`_~>]/, ""), null, "ja")
    ).text;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guildId && interaction.guild) {
      const speaker = client.speakers.get(interaction.guildId);
      if (speaker) speaker.addQueue(text);
    }
  },
};
