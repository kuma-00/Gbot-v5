import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command,CommandCategory } from "@src/types/command.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("")
    .setDescription(""),
  execute(client, interaction:ChatInputCommandInteraction) {
  },
};
