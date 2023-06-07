import { Command, CommandCategory } from "@src/types/command.ts";
import { replaceText } from "@src/util/index.ts";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { VM } from "vm2";

export const command: Command = {
  category: CommandCategory.Other,
  guildOnly: false,
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("calculation")
    .setDescription("与えられた式を計算し、結果を返します。")
    .addStringOption((option) =>
      option
        .setName("formula")
        .setDescription("式(JavaScript方式)")
        .setRequired(true),
    ),
  async execute(_client, interaction: ChatInputCommandInteraction) {
    const vm = new VM({
      timeout: 1000,
      allowAsync: false,
      eval: false,
      wasm: false,
      sandbox: {
        Math,
        π: Math.PI,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
      },
    });
    const dic = {
      "^": "**",
      "3√": "Math.cbrt",
      "√": "Math.sqrt",
      "°": "*(Math.PI/180)",
    };
    const formula = replaceText(
      interaction.options.getString("formula", true),
      dic,
    );
    const formulaVm = async (val: string): Promise<string> => {
      try {
        return await vm.run(val);
      } catch (_error) {
        return "エラー";
      }
    };
    interaction.followUp(
      `\`式\` : ${formula}\n\`計算結果\` : ${await formulaVm(formula)}`,
    );
  },
};
