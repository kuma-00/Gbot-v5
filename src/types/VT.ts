export const VTEmotion = {
  NONE: undefined,
  HAPPINESS: "happiness",
  ANGER: "anger",
  SADNESS: "sadness",
} as const;
// eslint-disable-next-line no-redeclare
export type VTEmotion = typeof VTEmotion[keyof typeof VTEmotion];

export const VTEmotionLevel = {
  NONE: undefined,
  EXTREME: "4",
  SUPER: "3",
  HIGH: "2",
  NORMAL: "1",
} as const;
// eslint-disable-next-line no-redeclare
export type VTEmotionLevel = typeof VTEmotionLevel[keyof typeof VTEmotionLevel];

export const VTSpeaker = {
  SHOW: "show",
  HARUKA: "haruka",
  HIKARI: "hikari",
  TAKERU: "takeru",
  SANTA: "santa",
  BEAR: "bear",
} as const;
// eslint-disable-next-line no-redeclare
export type VTSpeaker = typeof VTSpeaker[keyof typeof VTSpeaker];

export const VTFormat = {
  OGG: "ogg",
  WAV: "wav",
  AAC: "aac",
} as const;
// eslint-disable-next-line no-redeclare
export type VTFormat = typeof VTFormat[keyof typeof VTFormat];

export type VTOption = {
  pitch: number;
  speed: number;
  volume: number;
  speaker: VTSpeaker;
  emotion: VTEmotion;
  emotionLevel: VTEmotionLevel;
  format: VTFormat;
};

export const VTDefaultOption: VTOption = {
  pitch: 100,
  speed: 100,
  volume: 100,
  speaker: VTSpeaker.HIKARI,
  emotion: VTEmotion.NONE,
  emotionLevel: VTEmotionLevel.NONE,
  format: VTFormat.WAV,
};
