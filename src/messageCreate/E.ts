import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";

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
  execute(client, message) {
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
