import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";

export const messageResponse: MessageResponse = {
  name: "now",
  filter: (m) =>
    [/(\b|^)now(\b|$)/, "nau", "ナウ", "なう"].some((i) =>
      m.cleanContent.match(i)
    ),
  execute(client, message) {
    const date = new Date(
      Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
    );
    reply(message, date.toLocaleString());
    if (message.guild)
      speak(client, message.guild, date.toLocaleString(), message.channelId);
  },
};
