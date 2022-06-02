import { translateResponseJson } from "@src/types";
import fetch from "node-fetch";

export const translate = async (
  text: string,
  source: string | null,
  target: string
) => {
  try {
    const url = process.env.google_translate_api ?? "";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        source,
        target,
      }),
    });
    return (await res.json()) as translateResponseJson;
  } catch (e) {
    console.log(e);
    return {text:"エラー"};
  }
};
