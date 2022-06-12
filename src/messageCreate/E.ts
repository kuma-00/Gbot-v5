"use strict";
import { MessageResponse } from "@src/types";

export const messageResponse: MessageResponse = {
  name: "E",
  filter: (m) =>
    [
      "e",
      "ネイピア数",
      "オイラー数",
      "Euler's number",
      "Napier's constant",
    ].some((i) => m.cleanContent == i),
  async execute(client, message) {
    message.reply({
      content: Math.E + "",
      allowedMentions: { repliedUser: false },
    });
  },
};
