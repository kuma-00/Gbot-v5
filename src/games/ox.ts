import {
  Minigame,
  MinigameData,
  MinigameConstructor,
} from "./../types/minigame";

export const minigame: MinigameConstructor = class ox implements Minigame {
  static gameData = {
    name: "ox",
    description: "マルバツゲーム",
    details: "3x3で一列自分の駒を揃えると勝ちな簡単なゲーム。先手と後手に分かれて:o:と:x:を交互に打っていきます。:one:~:nine:のマスがあるので、:one:~:nine:のリアクションで打てます。はじめに一列揃えたほうが勝ちです。",
    maxMember: 0,
    minMember: 0,
    joinInMidway: false,
  };
  data: MinigameData;
  constructor(data: MinigameData) {
    this.data = data;
  }
  start(): void {

    // throw new Error("Method not implemented.");
  }
  end(): void {
    // throw new Error("Method not implemented.");
  }
};
