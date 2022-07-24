import { Command,CommandCategory } from "@src/types/command";
import { ChatInputCommandInteraction, EmbedBuilder ,SlashCommandBuilder} from "discord.js";
import wiki from "wikipedia";

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("wikipedia")
    .setDescription("wikipediaで検索した結果を返します。")
    .addStringOption((option) =>
      option.setName("queue").setDescription("検索したい単語").setRequired(true)
    ),
  async execute(client, interaction:ChatInputCommandInteraction) {
    try {
      await wiki.setLang("ja");
      const searchResults = await wiki.search(
        interaction.options.getString("queue") ?? "",
        { suggestion: true, limit: 1 }
      );
      const title = searchResults.results[0].title;
      const summary = (await wiki.summary(title)).extract;
      const texts = (() => {
        let array = [];
        let text = summary.replace(/\s+/, " ").replace(/\n+/, "\n");
        while (text.length > 1800) {
          array.push(text.slice(0, text.lastIndexOf("\n", 1800)));
          text = text.slice(text.lastIndexOf("\n", 1800));
        }
        array.push(text);
        return array;
      })();
      const embeds = texts.map((text) =>
        new EmbedBuilder()
          .setTitle("検索結果")
          .setURL(`https://ja.wikipedia.org/wiki/${encodeURI(title)}`)
          .setDescription(text)
      );
      interaction.followUp({ embeds: embeds });
      if (interaction.guildId && interaction.guild) {
        const speaker = client.speakers.get(interaction.guildId);
        if (speaker) texts.forEach((text) => speaker.addQueue(text));
      }
    } catch (e) {
      console.log(e);
    }
  },
};
