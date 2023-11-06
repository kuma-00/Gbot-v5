import { unfurl } from "unfurl.js";
import replaceAsync from "string-replace-async";
import { EmbedBuilder } from "discord.js";

export const urlReplace = async (text: string) => {
  // /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
  return await replaceAsync(
    text,
    /https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g,
    async (url: string) => {
      try {
        const result = await unfurl(url);
        return (
          `URL:${result.open_graph.site_name ?? ""} ${
            result.title?.replace(
              /https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g,
              "",
            ) ?? ""
          }` ?? ""
        );
      } catch {
        return "URL省略";
      }
    },
  );
};

export const twitterEmbed = async (url: URL) => {
  const ogp = await unfurl(url.href);
  const embed1 = new EmbedBuilder()
    .setTitle(ogp.title ?? "")
    .setURL(url.href)
    .setAuthor({
      name: ogp.author ?? "",
      iconURL: ogp.favicon ?? "",
      url: ogp.open_graph.url ?? "",
    })
    .setDescription(ogp.open_graph.description ?? "")
    .setImage(ogp.open_graph.images?.[0]?.url ?? "")
    .setFooter({
      text: ogp.open_graph.site_name ?? "",
      iconURL: ogp.favicon ?? "",
    })
    .setTimestamp();
  const embed2 = new EmbedBuilder()
    .setURL(url.href)
    .setImage(ogp.open_graph.images?.[1]?.url ?? "");
  const embed3 = new EmbedBuilder()
    .setURL(url.href)
    .setImage(ogp.open_graph.images?.[2]?.url ?? "");
  const embed4 = new EmbedBuilder()
    .setURL(url.href)
    .setImage(ogp.open_graph.images?.[3]?.url ?? "");
  const result = [embed1];
  if (ogp.open_graph.images?.[1]) result.push(embed2);
  if (ogp.open_graph.images?.[2]) result.push(embed3);
  if (ogp.open_graph.images?.[3]) result.push(embed4);
  return result;
};
