import { VoiceText } from "@src/core/voicetext";
import fs from "node:fs/promises";
import dotenv from "dotenv";
dotenv.config();

// test("voicetext test", async () => {
//   const vt = new VoiceText(process.env.VTKey || "");
//   const res = await vt.speak("こんにちわ");
//   console.log(res.byteLength);
//   fs.writeFile("./test.wav",Buffer.from(res));
// });
