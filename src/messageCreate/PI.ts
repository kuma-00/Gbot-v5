import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";

export const messageResponse: MessageResponse = {
  name: "PI",
  filter: (m) =>
    ["円周率", "PI", "3.14", "π", "パイ"].some((i) => m.cleanContent == i) &&
    !m.author.bot,
  execute(client, message) {
    reply(message, Math.PI.toString());
    if (message.guild)
      speak(client, message.guild, Math.PI.toString(), message.channelId);
  },
};
