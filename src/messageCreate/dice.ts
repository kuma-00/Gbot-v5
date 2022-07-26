import { speak } from "./../util/index";
("use strict");
import { MessageResponse } from "@src/types";

export const messageResponse: MessageResponse = {
  name: "dice",
  filter: (m) =>
    /^([1-9][0-9]{0,1}|100)[dD]([1-9][0-9]{0,4})$/.test(m.cleanContent),
  async execute(client, message) {
    const res = message.cleanContent.match(
      /^([1-9][0-9]{0,1}|100)[dD]([1-9][0-9]{0,4})$/
    );
    if (!res)
      return message.reply({
        content: `エラー`,
        allowedMentions: { repliedUser: false },
      });
    const dices = new Array(+res[1])
      .fill(0)
      .map(() => Math.floor(Math.random() * +res[2]) + 1);
    message.reply({
      content:
        `Dice :${dices.join(" ")}` +
        (+res[1] > 1
          ? `\nSUM : ${dices.reduce((s, dice) => s + dice, 0)}`
          : ""),
      allowedMentions: { repliedUser: false },
    });
    if (message.guild)
      speak(
        client,
        message.guild,
        `Dice :${dices.join(" ")}` +
          (+res[1] > 1
            ? `\nSUM : ${dices.reduce((s, dice) => s + dice, 0)}`
            : "")
      );
  },
};
