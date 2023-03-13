import { MessageResponse } from "@src/types/index.js";
import { reply } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "hikariyo",
  filter: (m) =>
    ["光よ"].some((i) => m.cleanContent == i),
  async execute(_client, message) {
    reply(message, "https://cdn.wikiwiki.jp/to/w/arona-punch/%E3%82%A2%E3%83%AA%E3%82%B9/::ref/ALIS_1stAniv_1.jpg");

  },
};
