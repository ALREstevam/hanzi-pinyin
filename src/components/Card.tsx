import { FunctionComponent } from "react";
import { CardData } from "../@types/Item";
import { CardItem } from "./CardItem";
import styles from "./Card.module.css";
import clsx from "clsx";
import Person from "./Person";
import CopyAndSay from "../utils/CopyAndSay";

type CardProps = CardData;

const getFlex = (items: number) => {
  if (items === 1) return { flexBasis: "10%", flexGrow: ".15" };
  if (items === 2) return { flexBasis: "15%", flexGrow: ".20" };
  if (items === 3) return { flexBasis: "20%", flexGrow: ".25" };
  if (items === 4) return { flexBasis: "25%", flexGrow: ".30" };
  if (items === 5) return { flexBasis: "30%", flexGrow: ".35" };
  if (items === 6) return { flexBasis: "35%", flexGrow: ".40" };
  return {};
};

const Card: FunctionComponent<CardProps> = (data) => {
  const { pinyin, pronounce, title, comment, titlePrefix } = data;

  const fullText = data.textToDisplay || data.text;
  const text = fullText.split("");

  const textToSay = data.textToSay || data.text;

  const items = text.map((char) => <CardItem char={char} />);

  return (
    <div className={styles.card} style={getFlex(items.length)}>
      <h3 className={styles.cardTitle}>
        {titlePrefix ? `${titlePrefix} ` : ""}
        {title}
      </h3>
      <div className={styles.containerCardMeta}>
        <span
          className={clsx(styles.pinyinFull, styles.metaTextBase)}
          onClick={CopyAndSay.text(pinyin).chinese.slow}
        >
          {pinyin}
        </span>
        <span
          className={clsx(styles.hanziFull, styles.metaTextBase)}
          onClick={CopyAndSay.text(textToSay).chinese.normal}
        >
          {text}
        </span>
        <span className={clsx(styles.pronounceFull, styles.metaTextBase)}>
          {pronounce}
        </span>
      </div>

      <div className={styles.cardItemContainter}>
        {data.person && <Person name={data.person}/>}
        {items}
      </div>
     
    </div>
  );
};
// <span className={styles.comment}>{comment}</span>

export default Card;

/*
<button onclick="speakText('${chars.join('')}', 0.8)">🔊 1x</button>
    <button onclick="speakText('${chars.join('')}', 0.5)">🔊 .5x</button>
    */
