import index from '~/assets/script/index.json';
import './marks.css';

const files = import.meta.glob('../../../assets/script/script-*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

type ScriptIndex = Record<string, {viewBox: string; word: string}>;
const SCRIPT_INDEX = index as ScriptIndex;

/** Words available as script artwork (content/copy/en.json → scriptWords, drawn by tools/script_svg.py). */
export type ScriptWord = keyof typeof index;

export type ScriptProps = {
  /** File stem under brand/script/, e.g. "good", "story", "dope-cap", "actually-dope-tilted". */
  word: ScriptWord | string;
  /** Scale relative to the surrounding font size. 1 = cap height roughly matches the sans. */
  scale?: number;
  /** Reveal the word left to right over 600ms when it enters view (off under reduced motion). */
  drawOn?: boolean;
  className?: string;
  /** Override the accessible name (defaults to the word itself). */
  label?: string;
};

const UPM = 1000;

/**
 * A payoff word in The Old Falcons, rendered from the pre-built SVG outline as a CSS mask over
 * currentColor. The font file is never served. One or two script words per line, maximum.
 */
export function Script({word, scale = 1, drawOn = false, className = '', label}: ScriptProps) {
  const key = String(word);
  const meta = SCRIPT_INDEX[key];
  const url = files[`../../../assets/script/script-${key}.svg`];
  if (!meta || !url) {
    // Unknown word: fall back to plain text so copy never disappears.
    return <em className={className}>{label ?? key}</em>;
  }
  const [, minY, w, h] = meta.viewBox.split(' ').map(Number);
  const descent = Math.max(0, minY + h); // units below the baseline
  const height = (h / UPM) * scale;
  const width = (w / UPM) * scale;
  const shift = (descent / UPM) * scale;
  return (
    <span
      className={`script ${drawOn ? 'script-draw' : ''} ${className}`}
      role="img"
      aria-label={label ?? meta.word ?? key}
      data-brand-graphic=""
      style={{
        ['--mark-mask' as string]: `url(${url})`,
        width: `${width.toFixed(3)}em`,
        height: `${height.toFixed(3)}em`,
        verticalAlign: `${(-shift).toFixed(3)}em`,
      }}
    />
  );
}
