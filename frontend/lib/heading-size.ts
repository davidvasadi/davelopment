// Egy hosszú, törés nélküli EGYETLEN szó (pl. "Szolgáltatások") a teljes
// címnél jóval hamarabb kilóghat keskeny (mobil) képernyőn, mert nem tud
// több sorba törni — ezért a cím méretezésénél nem elég az összhosszt
// nézni, a leghosszabb szót is figyelni kell.
export function longestWordLength(text: string): number {
  return (text || '')
    .split(/\s+/)
    .reduce((max, word) => Math.max(max, word.length), 0);
}
