"use strict";
import { MessageResponse } from "@src/types/index.js";
import { speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "now",
  filter: (m) =>
    [/(\b|^)now(\b|$)/, "nau", "ナウ", "なう"].some((i) => m.cleanContent.match(i)),
  async execute(client, message) {
    const date = new Date(
      Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
    );
    message.reply({
      content: date.toLocaleString(),
      allowedMentions: { repliedUser: false },
    });
    if (message.guild)
      speak(
        client,
        message.guild,
        date.toLocaleString()
      );
  },
};
