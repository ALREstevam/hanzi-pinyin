import { useState, useEffect, FunctionComponent } from "react";
import HanziDictionary from "../utils/HanziDictionary";
import styles from './HanziDefinition.module.css'

interface HanziCharDefinitionComponentProps {
  char: string;
}

const HanziDefinition: FunctionComponent<HanziCharDefinitionComponentProps> = ({
  char,
}) => {
  const [definition, setDefinition] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    HanziDictionary.getDefinition(char)
      .then((data: string[][]) => setDefinition(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [char]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.definition}>
      {definition?.map((el) => (
        <DefinitionItem item={el} />
      ))}
    </div>
  );
};

interface DefinitionItemProps {
  item: string[];
  max?: number;
  separator?: string;
}

const DefinitionItem: FunctionComponent<DefinitionItemProps> = ({
  item,
  max = 4,
  separator = " • ",
}) => {
  const content = `[${item.slice(0, max).join(separator)}] `
  return <span>{content}</span>;
};

export default HanziDefinition;
