"use strict";
import { Event, StorageType } from "@src/types";
import { TextBasedChannel, VoiceState } from "discord.js";
import { Speaker, SpeakerStatus } from '@src/core/speaker';
import { storage } from "@src/core/storage";

export const event:Event = {
  name: "voiceStateUpdate",
  async execute(client,newState:VoiceState,oldState:VoiceState): Promise<void> {
    const newUserChannel = newState.channel;
    const oldUserChannel = oldState.channel;
    const guild = oldState.guild;
    const channel = await guild.channels.cache.get((await storage(StorageType.SETTINGS).get(`${guild.id}:cacheChannelId`))?.value as string) as TextBasedChannel;
    const isSpeaking = await SpeakerStatus.get(guild.id);
    // const speaker = this.speaker(guild.id);
    if (isSpeaking == SpeakerStatus.ERROR) {
      if (newUserChannel == null || channel == undefined) {
        channel.send("Channelが見つかりませんでした。")
        return;
      }
      if (client.speakers.has(guild.id)) {
        client.speakers
          .get(guild.id)
          ?.start(newUserChannel, channel);
      } else {
        const speaker = new Speaker(client, newUserChannel, channel);
        client.speakers.set(guild.id, speaker);
        speaker.start(newUserChannel, channel);
      }
      channel.send("読み上げが開始しました。")
      return;
    }
    if (newUserChannel) {
      const count = newUserChannel.members.filter(member => !member.user.bot)
        .size;
      console.log("in", count);
      //in
      if (isSpeaking != SpeakerStatus.WAITE || count != 1) return;
      // if (!speaker)
      //   this.create(guild.id, newUserChannel, channel, () => {
      //     this.deleteSpeaking(guild.id);
      //     super.sendMsg(channel, "切断されたため、読み上げを終了しました");
      //   });
      // await this.addchannel(channel);
      // this.speaker(guild.id).start(newUserChannel);
      // this.addSpeaking(guild.id, statusType.SPEAKING);
      // this.setData(guild.id, ":cacheChannelId", channel.id);
      // super.sendMsg(channel, "読み上げが開始しました");
      if (client.speakers.has(guild.id)) {
        client.speakers
          .get(guild.id)
          ?.start(newUserChannel, channel);
      } else {
        const speaker = new Speaker(client, newUserChannel, channel);
        client.speakers.set(guild.id, speaker);
        speaker.start(newUserChannel, channel);
      }
      channel.send("読み上げが開始しました。")
      return;
    }
    if (oldUserChannel) {
      const count = oldUserChannel.members.filter(member => !member.user.bot)
        .size;
      console.log("out", count);
      //out
      if (!(isSpeaking == SpeakerStatus.SPEAKING) || count != 0) return;
      // if (speaker && speaker.vc.id == oldUserChannel.id) {
      //   this.deleteSpeaking(guild.id);
      //   super.sendMsg(channel, "読み上げが終了しました");
      //   speaker.end();
      // }
      if (client.speakers.has(guild.id)) {
        client.speakers.get(guild.id)?.end(true);
        channel.send("読み上げが終了しました。");
      }
    }
  },
};
