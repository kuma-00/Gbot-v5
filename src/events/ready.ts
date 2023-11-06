import { Speaker, SpeakerStatus } from "@src/core/speaker.ts";
import { storage , FetchResponse } from "@src/core/storage.ts";
import { loadTimer } from "@src/core/timer.ts";
import { Event, ExtensionClient, StorageType } from "@src/types/index.ts";
import { ActivityType, TextBasedChannel } from "npm:discord.js";

export const event: Event = {
  name: "ready",
  once: true,
  async execute(client): Promise<void> {
    const commands = Array.from(client.commands.values());
    client.guilds.cache.get(Deno.env.get("MY_GUILD_ID") || "")?.commands.set([]);
    // client.guilds.cache
    //   .get(process.env.TEST_GUILD_ID || "")
    //   ?.commands.set([]);
    client.application?.commands.set(commands.map((com) => com.data.toJSON()));
    console.log(`${client.user?.username} is ready !`);
    client.user?.setActivity("開発中...", { type: ActivityType.Playing });
    loadTimer(client);
    await comeback(client);
  },
};

const comeback = async (client: ExtensionClient) => {
  const s = storage(StorageType.SETTINGS);
  const { items } = await s.fetchAll({ "key?contains": "SpeakerStatus" }) as FetchResponse;
  const guilds = items
    .filter((item) =>
      [SpeakerStatus.SPEAKING, SpeakerStatus.ERROR, SpeakerStatus.WAITE].some(
        (v) => v == item.value,
      ),
    )
    .map((item) => (item.key as string)?.replace(":SpeakerStatus", ""));
  const logs = [["comeback--------------------"]];
  await Promise.all(
    guilds.map(async (guildId) => {
      const guild = await client.guilds.fetch(guildId);
      if (!guild) return;
      logs.push([guild.id, ":", guild.name]);
      const tcId = (await s.get(`${guildId}:cacheChannelId`))?.value as string;
      if (!tcId) return console.log(`Can't get ${guildId}:cacheChannelId`);
      const tc = await guild.channels.fetch(tcId);
      const vc = guild.voiceStates.cache.first()?.channel;
      if (!vc || !tc) return console.log(`Can't get ${vc} or ${tc}`);
      if (vc.members.filter((m) => !m.user.bot).size == 0)
        return console.log(`Can't members 0 vc`);
      const speaker = new Speaker(client, vc, tc as TextBasedChannel);
      client.speakers.set(guildId, speaker);
      speaker.start();
    }),
  );
  logs.push(["----------------------------"]);
  logs.forEach((log) => console.log(...log));
};
