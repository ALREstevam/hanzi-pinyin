export default class ClipboardCopier {
  static copy(text: string): boolean {
    try {
      navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      return false;
    }
  }
}
