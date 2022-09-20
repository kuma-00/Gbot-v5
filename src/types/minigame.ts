import { GuildMember, Message, TextChannel } from "discord.js";
import { ExtensionClient } from ".";

export type MinigameData = {
  gameConstructor: MinigameConstructor;
  game?: Minigame;
  id: string;
  members: GuildMember[];
  rules?: GameRuleValue;
  channel: TextChannel;
  isEnd: boolean;
  isStart: boolean;
  message?: Message;
};

export interface MinigameConstructor {
  new (client:ExtensionClient,data: MinigameData): Minigame;
  gameData: {
    name: string;
    description: string;
    details: string;
    ruleText?: string;
    maxMember: number;
    minMember: number;
    joinInMidway: boolean;
    ruleData?: GameRule[];
    defaultRule?: GameRuleValue;
  };
}

export interface Minigame {
  data: MinigameData;
  client:ExtensionClient;
  start(): void;
  end(): void;
}

export type GameRule = {
  id: string;
  options: GameRuleOptions[];
};
export type GameRuleValue = Record<string, string[]>;
export type GameRuleOptions = {
  description?: string;
  default?: boolean;
  label: string;
  value: string;
};
