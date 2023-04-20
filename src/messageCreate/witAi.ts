import { MessageResponse } from "@src/types/index.js";
import { executeCommand, message as witMessage } from "@src/core/witAi.js";
import { tokenize } from "wakachigaki";
import { reply } from "@src/util/index.js";
import { StageChannel } from "discord.js";

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
