import ClipboardCopier from "./ClipboardCopier";
import { TextToSpeech } from "./tts";

export default class CopyAndSay {
  static run(
    textToSay: string,
    textToCopy: string,
    lang: "en-US" | "zh-CN" = "zh-CN",
    speed: "NORMAL" | "SLOW" = "NORMAL"
  ) {
    ClipboardCopier.copy(textToCopy);
    TextToSpeech.say(textToSay, lang, speed);
  }

  static text(text: string) {
    return {
      chinese: {
        normal: () => CopyAndSay.run(text, text, "zh-CN", "NORMAL"),
        slow: () => CopyAndSay.run(text, text, "zh-CN", "SLOW"),
      },
      english: {
        normal: () => CopyAndSay.run(text, text, "en-US", "NORMAL"),
        slow: () => CopyAndSay.run(text, text, "en-US", "SLOW"),
      },
    };
  }
}
