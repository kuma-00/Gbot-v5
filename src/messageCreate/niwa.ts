import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "wani",
  filter: (m) =>
    ["にわ", "ニワ", "庭","ガーデン", "niwa","がーでん","garden"].some((i) => m.cleanContent == i),
  async execute(client, message) {
    reply(message,"https://halmek.co.jp/media/article/image/4140d21df5ca81e6ff686936f39fb477.jpg");
    if (message.guild)
      speak(
        client,
        message.guild,
        "庭",
        message.channelId
      );
  },
};
