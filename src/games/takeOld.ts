import { EmbedBuilder } from "@discordjs/builders";
import { ExtensionClient } from "@src/types/index.js";
import {
  MinigameBase,
  MinigameConstructor,
  MinigameData,
} from "@src/types/minigame.js";
import {
  GuildMember,
  Message,
  MessageReaction,
  ReactionCollector,
  ReactionEmoji,
  ReactionManager,
  User,
} from "discord.js";

type takeGameLog = {
  type: "log" | "end";
  pos: number;
  user?: User;
  username: string;
};

export const minigame: MinigameConstructor = class takeOld extends MinigameBase {
  static gameData = {
    name: "takeOld",
    description: "たけのこたけのこニョッキッキ",
    details: `普通のたけのこたけのこニョッキッキです。
人数分のリアクションがあるので順番にリアクションをしてください。
同じ番号にリアクションしたり、最後にリアクションした場合負けになります。
順番にリアクションできなかった場合も負けになります。`,
    maxMember: 10,
    minMember: 2,
    joinInMidway: false,
    disabled:true
  };
  msg!: Message;
  emojis: string[];
  completionReact!: boolean;
  collector!: ReactionCollector;
  log: takeGameLog[] = [];
  constructor(client: ExtensionClient, data: MinigameData) {
    super(client, data);
    this.data = data;
    this.client = client;
    this.emojis = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ].slice(0, this.data.members.length - 1);
    this.start();
  }
  async start() {
    this.msg = await this.data.channel.send({ embeds: [this.draw()] });
    for (const emoji of this.emojis) await this.msg.react(emoji);
    this.completionReact = true;
    if (this.data.isEnd) return;
    this.msg.edit({ embeds: [this.draw()] });
    const filter = (reaction: MessageReaction, user: User) =>
      this.emojis.includes(reaction.emoji.name || "") &&
      this.data.members.map((u) => u.id).includes(user.id);
    this.collector = this.msg.createReactionCollector({ filter });
    this.collector.on("collect", this.collect.bind(this));
  }

  collect(reaction: MessageReaction, user: User) {
    const pos = this.emojis.indexOf(reaction.emoji.name || "");
    if (pos == this.log.length) {
      this.log.push({
        type: "log",
        user,
        pos,
        username: user.username,
      });
      this.msg.edit({ embeds: [this.draw()] });
      if (pos == this.emojis.length - 1) this.end();
    } else {
      this.log.push({
        type: "end",
        user,
        pos,
        username: user.username,
      });
      this.end();
    }
    console.log(pos);
    // this.put(user, pos);
    // if (this.put(user, pos)) reaction.remove();
  }

  end() {
    this.msg.reactions.removeAll();
    if (this.collector) this.collector.stop();
    this.msg.edit({ embeds: [this.draw()] });
  }

  draw() {
    const embed = new EmbedBuilder();
    embed
      .setTitle("たけのこたけのこニョッキッキ")
      .setDescription(
        `${
          this.completionReact ? "開始" : "待機中\nリアクションしないでください"
        }

ログ
${this.log.map((log) => this.logToText(log)).join("\n")}${
          this.data.isEnd
            ? `

**勝者** :${this.log
                .filter((l) => l.type == "log")
                .map((l) => l.username)
                .join(", ")}`
            : ""
        }`
      )
      .setFooter({ text: this.data.isEnd ? "終了しました。" : "" });
    return embed;
  }

  logToText(log: takeGameLog) {
    const putText = `${log.username} : ${log.pos + 1}ニョッキ`;
    return log.type == "log" ? putText : "";
  }
};
