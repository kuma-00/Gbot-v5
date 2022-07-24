"use strict";
import { MessageResponse } from "@src/types";

export const messageResponse: MessageResponse = {
  name: "eto",
  filter: (m) =>
    ["干支", "十干", "十干十二支", "えと", /(\b|^)eto(\b|$)/].some((i) =>
      m.cleanContent.match(i)
    ),
  async execute(client, message) {
    const date = new Date(
      Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
    );
    const year =
      parseInt(message.cleanContent.match(/\d{4}/)?.[0] ?? "", 10) ||
      date.getFullYear();
    const data1 = "庚辛壬癸甲乙丙丁戊己";
    const data2 = "申酉戌亥子丑寅卯辰巳午未";
    message.reply({
      content: data1[year % 10] + data2[year % 12],
      allowedMentions: { repliedUser: false },
    });
  },
};
