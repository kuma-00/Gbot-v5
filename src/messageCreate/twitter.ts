import { twitterEmbed } from "@src/core/urlMetadata.js";
import { MessageResponse } from "@src/types/index.js";

export const messageResponse: MessageResponse = {
  name: "twitter",
  filter: (m) => m.channel.id == "1124762255741956177" || m.channel.id == "886981303138910232",
  async execute(client, message) {
    message.react("❤");
    message.react("🔁");
    const url = message.cleanContent.match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/)?.[0] ?? "";
    const embeds = await twitterEmbed(new URL(url));
    console.log(embeds);
    message.channel.send({embeds});
  },
};
