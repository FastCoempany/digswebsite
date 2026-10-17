import './Skeleton.css';

export type SkeletonProps = {
  variant?: 'text' | 'media' | 'card';
  /** Lines for the text variant. */
  lines?: number;
  /** CSS aspect ratio for media, e.g. "4 / 5". */
  ratio?: string;
  className?: string;
  label?: string;
};

/** Sunken blocks; the shimmer is off under reduced motion. */
export function Skeleton({variant = 'text', lines = 3, ratio = '4 / 5', className = '', label}: SkeletonProps) {
  if (variant === 'media') {
    return <span className={`skel skel-media ${className}`} style={{aspectRatio: ratio}} role={label ? 'img' : undefined} aria-label={label} aria-hidden={!label || undefined} />;
  }
  if (variant === 'card') {
    return (
      <span className={`skel-card ${className}`} aria-hidden="true">
        <span className="skel skel-media" style={{aspectRatio: ratio}} />
        <span className="skel skel-line" style={{width: '70%'}} />
        <span className="skel skel-line" style={{width: '40%'}} />
      </span>
    );
  }
  return (
    <span className={`skel-text ${className}`} aria-hidden="true">
      {Array.from({length: lines}).map((_, i) => (
        <span key={i} className="skel skel-line" style={{width: i === lines - 1 ? '55%' : '100%'}} />
      ))}
    </span>
  );
}
