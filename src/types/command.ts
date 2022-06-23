import {
  ContextMenuCommandBuilder,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction } from "discord.js";
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
    interaction: CommandInteraction | ContextMenuInteraction
  ): any;
}
