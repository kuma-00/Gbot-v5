import { GuildMember, TextChannel } from "discord.js";

export type MinigameData = {
  gameConstructor :MinigameConstructor;
  game: Minigame;
  id: string;
  members: GuildMember[];
  rules: GameRuleValue;
  channel: TextChannel;
  close: Function;
  isEnd: boolean;
  isStart: boolean;
};

export interface MinigameConstructor {
  new (data: MinigameData): Minigame;
  data: {
    name: string;
    description: string;
    details: string;
    ruleText?: string;
    maxMember: number;
    minMember: number;
    joinInMidway: boolean;
    ruleData?: GameRule[];
  };
};

export interface Minigame {
  data: MinigameData;
  start(): void;
  end(): void;
}

export type GameRule = {
  id: string;
  options: GameRuleOptions[];
  defaultRule: GameRuleValue;
};
export type GameRuleValue = Record<string, string[]>;
export type GameRuleOptions = {
  description?: string;
  default?:boolean;
  label: string;
  value: string;
};
