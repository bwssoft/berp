export function removeSpecialCharacters(text: string): string {
  return text.normalize("NFD").replace(/[^\w\s]/gi, "");
}
