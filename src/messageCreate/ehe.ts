import { speak } from "@src/util/index.js";
import { MessageResponse } from "@src/types/index.js";

export const messageResponse: MessageResponse = {
  name: "ehe",
  filter: (m) =>
    [
      /(\b|^)ehe(\b|$)/,
      /(\b|^)エヘ(\b|$)/,
      /(\b|^)エヘッ(\b|$)/,
      /(\b|^)えへ(\b|$)/,
      /(\b|^)えへっ(\b|$)/,
    ].some((i) => m.cleanContent.match(i)),
  async execute(client, message) {
    message.reply({
      content: "えへってなんだよ!",
      allowedMentions: { repliedUser: false },
    });
    if (message.guild)
      speak(client, message.guild, "えへってなんだよ!", message.channelId);
  },
};
