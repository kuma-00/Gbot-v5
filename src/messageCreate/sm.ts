import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "sm",
  filter: (m) => /^sm\d+$/.test(m.cleanContent),
  async execute(client, message) {
    reply(
      message,
      `https://www.nicovideo.jp/watch/${
        message.cleanContent.match(/sm\d+/)?.[0]
      }`
    );
    if (message.guild)
      speak(client, message.guild, "URL省略", message.channelId);
  },
};
