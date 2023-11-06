import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";

export const messageResponse: MessageResponse = {
  name: "ohayou",
  filter: (m) =>
    ["おは", "よう", "ござ", "いま"].some((i) => m.cleanContent == i) &&
    !m.author.bot,
  async execute(client, message) {
    const text = (() => {
      switch (message.cleanContent) {
        case "おは":
          return "よう";
        case "よう":
          return "ござ";
        case "ござ":
          return "いま";
        case "いま":
          return "す。";
        default:
          return "";
      }
    })();
    reply(message, text);
    if (message.guild) speak(client, message.guild, text, message.channelId);
  },
};
