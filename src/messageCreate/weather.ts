import { getArea, getWeather } from "@src/core/weather.js";
import { MessageResponse } from "@src/types/index.js";
import { speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "weather",
  filter: (m) => /^(天気|weather)/i.test(m.cleanContent),
  async execute(client, message) {
    const areaCode = (
      await getArea(message.cleanContent.replace(/^(天気|weather)/i, ""))
    ).getCode;
    const weather = await getWeather(areaCode);
    message.reply({
      content: weather[0]
        .map(
          (w) => `> \`${w.name}\`
> ${w.weather}`
        )
        .join("\n\n"),
      allowedMentions: { repliedUser: false },
    });
    if (message.guild)
      speak(
        client,
        message.guild,
        weather[0].map((w) => `${w.name} ${w.weather}`).join("。"),
        message.channelId
      );
  },
};
