import {
  BaseCommandInteraction,
  GuildMember,
  MessageEmbed,
  Snowflake,
  User,
} from "discord.js";

export const followUpError = (
  error: any,
  text: string,
  interaction: BaseCommandInteraction
) => {
  console.log(error, error?.message);
  const disme = new MessageEmbed();
  disme
    .setAuthor("Error")
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
  interaction: BaseCommandInteraction
): GuildMember | User => {
  return (interaction.member as GuildMember) || interaction.user;
};

export const getUsername = (
  interaction: BaseCommandInteraction | GuildMember | User
) => {
  const memberOrUser =
    interaction instanceof BaseCommandInteraction
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
  constructor(
    text: string,
    option?: {
      channelId?: Snowflake;
      userName?: string;
      userId?: Snowflake;
    }
  ) {
    this.text = text;
    if (option) {
      this.channelId = option.channelId ?? "";
      this.userName = option.userName ?? "";
      this.userId = option.userId ?? "";
    }
  }

  addUserName() {
    this.text = `${this.userName}。 ${this.text}`;
  }

  inheritance(speakData: SpeakData) {
    this.channelId = speakData.channelId;
    this.userName = speakData.userName;
    this.userId = speakData.userId;
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
