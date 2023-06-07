import {
  VTSpeaker,
  VTEmotion,
  VTEmotionLevel,
  VTFormat,
  VTOption,
  VTDefaultOption,
} from "@src/types/VT.ts";
import { URLSearchParams } from "node:url";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";
import { encode } from 'std/encoding/base64.ts'

// https://github.com/pchw/node-voicetext

export class VoiceText {
  static API_URL = "https://api.voicetext.jp/v1/tts";

  apiKey: string;
  private _pitch = VTDefaultOption.pitch;
  private _speed = VTDefaultOption.speed;
  private _volume = VTDefaultOption.volume;
  private _speaker = VTDefaultOption.speaker;
  private _emotion = VTDefaultOption.emotion;
  private _emotionLevel = VTDefaultOption.emotionLevel;
  private _format = VTDefaultOption.format;

  constructor(apiKey: string, option?: Partial<VTOption>) {
    this.apiKey = apiKey;
    if (option) this.option(option);
  }

  option(options: Partial<VTOption>) {
    const { pitch, speed, volume, speaker, emotion, emotionLevel, format } = {
      ...VTDefaultOption,
      ...options,
    };
    this.pitch(pitch);
    this.speed(speed);
    this.volume(volume);
    this.speaker(speaker);
    this.emotion(emotion);
    this.emotionLevel(emotionLevel);
    this.format(format);
    return this;
  }

  speaker(speaker: VTSpeaker) {
    this._speaker = speaker;
    return this;
  }

  emotion(cat: VTEmotion) {
    if (this._speaker !== VTSpeaker.SHOW) {
      this._emotion = cat;
    }
    return this;
  }

  emotionLevel(lvl: VTEmotionLevel) {
    if (this._speaker !== VTSpeaker.SHOW) {
      this._emotionLevel = lvl;
    }
    return this;
  }

  pitch(lvl: number) {
    if (lvl >= 50 && lvl <= 200) {
      this._pitch = lvl;
    }
    return this;
  }

  speed(lvl: number) {
    if (lvl >= 50 && lvl <= 400) {
      this._speed = lvl;
    }
    return this;
  }

  volume(lvl: number) {
    if (lvl >= 50 && lvl <= 200) {
      this._volume = lvl;
    }
    return this;
  }

  format(format: VTFormat) {
    this._format = format;
    return this;
  }

  buildParams(text: string) {
    const createURLSearchParams = (data: {
      [key: string]: string | number | undefined;
    }) => {
      const params = new URLSearchParams();
      Object.keys(data).forEach((key) => {
        const d = data[key];
        if (d !== undefined) params.append(key, d.toString());
      });
      return params;
    };

    return createURLSearchParams({
      volume: this._volume,
      speed: this._speed,
      pitch: this._pitch,
      emotion_level:
        this._emotion === VTEmotion.NONE
          ? VTEmotionLevel.NONE
          : this._emotionLevel,
      emotion: this._emotion,
      speaker: this._speaker,
      format: this._format,
      text: text,
    });
  }

  async speak(text: string) {
    if (!text) {
      console.error("invalid argument. text: null");
    }
    text = text.slice(0, 200);
    const params = this.buildParams(text);
    const response = await fetch(VoiceText.API_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encode(`${this.apiKey}:`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    if (!response.ok) {
      throw new Error(
        `status:${response.status}\nmessage:${JSON.stringify(
          await response.json(),
        )}`,
      );
    }
    // const buf = await response.arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buf = response.body as ReadableStream;
    return Readable.fromWeb(buf);
  }
}
