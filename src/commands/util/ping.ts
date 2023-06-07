import { Command, CommandCategory } from "@src/types/command.ts";
import { SlashCommandBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong! と返事をします"),
  execute(client, interaction) {
    return interaction.followUp(`Pong ! **${client.ws.ping}ms**`);
  },
};
