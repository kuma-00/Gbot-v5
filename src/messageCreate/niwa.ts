import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";

export const messageResponse: MessageResponse = {
  name: "wani",
  filter: (m) =>
    ["にわ", "ニワ", "庭","ガーデン", "niwa","がーでん","garden"].some((i) => m.cleanContent == i),
  execute(client, message) {
    reply(message,{files:["./src/images/niwa.jpg"]});
    if (message.guild)
      speak(
        client,
        message.guild,
        "庭",
        message.channelId
      );
  },
};
