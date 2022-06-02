import { MessageEmbed } from "discord.js";
import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { getUsername, getUser } from "@src/util";
import { CommandCategory, Command } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("helpを表示します"),
  async execute(client, interaction) {
    const commands = client.commands;
    const cmd: { [key: string]: Command[] } = {};
    for (const key of commands.filter(
      (command) =>
        command.enabled && !(command.data instanceof ContextMenuCommandBuilder)
    )) {
      if (!cmd[key[1].category]) {
        cmd[key[1].category] = [];
      }
      cmd[key[1].category].push(key[1]);
    }
    const helpEmbed = new MessageEmbed()
      .setTitle("コマンド一覧")
      .setTimestamp(Date.now());
    for (const key in cmd) {
      helpEmbed.addField(
        `**${cmd[key].length} · ${key}**`,
        cmd[key]
          .map((v) => {
            const data = v.data;
            if (data instanceof ContextMenuCommandBuilder) return;
            return `\`${data.name}\` : ${data.description}`;
          })
          .join("\n")
      );
    }
    interaction.followUp({ embeds: [helpEmbed] });
  },
};
