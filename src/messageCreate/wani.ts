import { MessageResponse } from "@src/types/index.js";
import { reply, speak } from "@src/util/index.js";

export const messageResponse: MessageResponse = {
  name: "wani",
  filter: (m) =>
    ["わに", "ワニ", "鰐魚", "鰐", "wani"].some((i) => m.cleanContent == i),
  async execute(client, message) {
    // parseEmoji("<:6dorowani:842410113230962719>")
    reply(
      message,
      "<:6dorowani:842410113230962719>"
    );
    if (message.guild) speak(client, message.guild, "ワニ", message.channelId);
  },
};
