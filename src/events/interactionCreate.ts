"use strict";
import { followUpError } from "@src/util";
import { Event } from "@src/types";
import { Interaction, InteractionType } from "discord.js";
export const event: Event = {
  name: "interactionCreate",
  async execute(client, interaction:Interaction) {
    const isDeveloping = false;
    if (interaction.type == InteractionType.ApplicationCommand || interaction.isContextMenuCommand()) {
      await interaction.deferReply().catch(() => {});
      const command = client.commands.get(interaction.commandName.toLowerCase());
      // console.log(!command);
      if (!command)
        return (
          (await interaction.followUp({
            content: "このコマンドは存在しません",
          })) && client.commands.delete(interaction.commandName.toLowerCase())
        );
      if (!interaction.guild && command.guildOnly) {
        return interaction.followUp({
          content: `このコマンドはギルドでのみ使用できます。`,
        });
      }
      if (
        isDeveloping &&
        interaction.user.id !== (await client.application?.fetch())?.owner?.id
      )
        return interaction.followUp({
          content: `現在開発中です。開発者のみコマンドを受け付けています。`,
          ephemeral: true,
        });
      try {
        command.execute(client, interaction);
      } catch (e) {
        followUpError(e, "", interaction);
      }
    }
  },
};
