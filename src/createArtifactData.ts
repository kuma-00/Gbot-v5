import { APIEmbed, EmbedBuilder } from "discord.js";
import { Artifact } from "./core/artifact";
import { OCRResponse } from "./types/OCR";
// import {
//   Artifact as hoyoArtifact,
//   Entry,
//   Language,
//   setLanguage,
// } from "@gonetone/hoyowiki-api";
// import { writeFile } from "fs/promises";

// console.log("起動準備開始");

// (async () => {
//   await setLanguage(Language.Japanese);
//   const artifact = new hoyoArtifact();
//   const res = await artifact.getList();
//   console.log(res);
//   console.log(res[0].filter_values);
//   const entry = new Entry();
//   const result = await entry.get(2099);
//   console.log(
//     result,
//     result.modules.find(({ name }) => name == "セット")
//   );
//   const d = res.map(async (item) => await entry.get(+item.entry_page_id));
//   const data = JSON.stringify(d);
//   await writeFile("./artifactData.json", data);
// })();

// import genshin from "genshin-db";
// const { artifacts, Languages } = genshin;

// (async () => {
//   const artifactList = artifacts("5", {
//     queryLanguages: [Languages.Japanese],
//     resultLanguage: Languages.Japanese,
//     matchCategories: true,
//   });
//   if (!Array.isArray(artifactList)) return;
//   const artifactData: Record<string, genshin.Artifact> = {};
//   artifactList.forEach((s) => {
//     const a = artifacts(s, {
//       queryLanguages: [Languages.Japanese],
//       resultLanguage: Languages.Japanese,
//     });
//     if (a) artifactData[s] = a;
//   });
//   console.log(artifactData);
//   const artifactNameData: Record<string, { name: string; type: string }> = {};
//   Object.values(artifactData).forEach((a) => {
//     artifactNameData[a.flower?.name || ""] = { name: a.name, type: "flower" };
//     artifactNameData[a.plume?.name || ""] = { name: a.name, type: "plume" };
//     artifactNameData[a.sands?.name || ""] = { name: a.name, type: "sands" };
//     artifactNameData[a.goblet?.name || ""] = { name: a.name, type: "goblet" };
//     artifactNameData[a.circlet?.name || ""] = { name: a.name, type: "circlet" };
//   });
//   console.log(artifactNameData);
//   const artifactType: Record<string, string> = {};
//   artifactType[artifactData["燃え盛る炎の魔女"].flower?.relictype || ""] =
//     "flower";
//   artifactType[artifactData["燃え盛る炎の魔女"].plume?.relictype || ""] =
//     "plume";
//   artifactType[artifactData["燃え盛る炎の魔女"].sands?.relictype || ""] =
//     "sands";
//   artifactType[artifactData["燃え盛る炎の魔女"].goblet?.relictype || ""] =
//     "goblet";
//   artifactType[artifactData["燃え盛る炎の魔女"].circlet?.relictype || ""] =
//     "circlet";
//   console.log(artifactType);
// })();

const data: OCRResponse = {
  ParsedResults: [
    {
      TextOverlay: { Lines: [], HasOverlay: false, Message: "" },
      TextOrientation: "0",
      FileParseExitCode: 1,
      ParsedText:
        "ー渡りの悟\r\n" +
        "空の杯\r\n" +
        "水元素ダメージ\r\n" +
        "46.6%\r\n" +
        "+20\r\n" +
        "・元素チャージ効率+11.0%\r\n" +
        "・会心率+10.5%\r\n" +
        "・攻撃力+19\r\n" +
        "会心ダメージ+22.5%\r\n",
      ErrorMessage: "",
      ErrorDetails: "",
    },
  ],
  OCRExitCode: 1,
  IsErroredOnProcessing: false,
  ProcessingTimeInMilliseconds: "34015",
  SearchablePDFURL: "Searchable PDF not generated as it was not requested.",
};

const arti = new Artifact(data);
const e = arti.toEmbedBuilder();
const f = arti.toDetail();
console.log((e.embeds?.[0] as any).data.description,(f.embeds?.[0] as any).data.description,(e.files?.[0] as any))
