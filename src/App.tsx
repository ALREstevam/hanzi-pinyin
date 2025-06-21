import React, { Fragment, useEffect, useState } from "react";
import useDebouncedSearch from "./hooks/useDebouncedSearch";
import SearchBar from "./components/SearchBar";
import "./App.css";
import "./HanziPaint.css";
import hanzi from "hanzi";
import Card from "./components/Card";
import { CardData, Content, DialogData } from "./@types/Item";

import Dialog from "./components/Dialog";
import useFilteredSections from "./hooks/useFilteredSections";
import TableOfContents from "./components/TableOfContents";

import { importAll } from "./utils/FileContentLoader";

const sections: Content[] = importAll(
  require.context("./content", false, /\.json$/)
);

function App() {
  const [hanziInitialized, setHanziInitialized] = useState(false);

  useEffect(() => {
    hanzi.start();
    setHanziInitialized(true);
  }, []);

  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebouncedSearch("", 300);

  const filteredSections = useFilteredSections(sections, debouncedSearchTerm);

  return (
    <div className="App">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {hanziInitialized ? (
        <Fragment>
          <TableOfContents sections={filteredSections} />
          {filteredSections.map((content, index) => (
            <Section key={index} content={content} />
          ))}
        </Fragment>
      ) : (
        <div>Loading Hanzi data...</div>
      )}
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

const buildDialog = (items: CardData[], title:string, section:string, index:number) => (
  <Dialog key={items.map(it=>it.pinyin).join('')} title={title}>
    {items.map((item, itemidx) => buildCard(item, section, index*itemidx))}
  </Dialog>
)

const Section = ({ content }: { content: Content }) => {
  const cards = content.items.map((item, index) => {
    if (item.type === "BASE") {
      return buildCard(item as unknown as CardData, content.section.h1, index);
    } else if (item.type === "DIALOG") {
      return buildDialog((item as unknown as DialogData).items, (item as unknown as DialogData).title, content.section.h1, index);
    }
    return <div></div>
  });

  return (
    <Fragment>
      <h1 id={content.section.h1.replace(/\s+/g, '-').toLowerCase()}>{content.section.h1}</h1>
      {cards}
    </Fragment>
  );
};

export default App;
