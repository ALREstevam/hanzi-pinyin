import React, { Fragment } from "react";
import "./App.css";
import "./HanziPaint.css";
import hanzi from "hanzi";
import Card from "./components/Card";

import { CardData, Content, DialogData } from "./@types/Item";
import Dialog from "./components/Dialog";

const sections: Content[] = importAll(
  require.context("./content", false, /\.json$/)
);

function sortFilenames(filenames: (string | null)[]): string[] {
  return filenames
    .filter((file): file is string => file !== null) // Remove null values
    .sort((a, b) => {
      const numA = a.match(/\d+/) ? parseInt(a.match(/\d+/)![0], 10) : 0;
      const numB = b.match(/\d+/) ? parseInt(b.match(/\d+/)![0], 10) : 0;
      return numA - numB;
    });
}

function importAll(r: __WebpackModuleApi.RequireContext): Content[] {
  const fileNames = sortFilenames(r.keys());
  return fileNames.map((fileName: string) => r(fileName) as Content);
}

function App() {
  hanzi.start();

  return (
    <div className="App">
      {sections.map((content, index) => (
        <Section key={index} content={content} />
      ))}
    </div>
  );
}

const buildCard = (data: CardData, section:string, index:number) => (
  <Card
    key={`${data.text}-${section}-${index}`}
    pronounce={data.pronounce}
    text={data.text}
    textToDisplay={data.textToDisplay}
    textToSay={data.textToSay}
    title={data.title}
    type={data.type}
    pinyin={data.pinyin}
    comment={data.comment}
    titlePrefix={data.titlePrefix}
    person={data.person}
  />
);

const buildDialog = (items: CardData[], section:string, index:number) => (
  <Dialog key={items.map(it=>it.pinyin).join('')}>
    {items.map((item, itemidx) => buildCard(item, section, index*itemidx))}
  </Dialog>
)

const Section = ({ content }: { content: Content }) => {
  const cards = content.items.map((item, index) => {
    if (item.type === "BASE") {
      return buildCard(item as unknown as CardData, content.section.h1, index);
    } else if (item.type === "DIALOG") {
      return buildDialog((item as unknown as DialogData).items, content.section.h1, index);
    }
    return <div></div>
  });

  return (
    <Fragment>
      <h1>{content.section.h1}</h1>
      {cards}
    </Fragment>
  );
};

export default App;
