import {Script} from './marks/Script';
import './digs.css';

/** Strike a word with a marker stroke and rewrite it in script: ~~ordinary~~ *dope*. */
export function StrikeRewrite({struck, word, tone = 'blue', className = ''}: {struck: string; word: string; tone?: 'blue' | 'black'; className?: string}) {
  return (
    <span className={`strike strike-${tone} ${className}`}>
      <span className="strike-word">
        <s>{struck}</s>
        <svg className="strike-line" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M1 7 C 20 2, 40 10, 60 5 S 90 9, 99 4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>{' '}
      <Script word={word} scale={1.1} />
    </span>
  );
}
