import { ExtensionClient } from "@src/types/index.ts";
import { VTOption } from "@src/types/VT.ts";
import {
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  Message,
  MessageReplyOptions,
  User,
} from "discord.js";

export const followUpError = (
  error: Error,
  text: string,
  interaction: CommandInteraction,
) => {
  console.log(error, error?.message);
  const embed = new EmbedBuilder();
  embed
    .setAuthor({ name: "Error" })
    .setTitle("エラーが発生しました。")
    .setDescription(
      `${error}
${error?.message}
${text}`,
    )
    .setTimestamp(Date.now())
    .setColor([255, 0, 0]);
  interaction.followUp({ embeds: [embed] });
};

export const getUser = (
  interaction: CommandInteraction,
): GuildMember | User => {
  return (interaction.member as GuildMember) || interaction.user;
};

export const getUsername = (
  interaction: CommandInteraction | GuildMember | User,
) => {
  const memberOrUser =
    interaction instanceof CommandInteraction
      ? getUser(interaction)
      : interaction;
  if (memberOrUser instanceof User) {
    return memberOrUser.username;
  } else {
    return memberOrUser.displayName;
  }
};

export class SpeakData {
  text: string;
  userName = "";
  channelId = "";
  userId = "";
  vtOption?: VTOption;
  constructor(
    text: string,
    option?: {
      channelId?: string;
      userName?: string;
      userId?: string;
      vtOption?: VTOption;
    },
  ) {
    this.text = text;
    if (option) {
      this.channelId = option.channelId ?? "";
      this.userName = option.userName ?? "";
      this.userId = option.userId ?? "";
      this.vtOption = option.vtOption ?? undefined;
    }
  }

  addUserName() {
    this.text = `${this.userName}。 ${this.text}`;
  }

  inheritance(speakData: SpeakData) {
    this.channelId = speakData.channelId;
    this.userName = speakData.userName;
    this.userId = speakData.userId;
    this.vtOption = speakData.vtOption;
    return this;
  }
}

export const sleep = (microSecond: number) =>
  new Promise((resolve) => setTimeout(resolve, microSecond));

export const replaceText = (
  text: string,
  dic: { [key: string]: string },
  flags = "gi",
) => {
  const regExp = new RegExp(
    `(${Object.keys(dic)
      .map((i) => i.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&"))
      .join("|")})`,
    flags,
  );
  return text.replace(regExp, (e) => dic[e]);
};

export const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const randomId = () =>
  Math.random().toString(32).substring(2).padStart(11, "0");

export const speak = async (
  //SpeakerClassのstaticに移動
  client: ExtensionClient,
  guild: Guild,
  text: string,
  textChannelId?: string,
) => {
  await sleep(500);
  const speaker = client.speakers.get(guild.id);
  if (!speaker) return;
  if (
    textChannelId === undefined ||
    (textChannelId && (await speaker.isReadingChannel(textChannelId)))
  )
    speaker.addQueue(text);
};

export const random = (min: number, max: number) =>
  Math.round(Math.random() * (max - min)) + min;

export const reply = (
  message: Message,
  options: string | MessageReplyOptions,
) => {
  if (!(options instanceof Object)) options = { content: options };
  return message.reply({ ...options, allowedMentions: { repliedUser: false } });
};

export const isNullOrWhitespace = (input?: string) => !input || !input.trim();
