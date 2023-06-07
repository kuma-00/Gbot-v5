import { Guild, GuildMember, TextBasedChannel, User } from "discord.js";
import { ExtensionClient } from "./index.ts";
import { MessageResponseJson } from "./witAi.ts";

export interface WitAiCommand {
  guildOnly: boolean;
  enabled: boolean;
  name: string;
  execute(client: ExtensionClient, data: WitAiCommandData): unknown;
}

export type WitAiCommandData = {
  guild?: Guild;
  member?: GuildMember;
  user: User;
  channel: TextBasedChannel;
  res: MessageResponseJson;
};
