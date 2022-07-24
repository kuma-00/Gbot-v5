import { SlashCommandBuilder } from "discord.js";
import { CommandCategory, Command } from "@src/types/command";

const wait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("終了します(Only Gbot Administrator)"),
  async execute(client, interaction) {
    if (process.env.MY_USER_ID == interaction.user.id) {
      client.speakers.forEach((speaker) => {
        speaker.textChannel.send("強制終了されました。");
        speaker.end();
      });
      interaction.followUp(`終了します。`);
      await wait(10000);
      process.exit(0);
    }
    return interaction.followUp(`権限が足りません。(Only Gbot Administrator)`);
  },
};
