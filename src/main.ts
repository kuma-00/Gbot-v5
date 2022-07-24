"use strict";
import { MessageResponse } from './types/index';
import { Client, Collection,GatewayIntentBits,Partials } from "discord.js";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { ExtensionClient } from "@src/types";
import { fileURLToPath } from "node:url";
import { createServer } from 'node:http';

import { generateDependencyReport } from "@discordjs/voice";
import { Command } from "@src/types/command";
console.log(generateDependencyReport());

console.log("起動準備開始");

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
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel],
}) as ExtensionClient;

client.commands = new Collection();
client.speakers = new Collection();
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

(async () => {
  // Event
  (await getJsFiles(path.join(__dirname, "events"))).forEach((path) => {
    loadFile(path, (event) => {
      event = event.event;
      if (event?.name) {
        client.on(event.name.trim(), (...args) =>
          event.execute(client, ...args)
        );
        console.log(`Event ${event.name} loaded !`);
      }
    });
  });
  // SlashCommand
  (await getJsFiles(path.join(__dirname, "commands"))).forEach((path) => {
    loadFile(path, (command) => {
      const com : Command = command.command;
      if (com?.data?.name) {
        client.commands.set(com.data.name.trim().toLowerCase(), com);
        console.log(`SlashCommand ${com.data.name} loaded !`);
      }
    });
  });
  // ContextMenu
  (await getJsFiles(path.join(__dirname, "contextMenus"))).forEach((path) => {
    loadFile(path, (contextMenu) => {
      const com : Command = contextMenu.command;
      if (com.data.name) {
        client.commands.set(com.data.name.trim().toLowerCase(), com);
        console.log(`ContextMenuCommand ${com.data.name} loaded !`);
      }
    });
  });
  //messageCreate
  (await getJsFiles(path.join(__dirname, "messageCreate"))).forEach((path) => {
    loadFile(path, (messageResponse) => {
      const mr : MessageResponse = messageResponse.messageResponse;
      if (mr.name) {
        client.messageResponses.push(mr);
        console.log(`MessageResponse ${mr.name} loaded !`);
      }
    });
  });
})();

client.login(process.env.DISCORD_TOKEN);

process.on("unhandledRejection", (reason) => {
  console.log("node:", reason);
});

client.on("error",console.log);//error
client.on("warn",console.log);//warn
client.on("debug",console.log);//debug

//sudo systemctl restart code-server@$USER


createServer(function(_req, res) {
  res.write("OK");
  res.end();
}).listen(8081);