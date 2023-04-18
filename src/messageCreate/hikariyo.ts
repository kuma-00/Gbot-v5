import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "hikariyo",
  filter: (m) =>
    ["光よ"].some((i) => m.cleanContent == i),
  async execute(client, message) {
    reply(message, {files:["./images/hikariyo.jpg"]});
    if (message.guild)
      speak(
        client,
        message.guild,
        "光よ!",
        message.channelId
      );
  },
};
