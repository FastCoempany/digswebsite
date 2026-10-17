import type {ReactNode} from 'react';
import scriptIndex from '~/assets/script/index.json';
import {Script} from './marks/Script';

const INDEX = scriptIndex as Record<string, {word: string}>;
const WORDS = Object.entries(INDEX)
  .filter(([k]) => !k.includes('-'))
  .map(([k, v]) => ({key: k, word: v.word || k}));

/**
 * Set a BOAST line with its payoff word in script, when the line contains one of the drawn words
 * ("Wear your story." → Wear your <script>story</script>.). One word per line, as 08-copy.md asks.
 */
export function lineWithScript(line: string, prefer?: string, scale = 1): ReactNode {
  const candidates = prefer ? [{key: prefer, word: INDEX[prefer]?.word || prefer}, ...WORDS] : WORDS;
  for (const {key, word} of candidates) {
    const re = new RegExp(`\\b(${word})\\b`, 'i');
    const m = line.match(re);
    if (m && m.index !== undefined) {
      const before = line.slice(0, m.index);
      const after = line.slice(m.index + m[1].length);
      return (
        <>
          {before}
          <Script word={key} scale={scale} label={m[1]} />
          {after}
        </>
      );
    }
  }
  return line;
}
