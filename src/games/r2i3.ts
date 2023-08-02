import { ExtensionClient } from "@src/types/index.js";
import {
  MinigameBase,
  MinigameConstructor,
  MinigameData,
} from "@src/types/minigame.js";
import { shuffle } from "@src/util/index.js";
import { GuildMember, Message, MessageCollector } from "discord.js";
import Kuroshiro from "kuroshiro";
console.log(Kuroshiro);
const kuroshiro = new Kuroshiro();
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
await kuroshiro.init(new KuromojiAnalyzer());

export const minigame: MinigameConstructor = class r2i3 extends MinigameBase {
  static gameData = {
    name: "r2i3",
    description: "しりとり",
    details:
      "なんでもありのしりとりです。文字が繋がっていれば許されます。",
    maxMember: 20,
    minMember: 2,
    joinInMidway: false,
  };
  data: MinigameData;
  client: ExtensionClient;
  history: string[] = [];
  index = 0;
  collector!: MessageCollector;
  constructor(client: ExtensionClient, data: MinigameData) {
    super(client, data);
    this.data = data;
    this.client = client;
    this.data.members = shuffle(this.data.members);
    this.start();
  }
  get nowMember(): GuildMember {
    return this.data.members[this.index];
  }
  async start(): Promise<void> {
    super.start();
    const filter = (m: Message) => {return m.author.bot == false};
    this.collector = this.data.channel.createMessageCollector({ filter });
    this.collector.on("collect", this.collect.bind(this));
    this.data.channel.send("〇〇さんから「り」で始めてください。");
  }
  async collect(m: Message): Promise<void> {
    const text = m.cleanContent;
    const hiragana = await kuroshiro.convert(text, { to: "hiragana" });
    const last = this.history[this.history.length - 1];
    const isChain = last.at(-1) == hiragana.at(0);
    const isNotRepeat = !this.history.includes(hiragana);
    const isAuthor = m.author.id == this.nowMember.id;
    if (isChain && isNotRepeat && isAuthor) {
      this.history.push(hiragana);
      m.react("☑");
      this.next();
    } else if ((!isChain || !isNotRepeat) && isAuthor) {
      m.react("❌");
    }
    return;
  }
  end(): void {
    super.end();
    this.collector.stop();
  }
  next(): void {
    this.index++;
    if (this.index >= this.data.members.length) {
      this.index = 0;
    }
    return;
  }
};
