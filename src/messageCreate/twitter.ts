// import { twitterEmbed } from "@src/core/urlMetadata.js";
import { MessageResponse } from "@src/types/index.js";

export const messageResponse: MessageResponse = {
  name: "twitter",
  filter: (m) => m.channel.id == "1124762255741956177" || m.channel.id == "886981303138910232",
  async execute(client, message) {
    const url = message.cleanContent.match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/)?.[0] ?? "";
    let m = message;
    if(url.match(/twitter.com|x.com|t.co/)){
      // const embeds = await twitterEmbed(new URL(url));
      m = await message.reply({content:url.replace(/twitter.com|x.com/,"vxtwitter.com"),allowedMentions:{parse:[]}});
    }
    m.react("❤");
    m.react("🔁");

  },
};
