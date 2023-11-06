import { ChatInputCommandInteraction, SlashCommandBuilder } from "npm:discord.js";
import { Command,CommandCategory } from "@src/types/command.ts";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("")
    .setDescription(""),
  execute(_client, _interaction:ChatInputCommandInteraction) {
    return;
  },
};
