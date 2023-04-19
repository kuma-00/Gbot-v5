import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { Command, CommandCategory } from "@src/types/command.js";
import { ocrSpace } from "ocr-space-api-wrapper";
import { Artifact } from "@src/core/artifact.js";

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
      "与えられた画像から聖遺物のデータを解析し、スコアを計算します。[オプションで各ステータスのウェイト(重み)を設定できます。(未実装)]"
    )
    .addAttachmentOption((option) =>
      option.setName("image").setDescription("聖遺物の画像").setRequired(true)
    ),
  async execute(_client, interaction: ChatInputCommandInteraction) {
    // const text = interaction.options.getString("options");
    const image = interaction.options.getAttachment("image", true).url;
    const result = await ocr(new URL(image), interaction);
    if (!result)
      return interaction.followUp(createError(`画像の解析に失敗しました。`));
    const arti = new Artifact(result);
    const e = arti.toEmbedBuilder();
    e.files?.push({ attachment: image, name: "Artifact.png" });
    const msg = await interaction.followUp(e);
    const channel = interaction.channel;
    if (!channel) return;
    const i = await channel.awaitMessageComponent({
      filter: (i) => i.customId == "gb_rate_detail",
      time: 60 * 1000,
    });
    e.components[0].components[0].setDisabled(true);
    msg.edit(e);
    if (i) {
      i.reply(arti.toDetail());
    }
  },
};
