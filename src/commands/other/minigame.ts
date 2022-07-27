import { MinigameConstructor } from "./../../types/minigame";
import {
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  ButtonInteraction,
  SelectMenuInteraction,
  GuildMember,
  MessageComponentInteraction,
  InteractionType,
} from "discord.js";
import { Command, CommandCategory } from "@src/types/command";
import { MinigameData } from "@src/types/minigame";
import { randomId } from "@src/util";

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("minigame")
    .setDescription("ミニゲーム!!")
    .addStringOption((option) =>
      option.setName("name").setDescription("ゲーム名").setAutocomplete(true)
    ),
  async execute(client, interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name", false);
    const game = client.minigames.get(name || "");
    const channel = interaction.channel;
    if (name && game && channel && channel instanceof TextChannel) {
      const id = randomId();
      const minigameData: MinigameData = {
        gameConstructor: game,
        game: undefined,
        id,
        members: [],
        rules: game.gameData.defaultRule,
        channel,
        isEnd: false,
        isStart: false,
      };
      const fn:Record<string,Function> = {
        gb_game_start: (interaction: ButtonInteraction) => {
          const id = getId(interaction);
          const data = client.gameData.get(id);
          if (!(id in client.gameData) || !data) {
            interaction.reply({
              ephemeral: true,
              content: `無効なゲームです。`,
            });
            return;
          }
          data.isStart = true;
          data.game = new data.gameConstructor(data);
          interaction.update(createMessage(data));
        },
        gb_game_close: (interaction: ButtonInteraction) => {
          const id = getId(interaction);
          const data = client.gameData.get(id);
          if (!(id in client.gameData) || !data) {
            interaction.reply({
              ephemeral: true,
              content: `無効なゲームです。`,
            });
            return;
          }
          data.isEnd = true;
          interaction.update(createMessage(data));
          if (data.isStart && data.game?.end) data.game.end();
        },
        gb_game_addRemoveMember: (interaction: ButtonInteraction) => {
          const id = getId(interaction);
          const data = client.gameData.get(id);
          const member = interaction.member as GuildMember;
          if (!(id in client.gameData) || !data || !member) {
            interaction.reply({
              ephemeral: true,
              content: `無効なゲームです。`,
            });
            return;
          }
          if (data.members.some((m) => m.id == member.id)) {
            data.members = data.members.filter((m) => m.id != member.id);
          } else {
            data.members.push(member);
          }
          interaction.update(createMessage(data));
        },
        gb_game_rule_select: (interaction: SelectMenuInteraction) => {
          const id = getId(interaction);
          const data = client.gameData.get(id);
          if (!(id in client.gameData) || !data) {
            interaction.reply({
              ephemeral: true,
              content: `無効なゲームです。`,
            });
            return;
          }
          const values = interaction.values.map((val) => val.split(":")[1]);
          const cid = interaction.customId.split(":")[1];
          if(data.rules)data.rules[cid] = values;
          interaction.update(createMessage(data));
        },
      };

      minigameData.message = await interaction.followUp(createMessage(minigameData));
      client.gameData.set(id, minigameData);
      const filter = (interaction:MessageComponentInteraction) => {
        if(interaction.type == InteractionType.MessageComponent){
          const id = interaction.customId.split(":")[0];
          return !!fn[id];
        }
        return false;
      }
      const collector = interaction.channel.createMessageComponentCollector({filter,time: 10*60*1000});
      collector.on("collect",()=>{

      })
      collector.on("end",()=>{

      })
    } else {
      const list = [...client.minigames.values()]
        .map((game) => `${game.gameData.name} : ${game.gameData.description}`)
        .join("\n");
      const embed = new EmbedBuilder();
      embed.setTitle("ミニゲーム")
        .setDescription(`以下の一覧から選択してゲームを開始できます。
一覧
\`\`\`${list}\`\`\``);
      interaction.followUp({ embeds: [embed] });
    }
  },
  async autocomplete(client, interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const choices = Array.from(client.minigames.keys());
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};

export const createMessage = (game: MinigameData) => {
  const gameData = game.gameConstructor.gameData;
  const disme = new EmbedBuilder();
  disme
    .setAuthor({ name: game.isEnd ? "終了しました。" : game.id })
    .setTitle(`${gameData.name}`).setDescription(`${gameData.description}

**・説明**
${gameData.details}
${
  gameData.ruleText
    ? `
**・ルール**
${gameData.ruleText}
`
    : ""
}
**・人数**
${
  gameData.minMember == gameData.maxMember
    ? gameData.minMember
    : `${gameData.minMember}~${gameData.maxMember}`
}人

**・メンバー**
${game.members.length}人${
    game.members.length > 0
      ? `(${game.members.map((m) => m.displayName).join(",")})`
      : ""
  }
`);

  const selects = gameData.ruleData?.map((rule) => {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId(`gb_game_rule_select:${rule.id}`)
        .setPlaceholder("ルールを選択してください。")
        .setMinValues(1)
        .setMaxValues(1)
        .setDisabled(game.isEnd || game.isStart)
        .addOptions(
          rule.options.map((op) => {
            const cop = Object.assign({}, op);
            if (game.rules?.[rule.id]?.includes(cop.value)) cop.default = true;
            cop.value = `${rule.id}:${cop.value}`;
            return cop;
          })
        )
    );
  });
  const add = new ButtonBuilder()
    .setCustomId("gb_game_addRemoveMember")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(game.isEnd || (!gameData.joinInMidway && game.isStart))
    .setLabel("参加/退出");
  const start = new ButtonBuilder()
    .setCustomId("gb_game_start")
    .setStyle(ButtonStyle.Success)
    .setDisabled(
      game.isEnd || game.isStart || game.members.length < gameData.minMember
    )
    .setLabel("開始");
  const close = new ButtonBuilder()
    .setCustomId("gb_game_close")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(game.isEnd)
    .setLabel("終了");

  return {
    embeds: [disme],
    components: gameData.ruleData
      ? [
          ...(selects?.slice(0, 4) || []),
          new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
            [add, start, close]
          ),
        ]
      : [
          new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
            [add, start, close]
          ),
        ],
  };
};

const getId = (interaction: ButtonInteraction | SelectMenuInteraction) =>
  interaction.message.embeds[0]?.author?.name ||
  interaction.message?.content?.match(/\((.+)\)/)?.[1] ||
  "";
