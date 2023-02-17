import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "E",
  filter: (m) =>
    [
      "e",
      "ネイピア数",
      "オイラー数",
      "Euler's number",
      "Napier's constant",
    ].some((i) => m.cleanContent == i),
  async execute(client, message) {
    reply(message,Math.E + "");
    if (message.guild)
      speak(
        client,
        message.guild,
        Math.E + "",
        message.channelId
      );
  },

};
