import {
  AutocompleteInteraction,
  ContextMenuCommandBuilder,
  InteractionCollector,
  MappedInteractionTypes,
  MessageComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { CommandInteraction, ContextMenuCommandInteraction } from "discord.js";
import { ExtensionClient } from "@src/types/index.js";

export const CommandCategory = {
  Util: "util",
  Speaker: "speaker",
  Other: "other",
} as const;
// eslint-disable-next-line no-redeclare
export type CommandCategory =
  (typeof CommandCategory)[keyof typeof CommandCategory];

export interface Command {
  collector?: InteractionCollector<
    MappedInteractionTypes[MessageComponentType]
  >;
  category: CommandCategory;
  guildOnly: boolean;
  enabled: boolean;
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | ContextMenuCommandBuilder;
  description?: string;
  execute(
    client: ExtensionClient,
    interaction: CommandInteraction | ContextMenuCommandInteraction,
  ): unknown;
  autocomplete?(
    client: ExtensionClient,
    interaction: AutocompleteInteraction,
  ): unknown;
}
