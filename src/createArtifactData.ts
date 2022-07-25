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
import genshin from "genshin-db";
const { artifacts, Languages } = genshin;

(async () => {
  console.log(
    artifacts("海染硨磲", {
      queryLanguages: [Languages.Japanese],
      resultLanguage: Languages.Japanese,
      matchCategories: true,
      dumpResult: true,
    })
  );
})();
