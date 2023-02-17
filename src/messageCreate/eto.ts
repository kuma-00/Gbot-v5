import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "eto",
  filter: (m) =>
    ["干支", "十干", "十干十二支", /(\b|^)えと(\b|$)/, /(\b|^)eto(\b|$)/].some((i) =>
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
    reply(message, data1[year % 10] + data2[year % 12]);
    if (message.guild)
      speak(
        client,
        message.guild,
        data1[year % 10] + data2[year % 12],
        message.channelId
      );
  },
};
