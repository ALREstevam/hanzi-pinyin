export interface CardData {
  title: string;
  titlePrefix?: string;
  text: string;

  pronounce: string;
  pinyin: string;

  type: "BASE";

  comment?: string;
  textToDisplay?: string;
  textToSay?: string;
  person?: string;
}

export interface DialogData {
  type: "DIALOG";
  title: string;
  items: CardData[];
}

export interface Content {
  section: {
    h1: string;
    h2?: string;
  };
  items: (CardData | DialogData)[];
}
