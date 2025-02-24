import { FunctionComponent } from "react";
import { CardData } from "../@types/Item";
import { CardItem } from "./CardItem";
import styles from "./Card.module.css";
import clsx from "clsx";
import { TextToSpeech } from "../utils/tts";

type CardProps = CardData;

const Card: FunctionComponent<CardProps> = (data) => {
  const { pinyin, pronounce, title, comment, titlePrefix } = data;

  const fullText = data.textToDisplay || data.text;
  const text = fullText.split("");

  const textToSay = data.textToSay || data.text;

  const items = text.map((char) => (
    <CardItem char={char} />
  ));

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        {titlePrefix ? `${titlePrefix} ` : ""}
        {title}
      </h3>
      <div className={styles.containerCardMeta}>
        <span
          className={clsx(styles.pinyinFull, styles.metaTextBase)}
          onClick={() => TextToSpeech.say(textToSay, "zh-CN", "SLOW")}
        >
          {pinyin}
        </span>
        <span
          className={clsx(styles.hanziFull, styles.metaTextBase)}
          onClick={() => TextToSpeech.say(textToSay, "zh-CN", "NORMAL")}
        >
          {text}
        </span>
        <span className={clsx(styles.pronounceFull, styles.metaTextBase)}>
          {pronounce}
        </span>
      </div>

      <div className={styles.cardItemContainter}>{items}</div>
      <span className={styles.comment}>{comment}</span>
    </div>
  );
};

export default Card;

/*
<button onclick="speakText('${chars.join('')}', 0.8)">🔊 1x</button>
    <button onclick="speakText('${chars.join('')}', 0.5)">🔊 .5x</button>
    */
