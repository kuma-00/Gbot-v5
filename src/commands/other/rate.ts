import { Message, EmbedBuilder ,SlashCommandBuilder,ChatInputCommandInteraction} from "discord.js";
import { Command, CommandCategory } from "@src/types/command";
import { ocrSpace } from "ocr-space-api-wrapper";
import { Artifact } from "@src/core/artifact";

const createError = (text: string) => {
  const embed = new EmbedBuilder();
  embed.setTitle("エラー").setDescription(text).setColor([255, 0, 0]);
  return { embeds: [embed] };
};

const ocr = async (url: URL, interaction: ChatInputCommandInteraction) => {
  const sendError = (s: string) => {
    interaction.followUp(
      createError(`OCRでエラーが発生しました。しばらく経っても同じエラーが出る場合は今月の回数上限に達した可能性があります。
    詳細 : ${s}`)
    );
  };
  const res = await (() => {
    try {
      return ocrSpace(url.toString(), {
        apiKey: process.env.OCR_KEY,
        language: "jpn",
      });
      //process.env.OCR_KEY
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        sendError("リクエストに失敗しました");
        return;
      }
    }
  })();
  console.log(JSON.stringify(res));
  if (res.IsErroredOnProcessing) {
    sendError(res.ErrorMessage);
    return;
  }
  return res;
};

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("rate")
    .setDescription(
      "与えられた画像から聖遺物のデータを解析し、スコアを計算します。オプションで各ステータスのウェイト(重み)を設定できます。"
    ),
  async execute(client, interaction:ChatInputCommandInteraction) {
    const text = interaction.options.getString("options");
    await interaction.followUp("聖遺物の画像を一枚送信してください。");;
    const filter = (m: Message<boolean>) => m.author.id == interaction.user.id && m.attachments.size == 1;
    try{
      const m = await (await interaction.channel?.awaitMessages({filter,max: 1, time: 60 * 1000, errors: ['time']}))?.first();
      if(!m) return interaction.followUp(createError(`画像が見つかりませんでした`));
      const result = await ocr(new URL(m.attachments.first()?.url ?? ""), interaction);
      if (!result) return interaction.followUp(createError(`画像の解析に失敗しました。`));
      const arti = new Artifact(result);
      await arti.init();
      interaction.followUp({embeds:[arti.toEmbedBuilder()]});
    } catch (e){
      interaction.followUp(createError(`画像が送信されませんでした。`));
    }
  },
};
