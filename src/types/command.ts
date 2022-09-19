import {
  AutocompleteInteraction,
  ButtonInteraction,
  CacheType,
  ContextMenuCommandBuilder,
  InteractionCollector,
  SelectMenuInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { CommandInteraction, ContextMenuCommandInteraction } from "discord.js";
import { ExtensionClient } from "@src/types";

export const CommandCategory = {
  Util: "util",
  Speaker: "speaker",
  Other: "other",
} as const;
// eslint-disable-next-line no-redeclare
export type CommandCategory =
  typeof CommandCategory[keyof typeof CommandCategory];

export interface Command {
  collector?: InteractionCollector<ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>>;
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
    interaction: CommandInteraction | ContextMenuCommandInteraction
  ): any;
  autocomplete?(
    client: ExtensionClient,
    interaction: AutocompleteInteraction
  ): any;
}
