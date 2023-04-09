import { secondToString, setTimer } from "@src/core/timer.js";
import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";
import { parse } from "date-fns";

export const messageResponse: MessageResponse = {
  name: "timer",
  filter: (m) =>
    (m.guild ?? false) && /^(タイマー|timer)\s+/i.test(m.cleanContent),
  async execute(client, message) {
    const second =
      parse(
        message.cleanContent.replace(/^(タイマー|timer)\s+/i, ""),
        "m:ss",
        new Date(0)
      ).getTime() / 1000;
    console.log(
      message.cleanContent.replace(/^(タイマー|timer)\s+/i, ""),
      "timer:",
      second
    );
    setTimer(
      client,
      message.channelId,
      message.author.id,
      second
    );
    reply(message, `${secondToString(second)}タイマーが設定されました。`);
    if (message.guild)
      speak(
        client,
        message.guild,
        `${secondToString(second)}タイマーが設定されました。`,
        message.channelId
      );
  },
};
