import { ExtensionClient } from "@src/types";
import { VTOption } from "@src/types/VT";
import {
  CommandInteraction,
  GuildMember,
  EmbedBuilder,
  Snowflake,
  User,
  Guild,
} from "discord.js";

export const followUpError = (
  error: any,
  text: string,
  interaction: CommandInteraction
) => {
  console.log(error, error?.message);
  const disme = new EmbedBuilder();
  disme
    .setAuthor({ name: "Error" })
    .setTitle("エラーが発生しました。")
    .setDescription(
      `${error}
${error?.message}
${text}`
    )
    .setTimestamp(Date.now())
    .setColor([255, 0, 0]);
  interaction.followUp({ embeds: [disme] });
};

export const getUser = (
  interaction: CommandInteraction
): GuildMember | User => {
  return (interaction.member as GuildMember) || interaction.user;
};

export const getUsername = (
  interaction: CommandInteraction | GuildMember | User
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
  userName: string = "";
  channelId: Snowflake = "";
  userId: Snowflake = "";
  vtOption?: VTOption;
  constructor(
    text: string,
    option?: {
      channelId?: Snowflake;
      userName?: string;
      userId?: Snowflake;
      vtOption?: VTOption;
    }
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

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const replaceText = (
  text: string,
  dic: { [key: string]: string },
  flags: string = "gi"
) => {
  const regExp = new RegExp(
    `(${Object.keys(dic)
      .map((i) => i.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&"))
      .join("|")})`,
    flags
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
  client: ExtensionClient,
  guild: Guild,
  text: string
) => {
  await sleep(500);
  client.speakers.get(guild.id)?.addQueue(text);
};
