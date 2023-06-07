import { storage } from "@src/core/storage.ts";
import { VTOption } from "@src/types/VT.ts";
import { Command, CommandCategory } from "@src/types/command.ts";
import { StorageType } from "@src/types/index.ts";
import { SlashCommandBuilder } from "discord.js";
import { createVoiceEmbed } from "./voiceset.ts";

export const command: Command = {
  category: CommandCategory.Speaker,
  guildOnly: true,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("voiceget")
    .setDescription("読み上げの声の設定を表示します"),
  async execute(client, interaction) {
    interaction.followUp({
      embeds: [
        createVoiceEmbed(
          (
            await storage(StorageType.SETTINGS).get(
              `${interaction.guildId}:${interaction.user.id}`,
            )
          )?.value as VTOption,
          interaction,
        ),
      ],
    });
  },
};
