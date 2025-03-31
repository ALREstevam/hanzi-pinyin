export class TextToSpeech {
  static say(
    text: string,
    lang: "en-US" | "zh-CN" = "zh-CN",
    speed: "NORMAL" | "SLOW" = "NORMAL",
    onStart?: () => void,
    onFinish?: () => void
  ) {
    if (!text.trim()) return;
    const speech = new SpeechSynthesisUtterance(text);

    speech.onstart = () => {
      onStart && onStart();
    };

    speech.onend = () => {
      onFinish && onFinish();
    };

    speech.text = text;
    speech.pitch = 1.0;
    speech.lang = lang;
    speech.rate = { NORMAL: 0.8, SLOW: 0.5 }[speed];
    speechSynthesis.speak(speech);
  }
}

