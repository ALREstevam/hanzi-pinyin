export const acceptedNonHanzi = [" ", "…", "?", "。", "？", "，", "/", "(", ")"];

export const isCharHanzi = (char: string) => !acceptedNonHanzi.includes(char);

export const splitWords = (str:string) => {
  const regex = new RegExp(`[${acceptedNonHanzi.join("")}]`, "g"); // Create a regex pattern from the chars list
  return str.split(regex).filter(Boolean); // Split and remove empty items
}
