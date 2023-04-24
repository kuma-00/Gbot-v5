import { ChatInputCommandInteraction } from "discord.js";
import {
  VTEmotion,
  VTEmotionLevel,
  VTSpeaker,
  VTFormat,
  VTOption,
} from "@src/types/VT.js";
import { SlashCommandBuilder } from "discord.js";
import { Command, CommandCategory } from "@src/types/command.js";
import { createVoiceEmbed } from "./voiceset.js";
import { SpeakData } from "@src/util/index.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("voicetest")
    .setDescription("読み上げの声をテストします。")
    .addStringOption((option) =>
      option
        .setName("speaker")
        .setDescription("声色")
        .addChoices(
          ...Object.values(VTSpeaker)
            .filter((s) => s != "show")
            .map((s) => ({ name: s, value: s })),
        )
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("pitch")
        .setDescription("声の高さ 50~200(%)")
        .setMaxValue(200)
        .setMinValue(50)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("speed")
        .setDescription("喋るスピード(声の高さも変わる) 50~400(%)")
        .setMaxValue(400)
        .setMinValue(50)
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("emotion")
        .setDescription("感情 基本は無しがオススメ")
        .addChoices(
          ...Object.values(VTEmotion).map((s) =>
            s === undefined
              ? { name: "none", value: "none" }
              : { name: s, value: s },
          ),
        )
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("emotionlevel")
        .setDescription("感情レベル")
        .addChoices(
          ...Object.values(VTEmotionLevel)
            .map((n) => (n === undefined ? "0" : n))
            .map((s) => ({ name: s, value: +s })),
        )
        .setRequired(true),
    ),
  async execute(client, interaction: ChatInputCommandInteraction) {
    const speaker = interaction.options.getString("speaker", true) as VTSpeaker;
    const pitch = interaction.options.getInteger("pitch", true);
    const speed = interaction.options.getInteger("speed", true);
    const _emotion = interaction.options.getString("emotion", true);
    const _emotionlevel = interaction.options.getInteger("emotionlevel", true);
    // if ([speaker, pitch, speed, _emotion, _emotionlevel].includes(null)) {
    //   const embed = new EmbedBuilder();
    //   embed
    //     .setTitle("エラー")
    //     .setDescription("引数の数または引数の値が適切ではありません。")
    //     .setColor([255, 0, 0]);
    //   interaction.followUp({ embeds: [embed] });
    //   return;
    // }
    const emotion = (
      _emotion == "none" || _emotion == null ? undefined : _emotion
    ) as VTEmotion;
    const emotionLevel = (
      _emotionlevel == 0 || _emotionlevel == null
        ? undefined
        : "" + _emotionlevel
    ) as VTEmotionLevel;

    const data: VTOption = {
      speaker,
      pitch,
      speed,
      emotion,
      emotionLevel,
      volume: 100,
      format: VTFormat.WAV,
    };

    if (interaction.guildId && interaction.guild) {
      const speaker = client.speakers.get(interaction.guildId);
      if (speaker)
        speaker.addQueue(
          new SpeakData(
            "読み上げのテストです。こんにちは。こんばんは。さようなら",
            { channelId: speaker.textChannel.id, vtOption: data },
          ),
        );
    } else {
      interaction.followUp("読み上げが開始されていません。");
    }
    // this.setData(m.guild.id, member.id, data, false);
    // await storage(StorageType.SETTINGS).put(
    //   { value: data },
    //   `${interaction.guildId}:${interaction.user.id}`
    // );
    interaction.followUp({ embeds: [createVoiceEmbed(data, interaction)] });
  },
};
