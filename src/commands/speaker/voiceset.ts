import { storage } from "@src/core/storage.ts";
import { VTEmotion, VTEmotionLevel, VTSpeaker } from "@src/types/VT.ts";
import { Command, CommandCategory } from "@src/types/command.ts";
import { StorageType } from "@src/types/index.ts";
import { getUsername } from "@src/util/index.ts";
import {
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("voiceset")
    .setDescription("読み上げの声を設定します。")
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
  async execute(_client, interaction: ChatInputCommandInteraction) {
    const speaker = interaction.options.getString("speaker", true) as VTSpeaker;
    const pitch = interaction.options.getInteger("pitch", true);
    const speed = interaction.options.getInteger("speed", true);
    const _emotion = interaction.options.getString("emotion", true);
    const _emotionlevel = interaction.options.getInteger("emotionlevel", true);
    const emotion = (
      _emotion == "none" || _emotion == null ? undefined : _emotion
    ) as VTEmotion;
    const emotionLevel = (
      _emotionlevel == 0 || _emotionlevel == null
        ? undefined
        : "" + _emotionlevel
    ) as VTEmotionLevel;

    const data = {
      speaker,
      pitch,
      speed,
      emotion,
      emotionLevel,
    };
    // this.setData(m.guild.id, member.id, data, false);
    await storage(StorageType.SETTINGS).put(
      { value: data },
      `${interaction.guildId}:${interaction.user.id}`,
    );
    interaction.followUp({ embeds: [createVoiceEmbed(data, interaction)] });
  },
};

export const createVoiceEmbed = (
  data: {
    speaker: VTSpeaker;
    pitch: number | null;
    speed: number | null;
    emotion: VTEmotion;
    emotionLevel: VTEmotionLevel;
  },
  interaction: CommandInteraction,
) =>
  new EmbedBuilder().setTitle("声の設定").addFields(
    { name: "user", value: getUsername(interaction), inline: true },
    { name: "speaker", value: data.speaker, inline: true },
    { name: "pitch", value: "" + data.pitch, inline: true },
    { name: "speed", value: "" + data.speed, inline: true },
    {
      name: "emotion",
      value: "" + (data.emotion === undefined ? "none" : data.emotion),
      inline: true,
    },
    {
      name: "emotionLevel",
      value: "" + (data.emotionLevel === undefined ? "0" : data.emotionLevel),
      inline: true,
    },
  );
