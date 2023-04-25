import { ButtonBuilder } from "discord.js";
import { ExtensionClient } from "@src/types/index.js";
import { random, shuffle } from "@src/util/index.js";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  escapeMarkdown,
  GuildMember,
  InteractionCollector,
  MappedInteractionTypes,
  Message,
  MessageComponentInteraction,
  MessageComponentType,
  StringSelectMenuInteraction,
} from "discord.js";
import {
  MinigameData,
  MinigameConstructor,
  MinigameBase,
} from "@src/types/minigame.js";

type oxGameLog = {
  pos: number;
  user?: GuildMember;
  emoji?: string;
  username: string;
  pattern?: string;
  isEnd?: string;
};

export const minigame: MinigameConstructor = class ox extends MinigameBase {
  static gameData = {
    name: "ox",
    description: "マルバツゲーム",
    details: `3x3で一列自分の駒を揃えると勝ちな簡単なゲーム。
先手と後手に分かれて:o:と:x:を交互に打っていきます。
:one:~:nine:のボタンがあるので、打ちたいところを押してください。
はじめに一列揃えたほうが勝ちです。`,
    maxMember: 2,
    minMember: 1,
    joinInMidway: false,
  };
  board: (string | null)[] = Array(9).fill(null);
  emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
  pattern = ["⭕", "❌"];
  log: oxGameLog[] = [];
  data: MinigameData;
  playerPos: 0 | 1 = 0;
  msg!: Message;
  collector!: InteractionCollector<
    MappedInteractionTypes[MessageComponentType]
  >;
  client: ExtensionClient;
  get nextPlayer(): GuildMember | undefined {
    return this.data.members[this.playerPos];
  }
  constructor(client: ExtensionClient, data: MinigameData) {
    super(client, data);
    this.data = data;
    this.client = client;
    this.data.members = shuffle(this.data.members);
    this.start();
  }

  async start(): Promise<void> {
    super.start();
    this.msg = await this.data.channel.send(this.draw());
    const filter = (interaction: MessageComponentInteraction) =>
      interaction.customId.indexOf("gb_ox_button") == 0;
    this.collector = this.msg.createMessageComponentCollector({ filter });
    this.collector.on("collect", this.collect.bind(this));
  }
  end(): void {
    super.end();
    this.msg.edit(this.draw());
    this.collector.stop();
  }
  draw() {
    const buttons = this.board.map((b, i) =>
      new ButtonBuilder()
        .setCustomId(`gb_ox_button:${i}`)
        .setEmoji({ name: b || this.emojis[i] })
        .setDisabled(b != null || this.data.isEnd)
        .setStyle(ButtonStyle.Secondary)
    );
    return {
      content: `${this.log.map((log) => this.logToText(log)).join("\n")}

${
  this.data.isEnd
    ? "終了しました。"
    : `次のプレイヤー:${
        this.nextPlayer == undefined
          ? "CPU"
          : "`" + escapeMarkdown(this.nextPlayer.displayName) + "`"
      }`
}`,
      //embeds: embed,
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents([
          buttons[0],
          buttons[1],
          buttons[2],
        ]),
        new ActionRowBuilder<ButtonBuilder>().setComponents([
          buttons[3],
          buttons[4],
          buttons[5],
        ]),
        new ActionRowBuilder<ButtonBuilder>().setComponents([
          buttons[6],
          buttons[7],
          buttons[8],
        ]),
      ],
    };
  }

  collect(
    interaction: ButtonInteraction<CacheType> | StringSelectMenuInteraction<CacheType>
  ) {
    // const pos = this.emojis.indexOf(reaction.emoji.name)
    if (this.nextPlayer?.id != interaction.user.id) {
      interaction.reply({
        content: this.data.members
          .map((m) => m.id)
          .some((id) => id == interaction.user.id)
          ? "あなたの番ではありません。"
          : "ゲームに参加していません。",
        ephemeral: true,
      });
    }
    const pos = +interaction.customId.split(":")[1];
    console.log(pos);
    this.put(interaction.member as GuildMember, pos, interaction);
    // if (this.put(user, pos)) reaction.remove();
  }

  async put(
    user: GuildMember | undefined,
    pos: number,
    interaction: ButtonInteraction<CacheType> | StringSelectMenuInteraction<CacheType>
  ) {
    const isCPU = user == undefined;
    if (!isCPU && user.id != this.nextPlayer?.id) return false;
    if (this.putPossible(pos)) {
      this.board[pos] = this.pattern[this.playerPos];
      this.log.push({
        pos,
        user,
        emoji: this.emojis[pos],
        username: user?.displayName || user?.id || "cpu",
        pattern: this.pattern[this.playerPos],
      });
    }
    // console.log()
    const isWin = this.checkWin(this.playerPos);
    if (isWin || this.putPossibleArray().length == 0) {
      // console.log("end")
      this.log.push({
        pos,
        user,
        username: user?.displayName || user?.id || "cpu",
        isEnd: isWin ? "win" : "draw",
      });
      await interaction.update(this.draw());
      this.end();
    } else {
      // this.msg.reactions.cache.get(this.emojis[pos]) ?.remove();
      this.playerPos = this.playerPos == 0 ? 1 : 0;
      if (!this.cpu(interaction)) interaction.update(this.draw());
    }

    return true;
  }

  cpu(
    interaction: ButtonInteraction<CacheType> | StringSelectMenuInteraction<CacheType>
  ) {
    if (this.nextPlayer != undefined) return false;
    const reach =
      this.checkReach(this.playerPos) ||
      this.checkReach(Number(!this.playerPos));
    if (reach) {
      this.put(undefined, reach, interaction);
    } else {
      const array = this.board
        .map((b, i) => (b ? +b : i))
        .filter((b, i) => b == i);
      this.put(undefined, array[random(0, array.length - 1)], interaction);
    }
    return true;
  }

  checkReach(id: number) {
    const bd = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];
    const reachLine = bd.filter((b) => {
      const line = b.map((i) => this.board[i]);
      return (
        line.filter((k) => k == null).length == 1 &&
        line.filter((k) => k == this.pattern[id]).length == 2
      );
    })[0];
    return reachLine ? reachLine.find((pos) => this.putPossible(pos)) : null;
  }

  logToText(log: oxGameLog) {
    const putText = `\`${escapeMarkdown(log.username)}\`が${log.emoji}に${
      log.pattern
    }を打った。`;
    const endText =
      log.isEnd == "win"
        ? `\`${escapeMarkdown(log.username)}\`が勝利した。`
        : `引き分け`;
    return log.isEnd ? endText : putText;
  }

  putPossible(pos: number) {
    return this.board[pos] === null;
  }
  putPossibleArray(array?: (number | string | null)[]) {
    if (!array) array = this.board;
    return array
      .map((b, i) => (b ? b : this.emojis[i]))
      .filter((b, i) => this.putPossible(i));
  }
  checkWin(id: number) {
    const bd = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];
    return bd.some((i) => i.every((j) => this.board[j] == this.pattern[id]));
  }
};
