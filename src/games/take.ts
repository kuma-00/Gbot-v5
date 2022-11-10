import { ExtensionClient } from "@src/types/index.js";
import {
  MinigameBase,
  MinigameConstructor,
  MinigameData,
} from "@src/types/minigame.js";
import { sleep } from "@src/util/index.js";
import {
  Message,
  MessageReaction,
  User,
  SelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  escapeMarkdown,
  MessageComponentInteraction,
  ButtonInteraction,
  CacheType,
  InteractionCollector,
  SelectMenuInteraction,
  Collection,
  GuildManager,
  GuildMember,
  Guild,
} from "discord.js";

type takeGmaeLog = {
  type: "log" | "end";
  pos: string;
  member: GuildMember;
  time: number;
};

export const minigame: MinigameConstructor = class take extends MinigameBase {
  static gameData = {
    name: "take",
    description: "🎍たけのこたけのこ🎍ニョッキッキ(作成中)",
    details: `たけのこたけのこニョッキッキです。
一人ずつ一ニョッキ、二ニョッキと言い、途中でかぶるまたは最後まで残った人が負けです。
反射神経とタイミングの駆け引きが重要です。
セレクトメニューから何ニョッキかを選び、ボタンで言うことができます。`,
    maxMember: 10,
    minMember: 2,
    joinInMidway: false,
  };
  log: takeGmaeLog[] = [];
  countMsg!: Message;
  isCountDownEnd = false;
  UIMsg!: Message;
  collector!: InteractionCollector<
    ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>
  >;
  nyokiData = new Collection<string, string>();
  constructor(client: ExtensionClient, data: MinigameData) {
    super(client, data);
    this.data = data;
    this.client = client;
    this.start();
  }
  async start() {
    super.start();
    const countDown = (n: number) => ({ content: `開始まで:${n}秒` });
    this.countMsg = await this.data.channel.send(countDown(3));
    this.UIMsg = await this.data.channel.send(this.draw());
    const filter = (interaction: MessageComponentInteraction) =>
      ["gb_take_nyoki_select", "gb_take_send_button"].includes(
        interaction.customId
      );
    this.collector = this.UIMsg.createMessageComponentCollector({ filter });
    this.collector.on("collect", this.collect.bind(this));
    await sleep(1000);
    this.countMsg.edit(countDown(2));
    await sleep(1000);
    this.countMsg.edit(countDown(1));
    await sleep(1000);
    this.isCountDownEnd = true;
    this.countMsg.edit({ content: "スタート" });
  }

  collect(
    interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>
  ) {
    // const pos = this.emojis.indexOf(reaction.emoji.name || "");
    // if (pos == this.log.length) {
    //   this.log.push({
    //     type: "log",
    //     user,
    //     pos,
    //     username: user.username,
    //   });
    //   this.msg.edit({ embeds: [this.draw()] });
    //   if (pos == this.emojis.length - 1) this.end();
    // } else {
    //   this.log.push({
    //     type: "end",
    //     user,
    //     pos,
    //     username: user.username,
    //   });
    //   this.end();
    // }
    // console.log(pos);
    // this.put(user, pos);
    // if (this.put(user, pos)) reaction.remove();
    if (interaction.isSelectMenu()) {
      console.log(interaction.values[0]);
      this.nyokiData.set(interaction.user.id, interaction.values[0]);
      interaction.reply({
        content: `${interaction.values[0]}ニョッキを選びました`,
        ephemeral: true,
      });
    } else if (interaction.isButton()) {
      if (this.log.length == 0) {
        this.log.push({
          type: "log",
          member: interaction.member as GuildMember,
          pos: this.nyokiData.get(interaction.user.id) || "0",
          time: Date.now(),
        });
      } else if(this.log.at(-1)?.pos == this.nyokiData.get(interaction.user.id)) {
        const last = this.log.at(-1)
        if(last)last.type = "end";
      }
    }
    if (interaction.isRepliable()) interaction.update(this.draw(false));
  }

  end() {
    super.end();
    // this.msg.reactions.removeAll();
    // if (this.collector) this.collector.stop();
    // this.msg.edit({ embeds: [this.draw()] });
    this.UIMsg.edit(this.draw());
    this.collector.stop();
  }

  draw(changeCom = true) {
    console.log("draw");
    const content = `たけのこたけのこニョッキッキ
${this.log.map((log) => this.logToText(log)).join("\n")}${
      this.data.isEnd
        ? `**勝者** :${this.log
            .filter((l) => l.type == "log")
            .map((l) => l.member.displayName)
            .join(", ")}`
        : ""
    }`;
    const selectMenu = new SelectMenuBuilder()
      .setCustomId(`gb_take_nyoki_select`)
      .setPlaceholder("何ニョッキ")
      .setMinValues(1)
      .setMaxValues(1)
      .setDisabled(this.data.isEnd)
      .addOptions(
        new Array(this.data.members.length - 1)
          .fill(0)
          .map((_, i) => i + 1)
          .map((n) => ({ label: `${n}ニョッキ`, value: "" + (n - 1) }))
      );
    const sendButton = new ButtonBuilder()
      .setCustomId("gb_take_send_button")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(this.data.isEnd)
      .setLabel("発言");
    const components =
      this.data.isEnd || !changeCom
        ? undefined
        : [
            new ActionRowBuilder<SelectMenuBuilder>().setComponents(selectMenu),
            new ActionRowBuilder<ButtonBuilder>().setComponents(sendButton),
          ];
    return { components, content };
  }

  logToText(log: takeGmaeLog) {
    const putText = `\`${escapeMarkdown(log.member.displayName)}\` : ${
      log.pos + 1
    }ニョッキ`;
    return log.type == "log" ? putText : "";
  }
};
