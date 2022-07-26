import {
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Command, CommandCategory } from "@src/types/command";
import {
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
} from "@discordjs/builders";
import { MinigameData } from "@src/types/minigame";

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
  execute(client, interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString("name",false);
    if(name){
      
    } else {
      const list = [...client.minigames.values()].map(game => `${game.gameData.name} : ${game.gameData.description}`).join("\n");
      const embed = new EmbedBuilder();
      embed
        .setTitle("ミニゲーム")
        .setDescription(`以下の一覧から選択してゲームを開始できます。
一覧
\`\`\`${list}\`\`\``)
      interaction.followUp({embeds:[embed]});
    }
  },
  async autocomplete(client, interaction) {
    const focusedOption = interaction.options.getFocused(true);
		const choices = Array.from(client.minigames.keys())
		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
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
    return new ActionRowBuilder().addComponents(
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
  // console.log(selects)
  const add = new ButtonBuilder()
    .setCustomId("gb_game_addRemoveMember") //buttonにIDを割り当てる   *必須
    .setStyle(ButtonStyle.Primary) //buttonのstyleを設定する  *必須
    .setDisabled(game.isEnd || (!gameData.joinInMidway && game.isStart))
    .setLabel("参加/退出");
  // const dc = new discorgame.MessageButton()
  //     .setCustomId("gb_game_removeMember") //buttonにIDを割り当てる   *必須
  //     .setStyle("SECONDARY")	//buttonのstyleを設定する  *必須
  //     .setDisabled(data.member.length == 0 || game.end || (!gameData.joinInMidway && game.start))
  //     .setLabel("退出");
  const start = new ButtonBuilder()
    .setCustomId("gb_game_start") //buttonにIDを割り当てる   *必須
    .setStyle(ButtonStyle.Success) //buttonのstyleを設定する  *必須
    .setDisabled(
      game.isEnd || game.isStart || game.members.length < gameData.minMember
    )
    .setLabel("開始");
  const close = new ButtonBuilder()
    .setCustomId("gb_game_close") //buttonにIDを割り当てる   *必須
    .setStyle(ButtonStyle.Secondary) //buttonのstyleを設定する  *必須
    .setDisabled(game.isEnd)
    .setLabel("終了");

  return {
    embeds: [disme],
    components: gameData.ruleData
      ? [
          ...(selects?.slice(0, 4) || []),
          new ActionRowBuilder().addComponents([add, start, close]),
        ]
      : [new ActionRowBuilder().addComponents([add, start, close])],
  };
};
