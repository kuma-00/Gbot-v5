"use strict";
import { MessageResponse } from "@src/types";

export const messageResponse: MessageResponse = {
  name: "sm",
  filter: (m) => /^sm\d+$/.test(m.cleanContent),
  async execute(client, message) {
    message.reply({
      content: `https://www.nicovideo.jp/watch/${
        message.cleanContent.match(/sm\d+/)?.[0]
      }`,
      allowedMentions: { repliedUser: false },
    });
  },
};
