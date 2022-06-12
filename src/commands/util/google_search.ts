import { CustomSearchJson } from "@src/types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandCategory,Command } from "@src/types/command";
import fetch from "node-fetch";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Googleで検索した結果を返します。")
    .addStringOption((option) =>
      option.setName("queue").setDescription("検索したい単語").setRequired(true)
    ),
  async execute(_client, interaction:CommandInteraction) {
    const text = interaction.options.getString("queue", true);
    interaction.followUp("`検索開始`search:" + text);
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.googleapis_key}&cx=${process.env.googleapis_cx}&q=${text}`
    );
    const resJson = (await response.json()) as CustomSearchJson;
    const embed = new MessageEmbed();
    embed
      .setTitle("検索結果")
      .setURL(
        `https://www.google.com/search?q=${encodeURI(
          resJson.queries.request[0].searchTerms
        )}`
      );
    resJson.items.forEach((j) =>
      embed.addField(
        j.title,
        ` [${j.snippet ? j.snippet.slice(0, 90) + "..." : ""}](${j.link}) `
      )
    );
    interaction.followUp({embeds: [embed]});
  },
};
