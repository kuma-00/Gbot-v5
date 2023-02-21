import { Command, CommandCategory } from "@src/types/command.js";
import { shuffle, speak } from "@src/util/index.js";
import {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
} from "discord.js";
import { tokenize } from "wakachigaki";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message)
    .setName("randomWord"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true);
    const channel = interaction.channel;
    if (!(channel && "sendTyping" in channel)) return;
    channel.sendTyping();
    const text = shuffle(tokenize(msg.cleanContent)).join("");
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guild)
      speak(client, interaction.guild, text, interaction.channelId);
  },
};
