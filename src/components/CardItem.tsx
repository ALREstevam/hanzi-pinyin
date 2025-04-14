import { FunctionComponent } from "react";
import HanziDefinition from "./HanziDefinition";
import HanziPaint from "./HanziPaint";
import HanziRadical from "./HanziRadical";
import MainMeaning from "./MainMeaning";

import styles from './CardItem.module.css'
import { pinyin } from "pinyin-pro";
import { isCharHanzi } from "../utils/HanziChars";
import CopyAndSay from "../utils/CopyAndSay";

interface CardItemProps {
  char: string;
}
const NonHanziCardItem: FunctionComponent<CardItemProps> = ({ char }) => {
  return (
    <div className={styles.nonHanziCardItem} >
      <span>{char}</span>
    </div>
  );
};

export const CardItem: FunctionComponent<CardItemProps> = ({ char }) => {
  if (!isCharHanzi(char)) {
    return <NonHanziCardItem char={char}/>;
  }

  const charPinyin = pinyin(char)

  return (
    <div className={styles.cardItem} data-tag={char}>
      <HanziPaint char={char} />
      <MainMeaning char={char} />
      <div className={styles.charDetailsContainer}>
        <span onClick={CopyAndSay.text(char).chinese.normal}>{char}</span>
        <span onClick={CopyAndSay.text(charPinyin).chinese.slow} style={{backgroundColor: '#79e8f2'}}>{charPinyin}</span>
      </div>
      <HanziDefinition char={char} />
      <HanziRadical char={char} />
    </div>
  );
};
