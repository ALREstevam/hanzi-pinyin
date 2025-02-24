import { pinyin } from "pinyin-pro";
import HanziDictionary from "../utils/HanziDictionary";
import { TextToSpeech } from "../utils/tts";
import styles from "./HanziRadical.module.css";

export interface HanziRadicalProps {
  char: string;
}
const HanziRadical = ({ char }: HanziRadicalProps) => {
  const component = HanziDictionary.decomposeIntoRadicals(char).map((el) => (
    <span
      className={styles.radical}
      onClick={() => {
        TextToSpeech.say(el.radical, "zh-CN", "SLOW");
        if (el.meaning !== "N/A")
          TextToSpeech.say(el.meaning, "en-US", "NORMAL");
      }}
    >
      <strong>{el.radical}</strong> <span>{pinyin(el.radical)}</span><span>{el.meaning !== "N/A" && ` | ${el.meaning}`}</span>
    </span>
  ));

  return <div className={styles.radicalContainer}>{component}</div>;
};

export default HanziRadical;
