import { reply, speak } from "@src/util/index.ts";
import { MessageResponse } from "@src/types/index.ts";

export const messageResponse: MessageResponse = {
  name: "dice",
  filter: (m) =>
    /^([1-9][0-9]{0,1}|100)[dD]([1-9][0-9]{0,4})$/.test(m.cleanContent),
  execute(client, message) {
    const res = message.cleanContent.match(
      /^([1-9][0-9]{0,1}|100)[dD]([1-9][0-9]{0,4})$/
    );
    if (!res) return reply(message, `エラー`);
    const dices = new Array(+res[1])
      .fill(0)
      .map(() => Math.floor(Math.random() * +res[2]) + 1);
    reply(
      message,
      `Dice :${dices.join(" ")}` +
        (+res[1] > 1 ? `\nSUM : ${dices.reduce((s, dice) => s + dice, 0)}` : "")
    );
    if (message.guild)
      speak(
        client,
        message.guild,
        `出た目はそれぞれ${dices.join(" ")}です` +
          (+res[1] > 1
            ? `\n合計は${dices.reduce((s, dice) => s + dice, 0)}です`
            : ""),
        message.channelId
      );
  },
};
