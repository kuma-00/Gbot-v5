"use strict";
import { MessageResponse } from "@src/types";
import { storage } from "@src/core/storage";
import { StorageType } from "@src/types";

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
    (m.cleanContent &&
      m.attachments.size == 1 &&
      m.attachments.first()?.contentType?.includes("image") &&
      !m.author.bot) ||
    /^(\S)テロ(?!ッ)/.test(m.cleanContent) ||
    /飯テロ(?!ッ)/.test(m.cleanContent),
  async execute(client, message) {
    if (/飯テロ(?!ッ)/.test(message.cleanContent)) {
      message.reply({
        content: "飯テロが検出されました",
        allowedMentions: { repliedUser: false },
      });
      
    } else if (/^(\S)テロ(?!ッ)/.test(message.cleanContent)) {
      message.reply({
        content: `${
          message.cleanContent.match(/^(\S)テロ(?!ッ)/)?.[1]
        }テロが検出されました。`,
        allowedMentions: { repliedUser: false },
      });

    } else if (message.attachments.size == 1) {
      const count = +(
        (await storage(StorageType.SETTINGS).get("vision_count"))?.value ?? 0
      );
      console.log(count);
      const url = message.attachments.first()?.url;
      if (count > 900 || !url) return;
      const result = await classify(new URL(url));
      if (result?.responses[0].labelAnnotations[0].description == "Food")
        message.reply({
          content: "飯テロが検出されました",
          allowedMentions: { repliedUser: false },
        });
      storage(StorageType.SETTINGS).put(1 + count, "vision_count");
    }
  },
};
