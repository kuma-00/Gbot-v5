"use strict";
import { MessageResponse } from "@src/types";
import { speak } from "@src/util";

export const messageResponse: MessageResponse = {
  name: "wani",
  filter: (m) =>
    ["わに", "ワニ", "鰐魚", "鰐", "wani"].some((i) => m.cleanContent == i),
  async execute(client, message) {
    message.reply({
      files: [
        "https://drive.google.com/uc?id=1cMW4xK4aXaj6zHWIEFZZb-tW24I0O9Hs",
      ],
      allowedMentions: { repliedUser: false },
    });
    if (message.guild)
      speak(
        client,
        message.guild,
        "ワニ"
      );
  },
};
