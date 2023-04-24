import { SlashCommandBuilder } from "discord.js";
import { CommandCategory, Command } from "@src/types/command.js";
import { sleep } from "@src/util/index.js";

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
      await sleep(13000);
      process.exit(0);
    }
    return interaction.followUp(`権限が足りません。(Only Gbot Administrator)`);
  },
};
