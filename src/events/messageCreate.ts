import { Event } from "@src/types/index.ts";
import { Message } from "discord.js";

export const event: Event = {
  name: "messageCreate",
  once: false,
  execute(client, message: Message) {
    if (message.author.id == client.user?.id) return;
    client.messageResponses
      .filter((mr) => mr.filter(message))
      .forEach((mr) => mr.execute(client, message));
  },
};
