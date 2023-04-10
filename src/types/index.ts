import { Recorder } from "@src/core/recorder.js";
import { Speaker } from "@src/core/speaker.js";
import { Command } from "@src/types/command.js";
import { MinigameConstructor, MinigameData } from "@src/types/minigame.js";
import { WitAiCommand } from "@src/types/witAiCommand.js";
import { Client, Collection, Message } from "discord.js";
import { Timer } from "./timer";

export type ExtensionClient = Client & {
  commands: Collection<string, Command>;
  witAiCommands: Collection<string, WitAiCommand>;
  speakers: Collection<string, Speaker>;
  recorder: Collection<string, Recorder>;
  minigames: Collection<string, MinigameConstructor>;
  gameData: Collection<string, MinigameData>;
  timers: Collection<string, Timer>;
  messageResponses: MessageResponse[];
};

export interface Event {
  name: string;
  execute(client: ExtensionClient, ...arg: any): any;
}

export const StorageType = {
  SETTINGS: "settings",
  WORDS: "word_dic",
} as const;
// eslint-disable-next-line no-redeclare
export type StorageType = typeof StorageType[keyof typeof StorageType];

export type SpeakResource = URL | ReadableStream<Uint8Array>;

export type CustomSearchJson = {
  kind: string;
  url: { type: string; template: string };
  queries: {
    request: CustomSearchPage[];
    nextPage: CustomSearchPage[];
  };
  context: { title: string };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items: CustomSearchItem[];
};

export type CustomSearchPage = {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
};

export type CustomSearchItem = {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap: CustomSearchPagemap[];
};

export type CustomSearchPagemap = {
  cse_thumbnail?: { [key: string]: string };
  metatags?: { [key: string]: string };
  cse_image?: { [key: string]: string };
};

export type TranslateResponseJson = {
  params?: {
    text: string;
    source: string;
    target: string;
  };
  code?: number;
  text: string;
};

export type MessageResponse = {
  name: string;
  filter(message: Message): Boolean;
  execute(client: ExtensionClient, message: Message): any;
};
