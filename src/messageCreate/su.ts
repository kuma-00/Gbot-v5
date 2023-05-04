import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "su",
  filter: (m) =>
    ["いま"].some((i) => m.cleanContent == i) &&
    m.author.bot,
  async execute(client, message) {
    reply(message, "す。");
    if (message.guild)
      speak(client, message.guild, "す。", message.channelId);
  },
};
