import { getArea, getWeather } from "@src/core/weather.js";
import { MessageResponse } from "@src/types/index.js";
import { isNullOrWhitespace, reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "weather",
  filter: (m) => /^(天気|weather)\s+/i.test(m.cleanContent),
  async execute(client, message) {
    const areaCode = (
      await getArea(message.cleanContent.replace(/^(天気|weather)\s+/i, ""))
    )?.getCode;
    if (!areaCode) return reply(message,`場所の取得に失敗しました。`);
    const weather = await getWeather(areaCode);
    reply(
      message,
      weather[0]
        .map(
          (w) => `> \`${w.name}\`
> ${w.weather}`
        )
        .join("\n\n")
    );
    if (message.guild)
      speak(
        client,
        message.guild,
        weather[0].map((w) => `${w.name} ${w.weather}`).join("。"),
        message.channelId
      );
  },
};
