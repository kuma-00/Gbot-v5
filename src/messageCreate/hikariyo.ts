import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";

export const messageResponse: MessageResponse = {
  name: "hikariyo",
  filter: (m) =>
    ["光よ"].some((i) => m.cleanContent == i),
  execute(client, message) {
    reply(message, {files:["./src/images/hikariyo.jpg"]});
    if (message.guild)
      speak(
        client,
        message.guild,
        "光よ!",
        message.channelId
      );
  },
};
