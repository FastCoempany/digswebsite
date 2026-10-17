import './digs.css';

export type TrimTokenProps = {
  /** Coded trim token from the tech pack: L1, L3, L4, T1, RIB, YOKE… */
  code: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'blue' | 'ice';
  active?: boolean;
  className?: string;
};

/** Small coded circle, the tech packs' trim grammar. Presentational; BuiltLikeThis wraps it in a button. */
export function TrimToken({code, size = 'md', tone = 'ink', active, className = ''}: TrimTokenProps) {
  return (
    <span className={`trim trim-${size} trim-${tone} ${active ? 'is-active' : ''} ${className}`} data-code={code}>
      {code}
    </span>
  );
}
