import { Command, CommandCategory } from "@src/types/command";
import { ApplicationCommandType } from "discord-api-types/v9";
import {
  ContextMenuCommandInteraction,
  Message,
  ContextMenuCommandBuilder,
} from "discord.js";

export const command: Command = {
  category: CommandCategory.Util,
  guildOnly: false,
  enabled: true,
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message as number)
    .setName("ojosama"),
  async execute(client, interaction: ContextMenuCommandInteraction) {
    const msg = interaction.options.getMessage("message", true) as Message;
    interaction.channel?.sendTyping();
    // const text = shuffle(tokenize(msg.cleanContent)).join("")
    const text = (await(await fetch("https://ojosama.herokuapp.com/api/ojosama", {
      method: "POST",
      body: JSON.stringify({Text:msg}),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })).json()).Result as string;
    await interaction.followUp(`\`\`\`${text}\`\`\``);
    if (interaction.guildId && interaction.guild) {
      const speaker = client.speakers.get(interaction.guildId);
      if (speaker) speaker.addQueue(text);
    }
  },
};
