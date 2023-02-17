import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "now",
  filter: (m) =>
    [/(\b|^)now(\b|$)/, "nau", "ナウ", "なう"].some((i) =>
      m.cleanContent.match(i)
    ),
  async execute(client, message) {
    const date = new Date(
      Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
    );
    reply(message, date.toLocaleString());
    if (message.guild)
      speak(client, message.guild, date.toLocaleString(), message.channelId);
  },
};
