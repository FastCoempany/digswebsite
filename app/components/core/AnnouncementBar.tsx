import {useState, type ReactNode} from 'react';
import {Icon} from './icons';
import './AnnouncementBar.css';

export type AnnouncementBarProps = {
  children: ReactNode;
  dismissible?: boolean;
  dismissLabel: string;
  /** Controlled dismissed state (stories). */
  dismissed?: boolean;
  onDismiss?: () => void;
  className?: string;
};

/** One line on the brand surface (ice text on blue). Dismissible; never stacks with another bar. */
export function AnnouncementBar({children, dismissible = true, dismissLabel, dismissed, onDismiss, className = ''}: AnnouncementBarProps) {
  const [local, setLocal] = useState(false);
  const gone = dismissed ?? local;
  if (gone) return null;
  return (
    <div className={`announce ${className}`} role="region" aria-label="Announcement" data-surface="brand">
      <p className="announce-text">{children}</p>
      {dismissible ? (
        <button
          type="button"
          className="announce-close"
          aria-label={dismissLabel}
          onClick={() => {
            setLocal(true);
            onDismiss?.();
          }}
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}
