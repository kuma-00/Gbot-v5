import { MessageResponse } from "@src/types/index.ts";
import { executeCommand, message as witMessage } from "@src/core/witAi.ts";
import { tokenize } from 'https://cdn.skypack.dev/wakachigaki@1.3.2?dts';
import { reply } from "@src/util/index.ts";

export const messageResponse: MessageResponse = {
  name: "witAi",
  filter: (m) => /^(gbot)\s+/i.test(m.cleanContent),
  async execute(client, message) {
    const text = message.cleanContent.replace(/^(gbot)\s+/i, "");
    const res = await witMessage(tokenize(text).join(" "));
    if ("error" in res) {
      reply(
        message,
        `${res.code}\n${res.error}`
      );
    } else {
      executeCommand(client, {
        user: message.author,
        member: message.member ?? undefined,
        channel: message.channel,
        guild: message.guild ?? undefined,
        res,
      });
    }
  },
};
