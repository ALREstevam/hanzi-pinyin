import { useMemo } from 'react';
import { CardData, Content, DialogData } from '../@types/Item';

function useFilteredSections(sections: Content[], debouncedSearchTerm: string) {
  const filteredSections = useMemo(() => {
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
    if (lowerCaseSearchTerm === "") {
      return sections;
    }

    const checkCardMatch = (card: CardData) => {
      return (
        (card.text && card.text.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.pronounce && card.pronounce.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.textToDisplay && card.textToDisplay.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.textToSay && card.textToSay.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.title && card.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.pinyin && card.pinyin.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.comment && card.comment.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.titlePrefix && card.titlePrefix.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (card.person && card.person.toLowerCase().includes(lowerCaseSearchTerm))
      );
    };

    const processedSections = sections.map((content) => {
      const newItems = content.items.map((item) => {
        if (item.type === "BASE") {
          const card = item as unknown as CardData;
          return checkCardMatch(card) ? card : null;
        } else if (item.type === "DIALOG") {
          const dialog = item as unknown as DialogData;
          const filteredDialogItems = dialog.items.filter(checkCardMatch);
          return filteredDialogItems.length > 0 ? { ...dialog, items: filteredDialogItems } : null;
        }
        return null;
      }).filter(Boolean);

      const sectionTitleMatches =
        content.section.h1.toLowerCase().includes(lowerCaseSearchTerm) ||
        (content.section.h2 && content.section.h2.toLowerCase().includes(lowerCaseSearchTerm));

      if (sectionTitleMatches || newItems.length > 0) {
        return { ...content, items: newItems };
      }
      return null;
    }).filter(Boolean);

    return processedSections as Content[];
  }, [sections, debouncedSearchTerm]);

  return filteredSections;
}

export default useFilteredSections;