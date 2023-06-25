import { unfurl } from "unfurl.js";
import replaceAsync from "string-replace-async";

export const urlReplace = async (text: string) => {
  // /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g
  return await replaceAsync(
    text,
    /https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g,
    async (url: string) => {
      try {
        const result = await unfurl(url);
        return (
          `URL:${result.open_graph.site_name ?? ""} ${result.title?.replace(/https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g,"") ?? ""}` ?? ""
        );
      } catch {
        return "URL省略";
      }
    },
  );
};
