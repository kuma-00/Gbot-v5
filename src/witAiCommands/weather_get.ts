import { getArea, getWeather } from "@src/core/weather.js";
import { WitAiCommand } from "@src/types/witAiCommand.js";
import { isNullOrWhitespace, speak } from "@src/util/index.js";

export const command: WitAiCommand = {
  guildOnly: true,
  enabled: true,
  name: "weather_get",
  async execute(client, data) {
    const location = data.res.entities["wit$location:location"]?.[0].body || "";
    if (isNullOrWhitespace(location))
      return data.channel.send(`場所の取得に失敗しました。`);
    // console.log(data.res.entities["wit$location:location"]?.[0], location);
    const area = (await getArea(location));
    if (!area) return data.channel.send(`場所の取得に失敗しました。`);
    const weather = await getWeather(area.getCode);
    data.channel.send(
      `**${area.name}**

${weather[0]
        .map(
          (w) => `> \`${w.name}\`
> ${w.weather}`
        )
        .join("\n\n")}`
    );
    if (data.guild)
      speak(
        client,
        data.guild,
        weather[0].map((w) => `${w.name} ${w.weather}`).join("。"),
        data.channel.id
      );
  },
};
