declare module "hanzi" {
    export function start(): void;
    export function getCharacter(character: string): any;
    export function definitionLookup(
      char: string,
      mode?: "s" | "t"
    ): {
      traditional: string;
      simplified: string;
      pinyin: string;
      definition: string;
    }[];
    export function decompose(
      char: string,
      type?: 1 | 2 | 3
    ): {
      character: string;
      components1?: string[];
      components2?: string[];
      components3?: string[];
      components?: string[];
    };
    export function getRadicalMeaning(radical: string): string;
  }
  