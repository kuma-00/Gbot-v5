import { ExtensionClient } from "@src/types";
import {
  MinigameBase,
  MinigameConstructor,
  MinigameData,
} from "@src/types/minigame";
import { random, speak } from "@src/util";
import { EmbedBuilder, escapeMarkdown, GuildMember, Message } from "discord.js";

export const minigame: MinigameConstructor = class iddn extends MinigameBase {
  static gameData = {
    name: "iddn",
    description: "いつどこで誰が何をしたゲーム",
    details:
      "いつ、どこで、だれが、何をしたを参加者がそれぞれ入力し、そこから文を混ぜて新しい文章を作成します。",
    maxMember: 20,
    minMember: 2,
    joinInMidway: false,
  };
  data: MinigameData;
  client: ExtensionClient;
  completionMember: GuildMember[] = [];
  progressMsg?: Message;
  constructor(client: ExtensionClient, data: MinigameData) {
    super(client, data);
    this.data = data;
    this.client = client;
    this.start();
  }
  async start(): Promise<void> {
    super.start();
    this.progress();
    const result = await Promise.all(
      this.data.members.map((member) => {
        const disme = new EmbedBuilder().setTitle("IDDN  GAME")
          .setDescription(`**いつ どこで 誰が 何をした ゲーム!!!**
\`いつ どこで 誰が 何をした\`をスペースで区切って入力してください。
        `);
        member.send({ embeds: [disme] });
        return this.add(member);
      })
    );
    if (this.data.isEnd) return;
    let whens = result.map((r) => r?.when);
    let whos = result.map((r) => r?.who);
    let wheres = result.map((r) => r?.where);
    let whats = result.map((r) => r?.what);
    const articles = result.map((r) => {
      const when = whens[random(0, whens.length - 1)];
      const who = whos[random(0, whos.length - 1)];
      const where = wheres[random(0, wheres.length - 1)];
      const what = whats[random(0, whats.length - 1)];
      whens = whens.filter((i) => i?.id != when?.id);
      whos = whos.filter((i) => i?.id != who?.id);
      wheres = wheres.filter((i) => i?.id != where?.id);
      whats = whats.filter((i) => i?.id != what?.id);
      const users = [when, who, where, what]
        .map((i) => i?.member.displayName || i?.member.user.username)
        .join(" ");
      const text = [when, who, where, what].map((i) => i?.text).join(" ");
      //this.nextPlayer.displayName || this.nextPlayer.username
      return {
        user: `${escapeMarkdown(users)}`,
        text: `**${escapeMarkdown(text)}**`,
      };
    });
    const disme = new EmbedBuilder();
    disme.setTitle("IDDN  GAME").setDescription(`完成した文章たち

${articles.map((a) => `${a.user}\n${a.text}`).join("\n\n")}`);
    await this.data.channel.send({ embeds: [disme] });
    speak(
      this.client,
      this.data.channel.guild,
      `完成した文章:${articles.map((a) => a.text).join("\n")}`
    );
    // const read = await this.data.channel.send(`::${articles.map(a=>a.text).join("\n")}`);
    // read.delete();
    super.end();
  }
  async add(member: GuildMember) {
    const dm = await member.createDM();
    const filter = (m: Message) => {
      if (this.data.isEnd) return true;
      const argument = m.content.split(/\s/);
      if (argument.length != 4 && m.author.id == member.id) m.react("❌");
      return argument.length == 4;
    };
    const msg = (await dm.awaitMessages({ max: 1, filter })).first();
    if (!msg) return;
    await msg.react("✅");
    const [when, who, where, what] = msg.content.split(/\s/);
    this.completionMember.push(member);
    this.progress();
    return {
      when: { member, id: member.id, text: when },
      who: { member, id: member.id, text: who },
      where: { member, id: member.id, text: where },
      what: { member, id: member.id, text: what },
    };
  }
  async progress() {
    if (!this.progressMsg) {
      this.progressMsg = await this.data.channel.send({
        content: `入力状況:${"🟥".repeat(this.data.members.length)}`,
      });
    } else {
      this.progressMsg.edit({
        content: `入力状況:${"✅".repeat(
          this.completionMember.length
        )}${"🟥".repeat(
          this.data.members.length - this.completionMember.length
        )}`,
      });
    }
    if (
      this.data.members.length <= this.completionMember.length &&
      this.progressMsg.deletable
    ) {
      this.progressMsg.delete();
    }
  }
};
