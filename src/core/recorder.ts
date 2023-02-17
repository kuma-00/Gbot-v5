import { Stream, TransformOptions } from "stream";
import { Writer } from "wav";
import mm from "music-metadata";
import { Transform } from "node:stream";
import {
  EndBehaviorType,
  getVoiceConnection,
  VoiceReceiver,
} from "@discordjs/voice";
import { OpusEncoder } from "@discordjs/opus";
import { Speaker } from "./speaker.js";

function stream2buffer(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const _buf: any[] = [];
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
}

class OpusDecodingStream extends Transform {
  encoder: OpusEncoder;

  constructor(options: TransformOptions, encoder: OpusEncoder) {
    super(options);
    this.encoder = encoder;
  }

  _transform(data: Buffer, _encoding: any, callback: Function) {
    this.push(this.encoder.decode(data));
    callback();
  }
}

export class Recorder {
  speaker: Speaker;
  userIds: string[];
  recording: Record<string, boolean>;
  constructor(speaker: Speaker) {
    this.speaker = speaker;
    this.userIds = [];
    this.recording = {};
    this.init();
  }

  init() {
    const connection = getVoiceConnection(this.speaker.guildId);
    if (!connection) return;
    connection.receiver.speaking.on("start", (userId) => {
      // console.log(`User ${userId} started speaking`);
      if (this.userIds.includes(userId) && !this.recording[userId]) {
        console.log(`User ${userId} started speaking`);
        this.record(connection.receiver, userId);
      }
    });
  }

  async record(receiver: VoiceReceiver, userId: string) {
    this.recording[userId] = true;
    const opusStream = receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 500,
      },
    });
    const decoder = new OpusDecodingStream({}, new OpusEncoder(16000, 1));
    const out = new Writer({
      channels: 1,
      sampleRate: 16000,
    });
    opusStream.pipe(decoder).pipe(out);
    const data = await stream2buffer(out);
    const metadata = await mm.parseBuffer(data);
    const duration = metadata?.format?.duration;
    if (duration && (duration > 20 || duration < 1)) {
      this.recording[userId] = false;
      return;
    }
    // console.log(metadata);
    // const res = await fetch("https://api.wit.ai/speech?v=20210928", {
    //   method: "POST",
    //   headers: {
    //     Authorization: "Bearer " + process.env.WIT_AI_TOKEN,
    //     "Content-Type": "audio/wav",
    //   },
    //   body: data,
    // })
    //   .then((res) => res.text())
    //   .then((res) => {
    //     return JSON.parse(
    //       res.replace(/\n|\s/g, "").replace(/\{"text"(.*?)\}/g, "")
    //     );
    //   })
    //   .catch((e) => e);
    // console.log(res);

    this.recording[userId] = false;
  }
}