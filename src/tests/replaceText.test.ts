// import { replaceText } from "@src/util";

// import {
//   Artifact as hoyoArtifact,
//   Entry,
//   Language,
//   setLanguage,
// } from "@gonetone/hoyowiki-api";

import {artifacts, Languages} from "genshin-db";

test(
  "replaceText test",
  async () => {
    // console.log(replaceText("test test po mo nw", { test: "base" ,"po":"trident"}));
    console.log(artifacts("5",{queryLanguages: [Languages.Japanese], resultLanguage: Languages.Japanese,matchCategories: true}))

  },
  20 * 60 * 1000
);
