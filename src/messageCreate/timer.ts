import { secondToString, setTimer } from "@src/core/timer.ts";
import { MessageResponse } from "@src/types/index.ts";
import { reply, speak } from "@src/util/index.ts";
import { default as parse } from "deno/date_fns@v2.22.1/parse/index.js";

export const messageResponse: MessageResponse = {
  name: "timer",
  filter: (_m) => false,
  // (m.guild ?? false) && /^(タイマー|timer)\s+/i.test(m.cleanContent),
  async execute(client, message) {
    const second =
      parse(
        message.cleanContent.replace(/^(タイマー|timer)\s+/i, ""),
        "m:ss",
        new Date(0),
        undefined
      ).getTime() / 1000;
    console.log(
      message.cleanContent.replace(/^(タイマー|timer)\s+/i, ""),
      "timer:",
      second,
    );
    setTimer(client, message.channelId, message.author.id, second);
    reply(message, `${secondToString(second)}タイマーが設定されました。`);
    if (message.guild)
      speak(
        client,
        message.guild,
        `${secondToString(second)}タイマーが設定されました。`,
        message.channelId,
      );
  },
};
