import { Content } from "../@types/Item";

export function sortFilenames(filenames: (string | null)[]): string[] {
  return filenames
    .filter((file): file is string => file !== null) // Remove null values
    .sort((a, b) => {
      const numA = a.match(/\d+/) ? parseInt(a.match(/\d+/)![0], 10) : 0;
      const numB = b.match(/\d+/) ? parseInt(b.match(/\d+/)![0], 10) : 0;
      return numA - numB;
    });
}

export function importAll(r: __WebpackModuleApi.RequireContext): Content[] {
  const fileNames = sortFilenames(r.keys());
  return fileNames.map((fileName: string) => r(fileName) as Content);
}