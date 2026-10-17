import {Button} from '~/components/core/Button';
import {lineWithScript} from './lineWithScript';
import './TaglineBand.css';

export type TaglineBandProps = {
  lines: string[];
  /** Which approved line to show; pages pass a stable index so screenshots stay deterministic. */
  index?: number;
  cta: {label: string; to: string};
  className?: string;
};

/** Black band with one BOAST line in Alexandria display and one CTA; closes every page before the footer. */
export function TaglineBand({lines, index = 0, cta, className = ''}: TaglineBandProps) {
  const line = lines[((index % lines.length) + lines.length) % lines.length] ?? '';
  return (
    <section className={`tagline ${className}`} data-surface="dark" data-rail-tone="dark" aria-label={line}>
      <p className="tagline-line type-display">{lineWithScript(line, undefined, 1.05)}</p>
      <Button to={cta.to} variant="on-dark" size="lg">
        {cta.label}
      </Button>
    </section>
  );
}
