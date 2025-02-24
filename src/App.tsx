import React, { Fragment } from "react";
import "./App.css";
import "./HanziPaint.css";
import hanzi from "hanzi";
import Card from "./components/Card";

import { Content } from "./@types/Item";

const sections: Content[] = importAll(require.context("./content", false, /\.json$/));

function importAll(r: __WebpackModuleApi.RequireContext): Content[] {
  return r.keys().sort().map((fileName: string) => r(fileName) as Content);
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

const Section = ({ content }: { content: Content }) => {
  const cards = content.items.map((item) => (
    <Card
      key={item.text}
      pronounce={item.pronounce}
      text={item.text}
      textToDisplay={item.textToDisplay}
      textToSay={item.textToSay}
      title={item.title}
      type={item.type}
      pinyin={item.pinyin}
      comment={item.comment}
      titlePrefix={item.titlePrefix}
    />
  ));

  return (
    <Fragment>
      <h1>{content.section.h1}</h1>
      {cards}
    </Fragment>
  );
};

export default App;
