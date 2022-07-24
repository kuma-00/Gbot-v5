import { OCRResponse } from "@src/types/OCR";
import { EmbedBuilder } from "discord.js";
import { extract } from "fuzzball";

export type ArtifactStatus = {
  name: string;
  type: StatusType;
  val: number;
  hasPercent: boolean;
};

export const StatusType = {
  hp: "hp",
  hpP: "hpP",
  dfP: "dfP",
  atk: "atk",
  atkP: "atkP",
  erP: "erP",
  em: "em",
  physP: "physP",
  crP: "crP",
  cdP: "cdP",
  elemP: "elemP",
  healP: "healP",
} as const;
// eslint-disable-next-line no-redeclare
export type StatusType = typeof StatusType[keyof typeof StatusType];

export class Artifact {
  ocrLines: string[];
  ocrText: string;
  error = false;
  main: ArtifactStatus = {
    name: "",
    type: StatusType.hp,
    val: 0,
    hasPercent: false,
  };
  subs: ArtifactStatus[] = [];
  level = NaN;
  endMain = false;
  endSub = false;
  artifact_name = "現在未実装";
  score: {
    overall?: number;
    main?: number;
    sub?: number;
  } = {};
  mainStatusNames = {
    hp: "HP",
    heal: "治癒効果",
    df: "防御力",
    er: "元素チャージ効率",
    em: "元素熟知",
    atk: "攻撃力",
    cd: "会心ダメージ",
    cr: "会心率",
    phys: "物理ダメージ",
    elem: "元素ダメージ",
    anemo: "風元素ダメージ",
    elec: "雷元素ダメージ",
    pyro: "炎元素ダメージ",
    hydro: "水元素ダメージ",
    cryo: "氷元素ダメージ",
    geo: "岩元素ダメージ",
  } as const;
  mainElement = [
    "風元素ダメージ",
    "雷元素ダメージ",
    "炎元素ダメージ",
    "水元素ダメージ",
    "氷元素ダメージ",
    "岩元素ダメージ",
  ] as const;
  subStatusNames = {
    hp: "HP",
    df: "防御力",
    er: "元素チャージ効率",
    em: "元素熟知",
    atk: "攻撃力",
    cd: "会心ダメージ",
    cr: "会心率",
  } as const;
  subStatusData = {
    hp: [209, 239, 269, 299],
    hpP: [4.1, 4.7, 5.3, 5.8],
    df: [16, 19, 21, 23],
    dfP: [5.1, 5.8, 6.6, 7.3],
    erP: [4.5, 5.2, 5.8, 6.5],
    em: [16, 19, 21, 23],
    atk: [14, 16, 18, 19],
    atkP: [4.1, 4.7, 5.3, 5.8],
    cdP: [5.4, 6.2, 7, 7.8],
    crP: [2.7, 3.1, 3.5, 3.9],
    physP: [],
    elemP: [],
    healP: [],
  } as const;
  mainStetausData = {
    max: {
      hp: 4780,
      dfP: 58.3,
      atk: 311,
      atkP: 46.6,
      erP: 51.8,
      em: 187,
      physP: 58.3,
      crP: 31.1,
      cdP: 62.2,
      elemP: 46.6,
      hpP: 46.6,
      healP: 35.9,
    },
    min: {
      hp: 717,
      hpP: 7,
      atk: 47,
      atkP: 7,
      erP: 7.8,
      em: 28,
      physP: 8.7,
      crP: 4.7,
      cdP: 9.3,
      elemP: 7,
      dfP: 8.7,
      healP: 5.4,
    },
  } as const;
  replaceTexts = {
    事: "率",
    カ: "力",
  } as { [key: string]: string };
  weights = {
    hp: 0,
    dfP: 0,
    atk: 0.5,
    atkP: 1,
    erP: 0.5,
    em: 0.5,
    physP: 1,
    crP: 1,
    cdP: 1,
    elemP: 1,
    hpP: 0,
    df: 0,
    healP: 0,
  } as const;
  constructor(ocrData: OCRResponse) {
    this.ocrLines = ocrData.ParsedResults[0].ParsedText.split("\n").map(
      (line) => line.replace(/\s/g, "")
    );
    this.ocrText = ocrData.ParsedResults[0].ParsedText;

    // this.init();
  }

  async init() {
    this.analysis(this.ocrLines);
    this.score = this.score_calculation(this.level, this.main, this.subs);
    console.log(JSON.stringify(this));
  }

  analysis(lines: string[]) {
    lines.forEach((line) => this.level || this.level_analysis(line));
    if (!this.level) {
      console.log("level");
      this.error = true;
      return;
    }
    lines.forEach((line) => {
      if (line.match(/^\+\d\d?/)?.[0]) return;
      if (this.mainAndSub_analysis(line)) return;
      if (this.name_analysis(line)) return;
    });
    if (!(this.level && this.endMain && this.endSub)) {
      console.log("all");
      this.error = true;
    }
  }

  level_analysis(line: string) {
    // console.log(line.match(/^\+\d\d?/), this.level);
    this.level = +(line.match(/^\+\d\d?/)?.[0]?.replace("+", "") ?? 0);
    return line.match(/^\+\d\d?/);
  }

  mainAndSub_analysis(line: string) {
    if (this.endMain && this.endSub && this.subs.length > 3) return false;
    let statusText = line
      .replace(/\d+(?:[.,]\d+)?/, "")
      .replace(/[+%.,・]/g, "");
    Object.keys(this.replaceTexts).forEach((key) => {
      statusText = statusText.replace(key, this.replaceTexts[key]);
    });
    // console.log(statusText);
    const mainRes = extract(statusText, Object.values(this.mainStatusNames))[0];
    const subRes = extract(statusText, Object.values(this.subStatusNames))[0];
    const val = this.match_number(line);
    const hasPercent = line.includes("%");
    const useMain = this.main_analysis(mainRes, val, hasPercent);
    const useSub = this.sub_analysis(subRes, val, hasPercent);
    return useMain || useSub;
  }

  main_analysis(
    res: [string, number, number],
    val: string,
    hasPercent: boolean
  ) {
    if (val) val = hasPercent ? val : val.replace(/[.,]/, "");
    if (this.endMain) return false;
    let t: boolean = false;
    if (res[1] > 80 && !this.main.name) {
      // const pos = Object.values(this.mainStatusNames).indexOf(res[0]);
      const type = Object.keys(this.mainStatusNames)[res[2]];
      this.main.name = res[0];
      this.main.type = (((this.mainElement as readonly string[]).includes(
        res[0]
      )
        ? "elem"
        : type) + (hasPercent ? "P" : "")) as StatusType;
      if (/\s|\S/.test(this.main.name) && 0 < this.main.val) {
        if (
          !this.check_mainStatusVal(
            this.main.type,
            this.main.hasPercent,
            this.level,
            this.main.val
          )
        ) {
          console.log("main name");
          this.error = true;
        } else {
          this.endMain = true;
          this.error = false;
        }
      }
      t = true;
    }
    if (!this.main.val && val) {
      this.main.val = +val;
      this.main.hasPercent = hasPercent;
      if (this.main.type && !this.main.type.includes("P") && hasPercent) {
        this.main.type = (this.main.type + "P") as StatusType;
      }
      if (/\s|\S/.test(this.main.name) && 0 < this.main.val) {
        if (
          !this.check_mainStatusVal(
            this.main.type,
            this.main.hasPercent,
            this.level,
            this.main.val
          )
        ) {
          console.log("main val");
          this.main.val = 0;
          this.error = true;
        } else {
          this.endMain = true;
          this.error = false;
        }
      }
      t = true;
    }
    return t;
  }

  sub_analysis(
    res: [string, number, number],
    val: string,
    hasPercent: boolean
  ) {
    // console.log(res);
    if (val) val = hasPercent ? val : val.replace(/[.,]/, "");
    if (res[1] > 80 && val) {
      this.subs.push({
        name: res[0],
        hasPercent: hasPercent,
        type: (Object.keys(this.subStatusNames)[res[2]] +
          (hasPercent ? "P" : "")) as StatusType,
        val: +val,
      });
      // console.log(this.subs.length, this.level);
      if (
        (this.subs.length >= 3 && this.level <= 3) ||
        (this.subs.length <= 4 && this.level >= 4)
      )
        this.endSub = true;
      const subLast = this.subs.slice(-1)[0];
      if (!this.check_subStatusVal(subLast.type, subLast.hasPercent, val)) {
        console.log("sub");
        this.error = true;
      }
      return true;
    }
    return false;
  }

  name_analysis(line: string) {
    return false;
  }

  match_number(str: string) {
    return str.match(/\d+(?:[.,]\d+)?/)?.[0] ?? "0";
  }

  check_subStatusVal(type: StatusType, hasPercent: boolean, val: string) {
    const max = this.subStatusData[type][3];
    const min = this.subStatusData[type][0];
    if (!max || !min) return false;
    return min <= +val && !!(max * 6 >= +val);
  }

  check_mainStatusVal(
    type: StatusType,
    hasPercent: boolean,
    level: number,
    val: number
  ) {
    const max = this.mainStetausData.max[type];
    const min = this.mainStetausData.min[type];
    const value = max - (max - min) * (1 - level / 20);
    console.log(type, hasPercent, level, val, max, min);
    // console.log(val,value);
    return (
      (hasPercent ? Math.round(value * 10) / 10 : Math.round(value)) == val
    );
  }

  score_calculation(
    level: number,
    main: ArtifactStatus,
    subs: ArtifactStatus[]
  ) {
    const result = { overall: 0, main: 0, sub: 0 };
    result.sub = subs.reduce((accumulator, currentValue) => {
      const max = this.subStatusData[currentValue.type][3];
      if (!max) return accumulator;
      const weight = this.weights[currentValue.type];
      return accumulator + (currentValue.val / max) * 100 * weight;
    }, 0);
    result.sub = Math.round(result.sub);
    const max_main = this.mainStetausData.max[main.type];
    const weight = this.weights[main.type];
    result.main = Math.round(
      (main.val / max_main) * 100 * (3 + level / 4) * weight
    );
    result.overall = result.main + result.sub;
    return result;
  }

  sub_Detail(value: number, name: string) {
    const data = [5.4, 6.2, 7, 7.8];
    const patterns: number[][] = [];
    const equalsPattern = (a: number[], b: number[]) => {
      a = a.sort();
      b = b.sort();
      return a.toString() == b.toString();
    };
    const check = (
      data: number[],
      val: number,
      base: {
        index: number;
        valueItems: number[];
        indexItems: number[];
        value: number;
      } = { index: 0, valueItems: [], indexItems: [], value: 0 }
    ) => {
      if (
        base.index > 5 ||
        val < base.value ||
        (patterns.some((i) => equalsPattern(base.indexItems, i)) &&
          base.indexItems.length > 1)
      )
        return [];
      if (base.value == val) return [base];
      let results: {
        index: number;
        valueItems: number[];
        indexItems: number[];
        value: number;
      }[] = [];
      if (base.indexItems.length > 1) patterns.push(base.indexItems);
      data.forEach((i, index) => {
        const newbase = {
          index: base.index + 1,
          valueItems: [i, ...base.valueItems],
          indexItems: [index, ...base.indexItems],
          value: base.value + i,
        };
        if (newbase.value == val) {
          results = [newbase, ...results];
          return [];
        }
        const temporary_result = check(data, val, newbase);
        if (temporary_result) {
          results = [...temporary_result, ...results];
        }
      });
      return results;
    };
    if (data[0] <= value && data[3] * 6 >= value) {
      const results: {
        index: number;
        valueItems: number[];
        indexItems: number[];
        value: any;
      }[] = [];
      const r = check(data, value).forEach((i) => {
        if (results.some((j) => equalsPattern(j.indexItems, i.indexItems)))
          return;
        results.push(i);
      });
      return { results };
    } else {
      return;
    }
  }

  toEmbedBuilder() {
    const embed = new EmbedBuilder();
    embed.setTitle(this.error ? "エラー" : "結果").setDescription(
      `聖遺物名:${this.artifact_name}

レベル:**+${this.level}**
メインステータス:**${this.main?.name}+${this.main?.val}${
        this.main?.hasPercent ? "%" : ""
      }
**サブステータス:
**${this.subs?.[0]?.name}+${this.subs?.[0]?.val}${
        this.subs?.[0]?.hasPercent ? "%" : ""
      }**
**${this.subs?.[1]?.name}+${this.subs?.[1]?.val}${
        this.subs?.[1]?.hasPercent ? "%" : ""
      }**
**${this.subs?.[2]?.name}+${this.subs?.[2]?.val}${
        this.subs?.[2]?.hasPercent ? "%" : ""
      }**
**${this.subs?.[3]?.name}+${this.subs?.[3]?.val}${
        this.subs?.[3]?.hasPercent ? "%" : ""
      }**

総合スコア:**${this.score?.overall}**
メインスコア:**${this.score?.main}**
サブスコア:**${this.score?.sub}**
${
  this.error
    ? "\n**エラーが発生しました。一部読み取れてない、または読み取った値が間違っています。画像を変えるなどを試して見てください。**\n"
    : ""
}
⬇詳細`
    );
    if (this.error) embed.setColor([255, 0, 0]);
    return embed;
  }

  toDetail() {}
}
