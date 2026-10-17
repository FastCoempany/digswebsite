import type {ReactNode} from 'react';
import './EmptyState.css';

export type EmptyStateProps = {
  variant?: 'cart' | 'filter' | '404';
  heading: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  /** Slot for a script word or mark above the heading. */
  art?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Quiet empty states for the cart, filters and 404; the brand layer passes the script word. */
export function EmptyState({variant = 'filter', heading, body, action, art, children, className = ''}: EmptyStateProps) {
  return (
    <div className={`empty empty-${variant} ${className}`}>
      {art ? <div className="empty-art">{art}</div> : null}
      <p className="empty-heading">{heading}</p>
      {body ? <p className="empty-body">{body}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
      {children}
    </div>
  );
}
