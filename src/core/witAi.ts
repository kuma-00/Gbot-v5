import { ExtensionClient } from "@src/types/index.ts";
import { MessageError, MessageResponseJson } from "@src/types/witAi.ts";
import { isNullOrWhitespace } from "@src/util/index.ts";
import { EmbedBuilder } from "discord.js";
import { WitAiCommandData } from "@src/types/witAiCommand.ts";

const baseUrl = "https://api.wit.ai";
const apiVersion = "20221114";

export const message = async (message: string) => {
  const url = new URL(`${baseUrl}/message`);
  url.searchParams.append("v", apiVersion);
  url.searchParams.append("q", message);
  console.log(url.toString());
  return (await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: "Bearer " + Deno.env.get("WIT_AI_TOKEN"),
    },
  }).then((r) => r.json())) as MessageResponseJson | MessageError;
};

export const executeCommand = (
  client: ExtensionClient,
  data: WitAiCommandData,
) => {
  const name = data.res.intents?.[0].name ?? "";
  console.log(data.res);
  if ((data.res.intents?.[0].confidence ?? 0) < 0.8 || isNullOrWhitespace(name))
    return;
  const command = client.witAiCommands.get(name);
  if (command) {
    if (!data.guild && command.guildOnly) {
      return data.channel.send("このコマンドはギルドでのみ使用できます。");
    }
    try {
      command.execute(client, data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error, error?.message);
        const embed = new EmbedBuilder();
        embed
          .setAuthor({ name: "Error" })
          .setTitle("エラーが発生しました。")
          .setDescription(`${error}\n${error?.message}`)
          .setTimestamp(Date.now())
          .setColor([255, 0, 0]);
        data.channel.send({ embeds: [embed] });
      }
    }
  } else {
    data.channel.send(
      "コマンドが認識できませんでした。表現を変更するか、無効なコマンドの可能性があります。",
    );
  }
};
