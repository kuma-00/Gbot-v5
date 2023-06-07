import { secondToString, setTimer } from "@src/core/timer.ts";
import { WitAiCommand } from "@src/types/witAiCommand.ts";
import { speak } from "@src/util/index.ts";

export const command: WitAiCommand = {
  guildOnly: false,
  enabled: true,
  name: "timer_set",
  execute(client, data) {
    const second =
      data.res.entities["wit$duration:duration"]?.[0].normalized?.value ?? 0;
    if (second == 0) return data.channel.send(`時間の取得に失敗しました。`);
    setTimer(client, data.channel.id, data.user.id, second);
    console.log(data.res.entities["wit$duration:duration"]?.[0], second);
    data.channel.send(`${secondToString(second)}タイマーが設定されました。`);
    if (data.guild)
      speak(
        client,
        data.guild,
        `${secondToString(second)}タイマーが設定されました。`,
        data.channel.id,
      );
  },
};
