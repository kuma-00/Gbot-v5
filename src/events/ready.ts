import { Event } from "@src/types/index.js";
import { ActivityType } from "discord.js";

export const event:Event = {
  name: "ready",
  async execute(client): Promise<void> {
    const commands = Array.from(client.commands.values());
    client.guilds.cache
      .get(process.env.MY_GUILD_ID || "")
      ?.commands.set([]);
    // client.guilds.cache
    //   .get(process.env.TEST_GUILD_ID || "")
    //   ?.commands.set([]);
    client.application?.commands.set(commands.map((com) => com.data.toJSON()));
    console.log(`${client.user?.username} is ready !`);
    client.user?.setActivity("開発中...", { type: ActivityType.Playing });
  },
};
