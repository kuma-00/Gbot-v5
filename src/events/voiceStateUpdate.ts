import { Event, StorageType } from "@src/types/index.js";
import { StageChannel, TextBasedChannel, VoiceState } from "discord.js";
import { Speaker, SpeakerStatus } from '@src/core/speaker.js';
import { storage } from "@src/core/storage.js";

export const event: Event = {
  name: "voiceStateUpdate",
  async execute(client, oldState: VoiceState, newState: VoiceState): Promise<void> {
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;
    const guild = oldState.guild;
    const channel = await guild.channels.cache.get((await storage(StorageType.SETTINGS).get(`${guild.id}:cacheChannelId`))?.value as string) as Exclude<TextBasedChannel, StageChannel>;
    const isSpeaking = await SpeakerStatus.get(guild.id);
    if (isSpeaking == SpeakerStatus.ERROR) {
      if (newUserChannel == null || channel == undefined) {
        channel.send("Channelが見つかりませんでした。");
        return;
      }
      if (client.speakers.has(guild.id)) {
        client.speakers
          .get(guild.id)
          ?.start(newUserChannel, channel);
      } else {
        const speaker = new Speaker(client, newUserChannel, channel);
        client.speakers.set(guild.id, speaker);
        speaker.start();
      }
      channel.send("読み上げが開始しました。");
      return;
    }
    if (newUserChannel) {
      const count = newUserChannel.members.filter(member => !member.user.bot)
        .size;
      console.log("in", count);
      //in
      if (!(isSpeaking != SpeakerStatus.WAITE || count != 1)) {
        if (client.speakers.has(guild.id)) {
          client.speakers
            .get(guild.id)
            ?.start(newUserChannel, channel);
        } else {
          const speaker = new Speaker(client, newUserChannel, channel);
          client.speakers.set(guild.id, speaker);
          speaker.start();
        }
        channel.send("読み上げが開始しました。");
        return;
      }
    }
    if (oldUserChannel) {
      const count = oldUserChannel.members.filter(member => !member.user.bot).size;
      console.log("out", count);
      //out
      if (!(isSpeaking == SpeakerStatus.SPEAKING) || count != 0) return;
      const speaker = client.speakers.get(guild.id);
      if (speaker && speaker.voiceChannel.id == oldUserChannel.id && !speaker.leaving) {
        setTimeout(() => {
          if (speaker.voiceChannel.members.filter((member) => !member.user.bot).size > 0 || speaker.leaving) return;
          speaker.end(true);
          channel.send("読み上げが終了しました。");
        }, 1000 * 60 * 1);
      }
      // if (speaker) {
      //   speaker.end(true);
      //   channel.send("読み上げが終了しました。");
      // }
    }
  },
};
