import { Command, CommandCategory } from "@src/types/command";
import { shuffle } from "@src/util";
import { ApplicationCommandType } from "discord-api-types/v9";
import { ContextMenuCommandInteraction, Message,ContextMenuCommandBuilder } from "discord.js";
import { tokenize } from 'wakachigaki';

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message as number)
    .setName("randomWord"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true) as Message;
    interaction.channel?.sendTyping();
    const text = shuffle(tokenize(msg.cleanContent)).join("")
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guildId && interaction.guild) {
      const speaker = client.speakers.get(interaction.guildId);
      if (speaker) speaker.addQueue(text);
    }
  },
};
