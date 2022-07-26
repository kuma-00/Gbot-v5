"use strict";
import { ExtensionClient, MessageResponse } from "@src/types";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";
import { speak } from "@src/util";
import { Message } from "discord.js";

const classify = async (imageURL: URL) => {
  const image = await (await fetch(imageURL.toString())).arrayBuffer();
  const imageData = Buffer.from(image).toString("base64");
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`;
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: imageData,
          },
          features: [{ type: "LABEL_DETECTION", maxResults: 1 }],
        },
      ],
    }),
  };
  const result = await (await fetch(url, options)).json();
  return result;
};

export const messageResponse: MessageResponse = {
  name: "tero",
  filter: (m) =>
    ((m.cleanContent &&
      m.attachments.size == 1 &&
      m.attachments.first()?.contentType?.includes("image")) ||
    /^(\S)テロ(?!ッ)/.test(m.cleanContent) ||
    /飯テロ(?!ッ)/.test(m.cleanContent)) && !m.author.bot,
  async execute(client, message) {
    if (/飯テロ(?!ッ)/.test(message.cleanContent)) {
      tero(client,message);
    } else if (/^(\S)テロ(?!ッ)/.test(message.cleanContent)) {
      tero(client,message);
    } else if (message.attachments.size == 1) {
      const count = +(
        (await storage(StorageType.SETTINGS).get("vision_count"))?.value ?? 0
      );
      console.log(count);
      const url = message.attachments.first()?.url;
      if (count > 900 || !url) return;
      const result = await classify(new URL(url));
      if (result?.responses[0].labelAnnotations[0].description == "Food")tero(client,message);
      storage(StorageType.SETTINGS).put(1 + count, "vision_count");
    }
  },
};

const tero = (client:ExtensionClient,message:Message) =>{
  message.reply({
    content: "飯テロが検出されました",
    allowedMentions: { repliedUser: false },
  });
  if (message.guild)
      speak(
        client,
        message.guild,
        "飯テロが検出されました"
      );
}