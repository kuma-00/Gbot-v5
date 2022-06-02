import { Speaker } from "@src/core/speaker";
import { Client, Collection } from "discord.js";
import internal from "node:stream";
import { Command } from "@src/types/command";

export type ExtensionClient = Client & {
  commands: Collection<string, Command>;
  speakers: Collection<string, Speaker>;
};

export interface Event {
  name: string;
  execute(client: ExtensionClient, arg?: any): any;
}

export const StorageType = {
  SETTINGS: "settings",
  WORDS: "word_dic",
} as const;
// eslint-disable-next-line no-redeclare
export type StorageType = typeof StorageType[keyof typeof StorageType];

export type SpeakResource = URL | internal.Readable;

export type customSearchJson = {
  kind: string;
  url: { type: string; template: string };
  queries: {
    request: customSearchPage[];
    nextPage: customSearchPage[];
  };
  context: { title: string };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items:customSearchItem[]
};

export type customSearchPage = {
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

export type customSearchItem = {
  kind:string
  title:string
  htmlTitle:string
  link:string
  displayLink:string
  snippet:string
  htmlSnippet:string
  cacheId:string
  formattedUrl:string
  htmlFormattedUrl:string
  pagemap:customSearchPagemap[]
}

export type customSearchPagemap = {
  cse_thumbnail?:{[key:string]:string}
  metatags?:{[key:string]:string}
  cse_image?:{[key:string]:string}
}

export type translateResponseJson = {
  params?:{
    text:string
    source:string
    target:string
  }
  code?:number
  text:string
}