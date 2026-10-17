import type {ReactNode} from 'react';
import './Badge.css';

export type BadgeStatus = 'new' | 'coming-soon' | 'pre-order' | 'low-stock' | 'sold-out';

/** Status badge: text plus color, never color alone. Signal colors only for low-stock and sold-out. */
export function Badge({status, children, className = ''}: {status: BadgeStatus; children: ReactNode; className?: string}) {
  return (
    <span className={`badge badge-${status} ${className}`} data-status={status}>
      {children}
    </span>
  );
}
