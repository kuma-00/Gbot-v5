import { SlashCommandBuilder } from "discord.js";
import { Command, CommandCategory } from "@src/types/command";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";
import { VTOption } from "@src/types/VT";
import { createVoiceEmbed } from "./voiceset";

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
              `${interaction.guildId}:${interaction.user.id}`
            )
          )?.value as VTOption,
          interaction
        ),
      ],
    });
  },
};
