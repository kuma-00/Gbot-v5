"use strict";
import { MessageResponse } from "@src/types";
import { speak } from "@src/util";

export const messageResponse: MessageResponse = {
  name: "PI",
  filter: (m) =>
    ["円周率", "PI", "3.14", "π", "パイ"].some((i) => m.cleanContent == i) && !m.author.bot,
  async execute(client, message) {
    message.reply({
      content: Math.PI + "",
      allowedMentions: { repliedUser: false },
    });
    if (message.guild)
      speak(
        client,
        message.guild,
        Math.PI + ""
      );
  },
};
