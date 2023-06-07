import { Command, CommandCategory } from "@src/types/command.ts";
import { sleep } from "@src/util/index.ts";
import { SlashCommandBuilder } from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("終了します(Only Gbot Administrator)"),
  async execute(client, interaction) {
    if ((await client.application?.fetch())?.owner?.id == interaction.user.id) {
      client.speakers.forEach((speaker) => {
        speaker.textChannel.send("終了されました。");
        speaker.end();
      });
      interaction.followUp(`終了します。`);
      client.destroy();
      await sleep(13000);
      Deno.exit();
    }
    return interaction.followUp(`権限が足りません。(Only Gbot Administrator)`);
  },
};
