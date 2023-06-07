import { TranslateResponseJson } from "@src/types/index.ts";

export const translate = async (
  text: string,
  source: string | null,
  target: string,
) => {
  try {
    const url = Deno.env.get("google_translate_api") ?? "";
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
    return (await res.json()) as TranslateResponseJson;
  } catch (e) {
    console.log(e);
    return { text: "エラー" };
  }
};
