import { ExtensionClient } from "@src/types/index.ts";
import {
  MinigameBase,
  MinigameConstructor,
  MinigameData,
} from "@src/types/minigame.ts";
import { shuffle, speak } from "@src/util/index.ts";
import {
  EmbedBuilder,
  GuildMember,
  Message,
  MessageCollector,
} from "npm:discord.js";
import split from "npm:graphemesplit";
import KuromojiAnalyzer from "npm:kuroshiro-analyzer-kuromoji";
import { default as Kuroshiro } from "npm:kuroshiro/lib/index.ts";
const kuroshiro = new Kuroshiro.default();
await kuroshiro.init(new KuromojiAnalyzer());

function kanaToHira(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function komoziToOhmozi(str: string) {
  const komozi: Record<string, string> = {
    ぁ: "あ",
    ぃ: "い",
    ぅ: "う",
    ぇ: "え",
    ぉ: "お",
    ゕ: "か",
    ゖ: "け",
    っ: "つ",
    ゃ: "や",
    ゅ: "ゆ",
    ょ: "よ",
    ゎ: "わ",
  };
  return str.replace(/[ぁぃぅぇぉゕゖっゃゅょゎ]/g, (str) => komozi[str]);
}

function maxCharacter(str: string) {
  const charMap: Record<string, number> = {};
  let maxNum = 0;
  let maxChar = "";

  split(str).forEach(function (char) {
    if (charMap[char]) {
      charMap[char]++;
    } else {
      charMap[char] = 1;
    }
    if (charMap[char] > maxNum) {
      maxNum = charMap[char];
      maxChar = char;
    }
  });
  return maxChar;
}

export const minigame: MinigameConstructor = class r2i3 extends MinigameBase {
  static gameData = {
    name: "r2i3",
    description: "しりとり",
    details: `なんでもありのしりとりです。文字が繋がっていれば許されます。
終了したい場合は以下の終了ボタンを押すか、プレイヤーが｢しりとり終了｣と入力してください。`,
    maxMember: 20,
    minMember: 2,
    joinInMidway: false,
  };
  data: MinigameData;
  client: ExtensionClient;
  history: string[] = ["しりとり"];
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
  start(): void {
    super.start();
    const filter = (m: Message) => {
      return m.author.bot == false;
    };
    this.collector = this.data.channel.createMessageCollector({ filter });
    this.collector.on("collect", this.collect.bind(this));
    this.data.channel.send(
      `\`${this.nowMember.nickname}\`さんから「り」で始めてください。`,
    );
    speak(
      this.client,
      this.data.channel.guild,
      `\`${this.nowMember.nickname}\`さんから「り」で始めてください。`,
      this.data.channel.id,
    );
  }
  async collect(m: Message): Promise<void> {
    const text = m.cleanContent;
    if (
      text == "しりとり終了" &&
      this.data.members.some((member) => member.id == m.author.id)
    ) {
      this.end();
      return;
    }
    const hiragana = split(
      (await kuroshiro.convert(kanaToHira(text), { to: "hiragana" })).replace(
        /ー+$/,
        "",
      ),
    );
    const last = split(this.history[this.history.length - 1]);
    const isChain =
      last.map(komoziToOhmozi).at(-1) == hiragana.map(komoziToOhmozi).at(0);
    const isNotRepeat = !this.history.includes(hiragana.join(""));
    const isAuthor = m.author.id == this.nowMember.id;
    console.log(
      `${hiragana.join("")}の｢${hiragana.at(-1)}(${hiragana
        .at(-1)
        ?.charCodeAt(0)
        .toString(16)})｣`,
    );
    if (isChain && isNotRepeat && isAuthor) {
      this.history.push(hiragana.join(""));
      // m.react("✅");
      this.next();
      this.data.channel.send(`\`${hiragana.join("")}\`の｢${hiragana.at(-1)}｣
\`${this.nowMember.nickname}\`さんの番です。`);
      speak(
        this.client,
        this.data.channel.guild,
        `｢${hiragana.at(-1)}｣で${this.nowMember.nickname}さんの番です。`,
        this.data.channel.id,
      );
    } else if (!isChain && isNotRepeat && isAuthor) {
      m.react("❌");
      speak(
        this.client,
        this.data.channel.guild,
        "文字が繋がっていません。",
        this.data.channel.id,
      );
    } else if (isChain && !isNotRepeat && isAuthor) {
      m.react("🔄");
      speak(
        this.client,
        this.data.channel.guild,
        "以前使用されています。",
        this.data.channel.id,
      );
    } else if (!isChain && !isNotRepeat && isAuthor) {
      m.react("❌");
      speak(
        this.client,
        this.data.channel.guild,
        "文字が繋がっていないまたは以前使用されています。",
        this.data.channel.id,
      );
    }
  }
  end(): void {
    super.end();
    const embed = new EmbedBuilder().setTitle("しりとり終了")
      .setDescription(`続いた数 : ${this.history.length - 1}回
最も長いもの : ${this.history.reduce((a, b) => (a.length > b.length ? a : b))}
最も短いもの : ${this.history.reduce((a, b) => (a.length < b.length ? a : b))}
頻出文字 : ${maxCharacter(this.history.join(""))}`);
    this.data.channel.send({ embeds: [embed] });
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
