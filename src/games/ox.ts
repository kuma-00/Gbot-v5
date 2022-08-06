import { ButtonBuilder } from "@discordjs/builders";
import { EmbedBuilder, GuildMember, User } from "discord.js";
import {
  Minigame,
  MinigameData,
  MinigameConstructor,
} from "./../types/minigame";

type oxGmaeLog = {
  pos: number;
  user?: GuildMember;
  emoji: string;
  username: string;
  pattern: string;
  isEnd?:string;
};

export const minigame: MinigameConstructor = class ox implements Minigame {
  static gameData = {
    name: "ox",
    description: "マルバツゲーム",
    details:
      "3x3で一列自分の駒を揃えると勝ちな簡単なゲーム。先手と後手に分かれて:o:と:x:を交互に打っていきます。:one:~:nine:のマスがあるので、:one:~:nine:のリアクションで打てます。はじめに一列揃えたほうが勝ちです。",
    maxMember: 0,
    minMember: 0,
    joinInMidway: false,
  };
  board = Array(9).fill(null);
  emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
  log = [];
  data: MinigameData;
  playerPos: 0|1 = 0;
  get nextPlayer() {
    return this.data.members[this.playerPos];
  }
  constructor(data: MinigameData) {
    this.data = data;
  }

  start(): void {}
  end(): void {}
  draw() {
    const board = sliceByNumber(
      this.board.map((b, i) => (b ? b : this.emojis[i])),
      3
    ).reduce((i, j) => i + "\n" + j.reduce((k, l) => k + l, ""), "");
    const embed = new EmbedBuilder();
    embed
      .setTitle("OXゲーム")
      .setDescription(
        `
${board}


ログ
${this.log.map((log) => this.logToText(log)).join("\n")}
`
      )
      .setFooter(
        {text: this.data.isEnd
          ? "終了しました。"
          : `次のプレイヤー:${
              this.nextPlayer == undefined
                ? "CPU"
                : this.nextPlayer.displayName
            }`}
      );
            const buttons = new Array(9).fill(0).map((_,i)=>new ButtonBuilder().setCustomId(`gobt_ox_button:${i}`).setLabel(this.emojis[i]))
    return {embeds:embed};
  }

  logToText(log:oxGmaeLog) {
    const putText = `${log.username}が${log.emoji}に${log.pattern}を打った。`;
    const endText =
      log.isEnd == "win" ? `${log.username}が勝利した。` : `引き分け`;
    return log.isEnd ? endText : putText;
  }
};

function sliceByNumber<T>(array: T[], number: number) {
  const length = Math.ceil(array.length / number);
  return new Array(length)
    .fill(0)
    .map((_, i) => array.slice(i * number, (i + 1) * number));
}
