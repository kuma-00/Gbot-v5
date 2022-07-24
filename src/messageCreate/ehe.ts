import { sleep } from '@src/util';
"use strict";
import { MessageResponse } from "@src/types";

export const messageResponse: MessageResponse = {
  name: "ehe",
  filter: (m) =>[/(\b|^)ehe(\b|$)/, /(\b|^)エヘ(\b|$)/, /(\b|^)エヘッ(\b|$)/,/(\b|^)えへ(\b|$)/,/(\b|^)えへっ(\b|$)/].some((i) => m.cleanContent.match(i)),
  async execute(client, message) {
    message.reply({
      content: "えへってなんだよ!",
      allowedMentions: { repliedUser: false },
    });
    if (message.guildId && message.guild) {
      const speaker = client.speakers.get(message.guildId);
      await sleep(500);
      if (speaker) speaker.addQueue("えへってなんだよ!");
    }
  },
};
