import { generateDependencyReport } from "@discordjs/voice";
import { Command } from "@src/types/command.js";
import {
  ExtensionClient,
  MessageResponse,
  StorageType,
} from "@src/types/index.js";
import { WitAiCommand } from "@src/types/witAiCommand.js";
import Base from "deta/dist/types/base/index.js";
import { FetchOptions } from "deta/dist/types/types/base/request.js";
import { FetchResponse } from "deta/dist/types/types/base/response.js";
import { CompositeType } from "deta/dist/types/types/basic.js";
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  TextBasedChannel,
} from "discord.js";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MinigameConstructor } from "./types/minigame.js";
console.log(generateDependencyReport());

export type ExtensionBase = Base & {
  fetchAll(
    query?: CompositeType,
    options?: FetchOptions
  ): Promise<FetchResponse>;
};

console.log("起動準備開始 var:",process.env.npm_package_version);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
}) as ExtensionClient;

client.commands = new Collection();
client.speakers = new Collection();
client.recorder = new Collection();
client.minigames = new Collection();
client.gameData = new Collection();
client.timers = new Collection();
client.witAiCommands = new Collection();
client.messageResponses = [];

const getJsFiles = async (dirpath: string) => {
  const files: string[] = [];
  try {
    const dirents = await fs.readdir(dirpath, { withFileTypes: true });
    for (const dirent of dirents) {
      const fp = path.join(dirpath, dirent.name);
      if (dirent.isDirectory()) {
        files.push(...(await getJsFiles(fp)));
      } else {
        if (!fp.endsWith(".js") && !fp.endsWith(".ts")) return [];
        files.push(fp);
      }
    }
  } catch (e) {
    console.error(e);
  }
  return files;
};

const loadFile = async (path: string, fn: (data: any) => void) => {
  try {
    const file = await import(path);
    fn(file);
  } catch (error) {
    console.error(error);
  }
};

const comeback = async (storage: ExtensionBase, Speaker: any) => {
  const { items } = await storage.fetchAll({ "key?contains": "SpeakerStatus" });
  const guilds = items
    .filter((item) =>
      ["SPEAKING", "ERROR", "WAIT"].some((v) => v == item.value)
    )
    .map((item) => (item.key as string)?.replace(":SpeakerStatus", ""));
  const logs = [["comeback--------------------"]];
  // await client.guilds.fetch();
  await Promise.all(
    guilds.map(async (guildId) => {
      const guild = await client.guilds.fetch(guildId);
      if (!guild) return;
      logs.push([guild.id, ":", guild.name]);
      const tcId = (await storage.get(`${guildId}:cacheChannelId`))
        ?.value as string;
      if (!tcId) return console.log(`Can't get ${guildId}:cacheChannelId`);
      await guild.channels.fetch();
      const tc = await guild.channels.fetch(tcId);
      const vc = guild.voiceStates.cache.first()?.channel;
      if (!vc || !tc) return console.log(`Can't get ${vc} or ${tc}`);
      if(vc.members.size == 0) return console.log(`Can't members 0 vc`);
      const speaker = new Speaker(client, vc, tc as TextBasedChannel);
      client.speakers.set(guildId, speaker);
      speaker.start();
    })
  );
  logs.push(["----------------------------"]);
  logs.forEach((log) => console.log(...log));
};

(async () => {
  // Event
  (await getJsFiles(path.join(__dirname, "events"))).forEach((path) => {
    loadFile(path, (event) => {
      event = event.event;
      if (event?.name) {
        client.on(event.name.trim(), (...args) =>
          event.execute(client, ...args)
        );
        console.log(
          `Event              ${event.name.padEnd(20, " ")} loaded !`
        );
      }
    });
  });
  // SlashCommand
  (await getJsFiles(path.join(__dirname, "commands"))).forEach((path) => {
    loadFile(path, (command) => {
      const com: Command = command.command;
      if (com?.data?.name) {
        client.commands.set(com.data.name.trim().toLowerCase(), com);
        console.log(
          `SlashCommand       ${com.data.name.padEnd(20, " ")} loaded !`
        );
      }
    });
  });
  // ContextMenu
  (await getJsFiles(path.join(__dirname, "contextMenus"))).forEach((path) => {
    loadFile(path, (contextMenu) => {
      const com: Command = contextMenu.command;
      if (com.data.name) {
        client.commands.set(com.data.name.trim().toLowerCase(), com);
        console.log(
          `ContextMenuCommand ${com.data.name.padEnd(20, " ")} loaded !`
        );
      }
    });
  });
  //messageCreate
  (await getJsFiles(path.join(__dirname, "messageCreate"))).forEach((path) => {
    loadFile(path, (messageResponse) => {
      const mr: MessageResponse = messageResponse.messageResponse;
      if (mr.name) {
        client.messageResponses.push(mr);
        console.log(`MessageResponse    ${mr.name.padEnd(20, " ")} loaded !`);
      }
    });
  });
  //MiniGame
  (await getJsFiles(path.join(__dirname, "games"))).forEach((path) => {
    loadFile(path, (minigame) => {
      const mg: MinigameConstructor = minigame.minigame;
      if (mg) {
        client.minigames.set(mg.gameData.name, mg);
        console.log(
          `minigames          ${mg.gameData.name.padEnd(20, " ")} loaded !`
        );
      }
    });
  });
  //witAiCommands
  (await getJsFiles(path.join(__dirname, "witAiCommands"))).forEach((path) => {
    loadFile(path, (witAiCommand) => {
      const wac: WitAiCommand = witAiCommand.command;
      if (wac) {
        client.witAiCommands.set(wac.name, wac);
        console.log(`witAiCommands      ${wac.name.padEnd(20, " ")} loaded !`);
      }
    });
  });

  const { storage } = await import(path.join(__dirname, "core/storage.js"));
  const { Speaker } = await import(path.join(__dirname, "core/speaker.js"));
  const { loadTimer } = await import(path.join(__dirname, "core/timer.js"));
  loadTimer(client);
  await comeback(storage(StorageType.SETTINGS), Speaker);
})();

client.login(process.env.DISCORD_TOKEN);

process.on("unhandledRejection", (reason) => {
  console.log("node:", reason);
});

client.on("error", console.log); //error
client.on("warn", console.log); //warn
client.on("debug", console.log); //debug

// createServer(function (_req, res) {
//   res.write("OK");
//   res.end();
// }).listen(8081);

//git push origin master:master
