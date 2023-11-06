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
  console.log(ogp.canonical_url);
  const embed1 = new EmbedBuilder()
    .setTitle(ogp.title ?? "")
    .setURL(ogp.canonical_url??url.href)
    .setAuthor({
      name: ogp.open_graph.title ?? "",
      iconURL: ogp.favicon,
      url: ogp.open_graph.url,
    })
    .setDescription(ogp.open_graph.description ?? "")
    .setImage(ogp.open_graph.images?.[0].url ?? null)
    .setFooter({
      text: ogp.open_graph.site_name ?? "",
      iconURL: ogp.favicon,
    })
    .setTimestamp();
  const embed2 = new EmbedBuilder()
    .setURL(ogp.canonical_url??url.href)
    .setImage(ogp.open_graph.images?.[1].url ?? null);
  const embed3 = new EmbedBuilder()
    .setURL(ogp.canonical_url??url.href)
    .setImage(ogp.open_graph.images?.[2].url ?? null);
  const embed4 = new EmbedBuilder()
    .setURL(ogp.canonical_url??url.href)
    .setImage(ogp.open_graph.images?.[3]?.url ?? null);

  const result = [embed1];
  if (ogp.open_graph.images?.[1]) result.push(embed2);
  if (ogp.open_graph.images?.[2]) result.push(embed3);
  if (ogp.open_graph.images?.[3]) result.push(embed4);
  return result;
};
