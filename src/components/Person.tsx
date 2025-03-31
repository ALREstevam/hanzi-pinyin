import { FunctionComponent } from "react";
import styles from "./Person.module.css";

export interface PersonProps {
  name: string;
}

const colors = {
  A: "#4bc957",
  B: "#c9644b",
  C: "#4b7fc9",
};

const defaultColor = "#d457cd";

const getColorForName = (name: string) => {
  return colors?.[name as "A" | "B"] || defaultColor;
};

const Person: FunctionComponent<PersonProps> = ({ name }) => {
  return (
    <div className={styles.person}>
      <span style={{ backgroundColor: getColorForName(name) }}>{name}</span>
    </div>
  );
};

export default Person;
