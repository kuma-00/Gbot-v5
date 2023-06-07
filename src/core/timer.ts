import { ExtensionClient, StorageType } from "@src/types/index.ts";
import { Timer } from "@src/types/timer.ts";
import { randomId, speak } from "@src/util/index.ts";
import { formatDistance } from "date-fns";
import ja from "date-fns/locale/ja/index.js";
import { BaseGuildTextChannel, EmbedBuilder } from "discord.js";
import { storage } from "@src/core/storage.ts";
import { setTimeout, setInterval } from "node:timers/promises";

export const setTimer = async (
  client: ExtensionClient,
  textChannelId: string,
  userId: string,
  second: number,
  duration?: number,
) => {
  const id = randomId();
  const timerData = {
    duration: duration ?? second,
    start: Date.now() / 1000,
    textChannelId,
    userId,
    id,
  };
  client.timers.set(id, timerData);
  storage(StorageType.SETTINGS).put([...client.timers.values()], "timers");
  if (second < 3600) {
    await setTimeout(second * 1000);
    timer(client, timerData);
  } else {
    const interval = 60 * 1000;
    for await (const _ of setInterval(interval)) {
      const now = Date.now() / 1000;
      console.log(now);
      if (now - timerData.start > second) {
        timer(client, timerData);
        break;
      }
    }
  }
};

export const loadTimer = async (client: ExtensionClient) => {
  const timerArray = await storage(StorageType.SETTINGS).get("timers");
  if (Array.isArray(timerArray)) {
    timerArray.forEach((timer: Timer) => {
      const second = timer.start - Date.now() / 1000 + timer.duration;
      if (second > 0)
        setTimer(
          client,
          timer.textChannelId,
          timer.userId,
          second,
          timer.duration,
        );
      client.timers.set(timer.id, timer);
    });
  }
};

export const removeTimer = (client: ExtensionClient, id: string) => {
  if (client.timers.has(id)) {
    client.timers.delete(id);
  }
};

export const timer = async (client: ExtensionClient, timer: Timer) => {
  const channel = await client.channels.fetch(timer.textChannelId);
  if (channel && channel.isTextBased()) {
    const user = await client.users.fetch(timer.userId);
    const embed = new EmbedBuilder();
    embed.setAuthor({
      name: "タイマー",
      iconURL: user.avatarURL() ?? undefined,
    });
    embed.setFooter({
      text: client.user?.username ?? "",
      iconURL: client.user?.avatarURL() ?? undefined,
    });
    // embed.setTitle("タイマー");
    embed.setDescription(
      `${secondToString(timer.duration)}タイマーが完了しました。`,
    );
    embed.addFields({ name: "Requested by", value: user.username });
    channel.send({ embeds: [embed] });
    if (channel instanceof BaseGuildTextChannel) {
      speak(
        client,
        channel.guild,
        `${secondToString(timer.duration)}タイマーが完了しました。`,
        timer.textChannelId,
      );
    }
  }
  removeTimer(client, timer.id);
};

export const secondToString = (second: number) => {
  const dateBase = new Date(0);
  const date = new Date(second * 1000);
  return formatDistance(date, dateBase, { locale: ja });
};
