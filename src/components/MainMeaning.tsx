import { FunctionComponent, useEffect, useState } from "react";
import HanziDictionary from "../utils/HanziDictionary";
import styles from "./MainMeaning.module.css";

interface MainMeaningProps {
  char: string;
}

const getMainMeaning = (meanings: string[][]) => {
  console.log({meanings})
  const meaningsProcessed = meanings
    .map((meaningArr) =>
      meaningArr
        .map((el) => el.replace(/\s*\(.*?\)\s*/g, " ").trim())
    )
    .flat().filter((el) => el.length < 10).filter(el => !!el);

  console.log({ meaningsProcessed });

  return meaningsProcessed?.[0];
};

const MainMeaning: FunctionComponent<MainMeaningProps> = ({ char }) => {
  const [meaning, setMeaning] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const radicalMeaning = HanziDictionary.getRadicalMeaning(char);
    if (radicalMeaning) {
      setMeaning(radicalMeaning);
      setLoading(false);
    } else {
     
      HanziDictionary.getDefinition(char)
        .then((res) => getMainMeaning(res))
        .then((res) => setMeaning(res))
        .then(() => setLoading(false));
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div className={styles.mainMeaning}>{meaning}</div>;
};

export default MainMeaning;
