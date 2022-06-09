
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandCategory,Command } from "@src/types/command";

const wait = async (ms:number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const command:Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("end")
    .setDescription("終了します(Only Gbot Administrator)"),
  async execute(client, interaction) {
    if(process.env.MY_USER_ID == interaction.user.id){
      interaction.followUp(`終了します。`);
      await wait(3000);
      process.exit(29);
    }
    return interaction.followUp(`権限が足りません。(Only Gbot Administrator)`);
  },
};