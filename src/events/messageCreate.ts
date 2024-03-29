import { Event } from "@src/types/index.js";
import { Message } from "discord.js";

export const event: Event = {
  name: "messageCreate",
  once: false,
  async execute(client, message: Message) {
    if (message.author.id == client.user?.id) return;
    client.messageResponses
      .filter((mr) => mr.filter(message))
      .forEach((mr) => mr.execute(client, message));
  },
};
