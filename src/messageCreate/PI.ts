"use strict";
import { MessageResponse } from "@src/types";

export const messageResponse: MessageResponse = {
  name: "PI",
  filter: (m) =>
    ["円周率", "PI", "3.14", "π", "パイ"].some((i) => m.cleanContent == i),
  async execute(client, message) {
    message.reply({
      content: Math.PI + "",
      allowedMentions: { repliedUser: false },
    });
  },
};
