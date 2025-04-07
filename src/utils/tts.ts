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
    const voicesList = window.speechSynthesis.getVoices();
    speech.voice = voicesList.find((voice) => voice.lang === lang) || null;
    speech.text = text;
    speech.pitch = 1.0;
    speech.lang = lang;
    speech.rate = { NORMAL: 0.8, SLOW: 0.5 }[speed];

    speech.onstart = () => {
      onStart && onStart();
    };

    speech.onend = () => {
      onFinish && onFinish();
    };

    speechSynthesis.speak(speech);
  }
}



