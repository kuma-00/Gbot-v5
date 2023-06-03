import { generateDependencyReport } from "@discordjs/voice";
import { Command } from "@src/types/command.js";
import { Event, ExtensionClient, MessageResponse } from "@src/types/index.js";
import { WitAiCommand } from "@src/types/witAiCommand.js";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import fs from "node:fs/promises";
import path from "node:path";
// import { fileURLToPath } from "node:url";
import { MinigameConstructor } from "./types/minigame.js";
console.log(generateDependencyReport());

console.log("起動準備開始 var:", process.env.npm_package_version);

// const __filename = Bun.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(import("src/events/ready"))
// console.log(import("src/commands/speaker/voiceset"))
// console.log(import("src/commands/speaker/addchannel"))
// console.log(import("src/commands/speaker/addword"))
// console.log(import("src/commands/speaker/channellist"))
// console.log(import("src/commands/speaker/clear"))
// console.log(import("src/commands/speaker/voiceget"))
// console.log(import("src/commands/speaker/end"))
// console.log(import("src/commands/speaker/removechannel"))
// console.log(import("src/commands/speaker/removeword"))
// console.log(import("src/commands/speaker/skip"))
// console.log(import("src/commands/speaker/start"))
// console.log(import("src/commands/speaker/voiceget"))
// console.log(import("src/commands/speaker/voiceget"))
// console.log(import("src/commands/speaker/voicetest"))
// console.log(import("src/commands/speaker/wordlist"))
// console.log(import("src/commands/util/help"))
// console.log(import("src/commands/util/ping"))
// console.log(import("src/commands/util/shutdown"))
// console.log(import("src/commands/other/calculation"))
// console.log(import("src/commands/other/conversation"))
// console.log(import("src/commands/other/google_search"))
// console.log(import("src/commands/other/minigame"))
// console.log(await import("src/commands/other/rate"))
// console.log(import("src/commands/other/translate"))
// console.log(import("src/commands/other/wiki"))

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadFile = async (path: string, fn: (data: any) => void) => {
  try {
    const file = await import(path);
    fn(file);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  // Event
  await Promise.all(
    (await getJsFiles(path.join(import.meta.dir, "events"))).map(
      async (path) => {
        return loadFile(path, (event) => {
          const e = event.event as Event;
          if (e?.name) {
            if (e.once) {
              client.once(e.name.trim(), (...args) =>
                e.execute(client, ...args),
              );
            } else {
              client.on(e.name.trim(), (...args) => e.execute(client, ...args));
            }
            console.log(
              `Event              ${e.name.padEnd(20, " ")} loaded !`,
            );
          }
        });
      },
    ),
  );
  // SlashCommand
  await Promise.all((await getJsFiles(path.join(import.meta.dir, "commands"))).map((path) => {
    return loadFile(path, (command) => {
      const com: Command = command.command;
      if (com?.data?.name) {
        client.commands.set(com.data.name.trim().toLowerCase(), com);
        console.log(
          `SlashCommand       ${com.data.name.padEnd(20, " ")} loaded !`,
        );
      }
    });
  }));
  // ContextMenu
  await Promise.all((await getJsFiles(path.join(import.meta.dir, "contextMenus"))).map(
    (path) => {
      return loadFile(path, (contextMenu) => {
        const com: Command = contextMenu.command;
        if (com.data.name) {
          client.commands.set(com.data.name.trim().toLowerCase(), com);
          console.log(
            `ContextMenuCommand ${com.data.name.padEnd(20, " ")} loaded !`,
          );
        }
      });
    },
  ));
  //messageCreate
  await Promise.all((await getJsFiles(path.join(import.meta.dir, "messageCreate"))).map(
    (path) => {
      return loadFile(path, (messageResponse) => {
        const mr: MessageResponse = messageResponse.messageResponse;
        if (mr.name) {
          client.messageResponses.push(mr);
          console.log(`MessageResponse    ${mr.name.padEnd(20, " ")} loaded !`);
        }
      });
    },
  ));
  //MiniGame
  await Promise.all((await getJsFiles(path.join(import.meta.dir, "games"))).map((path) => {
    return loadFile(path, (minigame) => {
      const mg: MinigameConstructor = minigame.minigame;
      if (mg) {
        client.minigames.set(mg.gameData.name, mg);
        console.log(
          `minigames          ${mg.gameData.name.padEnd(20, " ")} loaded !`,
        );
      }
    });
  }));
  //witAiCommands
  await Promise.all((await getJsFiles(path.join(import.meta.dir, "witAiCommands"))).map(
    (path) => {
      return loadFile(path, (witAiCommand) => {
        const wac: WitAiCommand = witAiCommand.command;
        if (wac) {
          client.witAiCommands.set(wac.name, wac);
          console.log(
            `witAiCommands      ${wac.name.padEnd(20, " ")} loaded !`,
          );
        }
      });
    },
  ));
  console.log("Command Loading Complete!");
  console.log(client.commands.size)
  console.log(client.minigames.size)
  console.log(client.witAiCommands.size)
  console.log(client.messageResponses.length)
  client.login();
})();

process.on("unhandledRejection", (reason) => {
  console.log("node:", reason);
});

client.on("error", console.log); //error
client.on("warn", console.log); //warn
client.on("debug", console.log); //debug
client.on(Events.ShardError, (error) =>
  console.error("A websocket connection encountered an error:", error),
);

// createServer(function (_req, res) {
//   res.write("OK");
//   res.end();
// }).listen(8081);
