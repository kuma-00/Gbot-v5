import { followUpError } from "@src/util/index.js";
import { Event } from "@src/types/index.js";
import { Interaction, InteractionType } from "discord.js";
export const event: Event = {
  name: "interactionCreate",
  once: false,
  async execute(client, interaction:Interaction) {
    const isDeveloping = false;
    if (interaction.type == InteractionType.ApplicationCommand || interaction.isContextMenuCommand()) {
      await interaction.deferReply().catch(console.error);
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
        followUpError(e as Error, "", interaction);
      }
    } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete){
      const command = client.commands.get(interaction.commandName.toLowerCase());
      if(!command)interaction.respond([{value:"none",name:"none"}])
      if(command?.autocomplete){
        try{
          command.autocomplete(client,interaction);
        }catch (e) {
          console.log("Autocomplete Error \n",e);
        }
      }
    }// else if(interaction.isMessageComponent()){
    //   if(["gb_game","gbot_ox","gb_take","gb_ww"].some(id=>id.indexOf(interaction.customId)==0))interaction.update({components:[]})
    // }
  },
};
