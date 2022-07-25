import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import { Command, CommandCategory } from "@src/types/command";

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("conversation")
    .setDescription("そのチャンネルで、会話を開始します。"),
  execute(client, interaction: ChatInputCommandInteraction) {
    interaction.followUp("何か話しかけてみて!(**終了**で停止)");
    const filter = (m: Message) =>
      !!m.content && m.author.id != client.user?.id;
    const collector = interaction.channel?.createMessageCollector({ filter });
    collector?.on("collect", async (m) => {
      // if(m.author.id == this.client.user.id) return;
      if (
        [
          "end",
          "終了",
          "さよなら",
          "さようなら",
          "じゃあ",
          "じゃあね",
          "おつ",
          "乙",
        ].some((i) => i == m.content)
      ) {
        collector.stop();
        console.log("end noby");
        m.channel.send("さよなら (終了)");
        return;
      }
      m.channel.sendTyping();
      const ret = await noby(m.content);
      if (ret) m.channel.send(ret);
      //console.log(`Collected ${m.content}`)
    });
    // collector?.on('end', collected => console.log(`Collected ${collected.size} items`));
  },
};

const noby = async (text: string) => {
  const params: Record<string, string> = {
    appkey: process.env.NOBY_KEY ?? "",
    text,
    persona: "3",
  };
  const url = "https://app.cotogoto.ai/webapi/noby.json";
  const query_params = new URLSearchParams(params);
  try {
    const res = await (await fetch(`${url}?${query_params}`)).json();
    return res.text;
  } catch {
    return "エラー";
  }
};
