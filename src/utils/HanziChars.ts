export const acceptedNonHanzi = [
  " + ",
  " ",
  "…",
  "?",
  "!",
  "。",
  "？",
  "，",
  "/",
  "(",
  ")",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  ",",
];

export const isCharHanzi = (char: string) => !acceptedNonHanzi.includes(char);

export const splitWords = (str: string) => {
  const regex = new RegExp(`[${acceptedNonHanzi.join("")}]`, "g"); // Create a regex pattern from the chars list
  return str.split(regex).filter(Boolean); // Split and remove empty items
};
