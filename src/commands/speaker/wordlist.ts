import { SlashCommandBuilder } from "discord.js";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";
import { CommandCategory, Command } from "@src/types/command";
import { ChatInputCommandInteraction, EmbedBuilder ,escapeMarkdown} from "discord.js";

const getDic = async (guildId: string) => {
  const dic: { [key: string]: string } = {};
  const words = await storage(StorageType.WORDS, guildId).fetchAll();
  words.items.forEach(({ key, value }) => {
    dic[String(key)] = String(value);
  });
  return dic;
};

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("wordlist")
    .setDescription("辞書に登録されてる単語の一覧を表示します。")
    .addStringOption((option) =>
      option
        .setName("keyword")
        .setDescription("検索するキーワード")
        .setRequired(false)
    ),
  async execute(client, interaction: ChatInputCommandInteraction) {
    const keyword = interaction.options.getString("keyword");
    const dic = await getDic(interaction.guild?.id || "");
    const keys = Object.keys(dic);
    const sendDic = (dicA: string[]) => {
      if (dicA.length == 0) {
        interaction.followUp("該当する単語は登録されていません");
        return;
      }
      let sendText: string[] = [];
      let index = 1;
      const send = () => {
        const embed = new EmbedBuilder();
        embed
          .setTitle("登録済み単語一覧:" + index++)
          .setDescription(sendText.join("\n"));
        interaction.followUp({ embeds: [embed] });
        sendText = [];
      };
      dicA.forEach((l) => {
        sendText.push(l);
        if (sendText.join("\n").length > 1500) send();
      });
      send();
    };
    if (!keys || keys.length == 0) {
      sendDic([]);
      return;
    }
    if (keyword) {
      sendDic(
        keys
          .map(
            (i) =>
              `\`${escapeMarkdown(i)}\` → \`${escapeMarkdown(
                dic[i]
              )}\``
          )
          .filter((i) => i.match(keyword.split(/\s/).join("|")))
      );
    } else {
      sendDic(
        keys.map(
          (i) =>
            `\`${escapeMarkdown(i)}\` → \`${escapeMarkdown(dic[i])}\``
        )
      );
    }
  },
};
