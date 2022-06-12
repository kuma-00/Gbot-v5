import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  getVoiceConnection,
  AudioPlayerStatus,
  createAudioResource,
  createAudioPlayer,
} from "@discordjs/voice";
import {
  CollectorFilter,
  Message,
  MessageCollector,
  Snowflake,
  TextBasedChannel,
  VoiceBasedChannel,
} from "discord.js";
import { ExtensionClient, SpeakResource, StorageType } from "@src/types";
import { storage } from "@src/core/storage";
import { VoiceText } from "@src/core/voicetext";
import { SpeakData, sleep } from "@src/util";
import { VTOption, VTDefaultOption } from "@src/types/VT";
import { Readable } from "node:stream";
const voice = new VoiceText(process.env.VTKey || "");

export class Speaker {
  isPlaying = false;
  queue = new Array<SpeakResource>(0);
  private _player = createAudioPlayer();
  private _loop = false;
  private _lastUserName = "";
  private _dicPattern: RegExp = / /;
  private _dic: { [key: string]: string } = {};
  private _collector!: MessageCollector;

  get guildId() {
    return this.voiceChannel.guild.id;
  }

  constructor(
    public client: ExtensionClient,
    public voiceChannel: VoiceBasedChannel,
    public textChannel: TextBasedChannel
  ) {
    this.client = client;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.createDicPattern();
  }

  async start(voiceChannel: VoiceBasedChannel, textChannel: TextBasedChannel) {
    this.isPlaying = false;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.addChannel(textChannel.id);
    const connection = joinVoiceChannel({
      channelId: this.voiceChannel.id,
      guildId: this.guildId,
      adapterCreator: this.voiceChannel.guild.voiceAdapterCreator,
    });
    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5000),
        ]);
      } catch (error) {
        console.log("強制切断されました");
      }
    });
    this.addQueue("読み上げが開始しました。");
    const filter: CollectorFilter<[Message<boolean>]> = async (m) => {
      const isGuild = !!m.guild;
      const isReadingChannel = await this.isReadingChannel(m.channelId);
      const isNotMyMessage = m.author.id !== this.client.user?.id;
      return isGuild && isReadingChannel && isNotMyMessage;
    };
    this._collector = textChannel.createMessageCollector({ filter });
    this._collector.on("collect", (m) => {
      const content = (() => {
        if (m.attachments.size > 0) {
          const images = m.attachments.filter(
            (a) => !!a.contentType?.includes("image")
          );
          const files = m.attachments.filter(
            (a) => !a.contentType?.includes("image")
          );
          const text =
            (images.size > 0 ? `。画像が${images.size}枚送信されました` : "") +
            (files.size > 0 ? `。ファイルが${files.size}個送信されました` : "");
          return m.cleanContent + text;
        }
        return m.cleanContent;
      })();
      const userName = m.member?.nickname || m.member?.user.username;
      this.addQueue(
        new SpeakData(content, {
          channelId: m.channelId,
          userName,
          userId: m.author.id,
        })
      );
    });
  }

  async end() {
    this._collector.stop();
    this.addQueue("読み上げが終了しました。");
    await this.addQueue("ご利用ありがとう御座います。");
    await sleep(4000);
    const connection = getVoiceConnection(this.voiceChannel.guild.id);
    if (connection) {
      connection.destroy();
      return true;
    }
    return false;
  }

  async addQueue(data: SpeakData | string) {
    if (typeof data === "string")
      data = new SpeakData(data, { channelId: this.textChannel.id });
    if (
      data.userName &&
      data.userName.match(/\S/g) &&
      data.userName !== this._lastUserName
    ) {
      data.addUserName();
      this._lastUserName = data.userName;
    }
    data.text = await this.textReplace(data.text);
    console.log("読み上げ:", data.text);
    if (data.text.match(/{\s*s?:\/\/[\w!?/+\-_~=;.,*&@#$%()'[\]]+\s*}/)) {
      const texts = data.text.split(/({|})/);
      for (const text of texts) {
        console.log({ text });
        if (text === "{" || text === "}" || text === "") continue;
        if (text.match(/s?:\/\//)) {
          if (data.text.match(/s?:\/\/drive.google.com\/file\/d\/(.+)\/view/)) {
            const id = data.text.match(
              /s?:\/\/drive.google.com\/file\/d\/(.+)\/view/
            )?.[1];
            this.queue.push(new URL(`https://drive.google.com/uc?id=${id}`));
          } else {
            this.queue.push(new URL(`http${text}`));
          }
          this.playAudio();
        } else {
          await this.addSpeak(new SpeakData(text).inheritance(data));
        }
      }
    } else {
      await this.addSpeak(data);
    }
  }

  async textReplace(text: string) {
    // 発声URLの一時変換
    text = text.replace(/{\s*http/, "{");
    // URL省略
    text = text.replace(/https?:\/\/[\w!?/+\-_~=;.,*&@#$%()'[\]]+/g, "URL省略");
    // DiscordSRV & LunaChat 矯正
    text = text.replace(/»(.)+\(/g, "");
    // 辞書読み込み
    if (
      (await storage(StorageType.SETTINGS).get(`${this.guildId}:dicChange`))
        ?.value
    ) {
      await this.createDicPattern();
      await storage(StorageType.SETTINGS).put(
        false,
        `${this.guildId}:dicChange`
      );
    }
    if (!this._dicPattern) await this.createDicPattern();
    // 辞書による置き換え
    text = text.replace(this._dicPattern, (e) => this._dic[e]);
    // 辞書変換後の発声URLの一次変換
    text = text.replace(/{\s*http/, "{");
    // text = text.replace(/<\/?(.+):?(\d+)>/, "");
    // 以下略
    text = text.length > 190 ? text.slice(0, 190) + "以下略" : text;
    return text;
  }

  async createDicPattern() {
    const dicData = await this.getDic();
    if (dicData) {
      this._dicPattern = new RegExp(
        `(${Object.keys(dicData)
          .map((i) => i.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&"))
          .join("|")})`,
        "gm"
      );
      this._dic = dicData;
      return this._dicPattern;
    }
  }

  async getDic() {
    const dic: { [key: string]: string } = {};
    const words = await storage(StorageType.WORDS, this.guildId).fetchAll();
    // for await (const [key, value] of words) {
    //   dic[key] = value;
    // }
    words.items.forEach(({ key, value }) => {
      dic[String(key)] = String(value);
    });

    return dic;
  }

  async addSpeak(data: SpeakData) {
    const vicData: VTOption =
      ((
        await storage(StorageType.SETTINGS).get(
          `${this.guildId}:${data.userId}`
        )
      )?.value as VTOption) || VTDefaultOption;
    const buf = new Uint8Array(await voice.option(vicData).speak(data.text));
    const stream = new Readable({
      read() {
        this.push(buf);
        this.push(null);
      },
    });
    this.queue.push(stream);
    this.playAudio();
  }

  playAudio() {
    if (!this.isPlaying && this.queue.length > 0) {
      this.isPlaying = true;
      const resource =
        this.queue[0] instanceof URL ? this.queue[0].toString() : this.queue[0];
      console.log(resource instanceof Readable || resource);
      const audioResource = createAudioResource(resource, {
        inlineVolume: true,
      });
      this._player = createAudioPlayer();
      const connection = getVoiceConnection(this.guildId);
      connection?.subscribe(this._player);
      this._player.play(audioResource);
      this._player.on("error", (error) => {
        console.error(error);
      });
      this._player.on(AudioPlayerStatus.Idle, () => {
        console.log("test");
        if (this._loop) {
          this.queue.push(this.queue[0]);
          this.queue.shift();
        } else {
          this.queue.shift();
        }
        this.isPlaying = false;
        this.playAudio();
      });
    }
  }

  async isReadingChannel(textChannelId: Snowflake) {
    const readChannels = (
      await storage(StorageType.SETTINGS, this.guildId).get(
        `${this.guildId}:readChannels`
      )
    )?.value;
    return Array.isArray(readChannels) && readChannels.includes(textChannelId);
  }

  async addChannel(textChannelId: Snowflake) {
    const readChannels =
      (await storage(StorageType.SETTINGS).get(`${this.guildId}:readChannels`))
        ?.value || [];
    if (Array.isArray(readChannels)) {
      readChannels.push(textChannelId);
      await storage(StorageType.SETTINGS).put(
        readChannels.filter((x, i, a) => a.indexOf(x) === i),
        `${this.guildId}:readChannels`
      );
    } else {
      await storage(StorageType.SETTINGS).put(
        [textChannelId],
        `${this.guildId}:readChannels`
      );
    }
  }
}
