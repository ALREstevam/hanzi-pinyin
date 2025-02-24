import hanzi from "hanzi";

export interface Radical {
  radical: string;
  meaning: string;
}

export default class HanziDictionary {
  static async getDefinition(char: string) {
    console.log(`Getting definition of ${char}`)
    const result = hanzi.definitionLookup(char, "s");
    if (result) {
      return Array.from(new Set(result.map((el) => el.definition)))
        .filter((el) => !el.includes("surname"))
        .map((el) => el.split("/"));
    }
    return [[]];
  }

  static decomposeIntoRadicals(char: string) : Radical[] {
    return hanzi
      .decompose(char, 1)
      .components!.map((radical) => ({
        radical,
        meaning: hanzi.getRadicalMeaning(radical),
      }))
      .filter((el) => !(el.radical === "No glyph available"));
  }

  static getRadicalMeaning(radical: string) {
    const meaning = hanzi.getRadicalMeaning(radical);
    if (meaning === "N/A") {
      return;
    }
    return meaning;
  }
}
