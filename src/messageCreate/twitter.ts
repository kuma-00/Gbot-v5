import { MessageResponse } from "@src/types/index.js";

export const messageResponse: MessageResponse = {
  name: "sm",
  filter: (m) => m.channel.id == "1124762255741956177",
  async execute(client, message) {
    message.react("❤");
    message.react("🔁");
  },
};
