import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "wani",
  filter: (m) =>
    ["わに", "ワニ", "鰐魚", "鰐", "wani"].some((i) => m.cleanContent == i),
  async execute(client, message) {
    reply(
      message,
      "https://drive.google.com/uc?id=1cMW4xK4aXaj6zHWIEFZZb-tW24I0O9Hs"
    );
    if (message.guild) speak(client, message.guild, "ワニ", message.channelId);
  },
};
