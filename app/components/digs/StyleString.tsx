import './digs.css';

/** Tech-pack header grammar: `AC-LST-001 | LONG SLEEVE TEE | S–XL` as a micro caps line. */
export function StyleString({value, className = ''}: {value: string; className?: string}) {
  const parts = value.split('|').map((p) => p.trim()).filter(Boolean);
  return (
    <p className={`stylestring type-micro type-caps ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="stylestring-part">
          {i > 0 ? <span className="stylestring-pipe" aria-hidden="true">|</span> : null}
          <span>{p}</span>
        </span>
      ))}
    </p>
  );
}
