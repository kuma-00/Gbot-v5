import { MessageResponse } from "@src/types/index.js";
import { executeCommand, message as witMessage } from "@src/core/witAi.js";
import { tokenize } from "wakachigaki";
import { reply } from "@src/util/index.js";
import { StageChannel } from "discord.js";

export const messageResponse: MessageResponse = {
  name: "witAi",
  filter: (m) => /^(gbot)/i.test(m.cleanContent),
  async execute(client, message) {
    const text = message.cleanContent.replace(/^(gbot)/i, "");
    const res = await witMessage(tokenize(text).join(" "));
    if ("error" in res || message.channel instanceof StageChannel) {
      reply(
        message,
        "error" in res ? `${res.code}\n${res.error}` : "チャンネルエラー"
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
