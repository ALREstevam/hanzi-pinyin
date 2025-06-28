import { FunctionComponent, useState } from "react";
import { CardData } from "../@types/Item";
import { CardItem } from "./CardItem";
import styles from "./Card.module.css";
import clsx from "clsx";
import Person from "./Person";
import CopyAndSay from "../utils/CopyAndSay";
import Modal from "./Modal";
import MermaidDiagram from "./MermaidDiagram";

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
  const { pinyin, pronounce, title, titlePrefix } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullText = data.textToDisplay || data.text;
  const text = fullText.split("");

  const textToSay = data.textToSay || data.text;

  const items = text.map((char, index) => <CardItem key={index} char={char} />);

  return (
    <div className={styles.card} style={getFlex(items.length)}>
      <h3 className={styles.cardTitle}>
        {titlePrefix ? `${titlePrefix} ` : ""}
        {title}
      </h3>
      {text.length > 1 && (
        <button className={styles.flowChartButton} onClick={() => setIsModalOpen(true)}>
          <img src="https://img.icons8.com/stickers/50/flow-chart.png" alt="Flow Chart" className={styles.flowChartIcon} />
        </button>
      )}
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
      {text.length > 1 && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Flow Chart for {title}</h2>
          <MermaidDiagram phrase={fullText} pinyin={pinyin} />
        </Modal>
      )}

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
