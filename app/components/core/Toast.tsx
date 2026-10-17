import {useEffect, useState} from 'react';
import {Icon} from './icons';
import type {ToastItem} from './OverlayProvider';
import './Toast.css';

export type ToastProps = {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
  dismissLabel: string;
  /** Force the exit animation (stories). */
  exiting?: boolean;
};

/** Polite live region. Enter/exit slide over 300ms; instant under reduced motion. */
export function ToastRegion({toasts, onDismiss, dismissLabel, exiting}: ToastProps) {
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false" role="status">
      {toasts.map((t) => (
        <Toast key={t.id} item={t} onDismiss={onDismiss} dismissLabel={dismissLabel} exiting={exiting} />
      ))}
    </div>
  );
}

function Toast({item, onDismiss, dismissLabel, exiting}: {item: ToastItem; onDismiss: (id: number) => void; dismissLabel: string; exiting?: boolean}) {
  const [phase, setPhase] = useState<'enter' | 'shown' | 'exit'>(exiting ? 'exit' : 'enter');
  useEffect(() => {
    if (exiting) return;
    const t = requestAnimationFrame(() => setPhase('shown'));
    return () => cancelAnimationFrame(t);
  }, [exiting]);
  const dismiss = () => {
    setPhase('exit');
    setTimeout(() => onDismiss(item.id), 300);
  };
  return (
    <div className={`toast toast-${item.kind ?? 'generic'} is-${phase}`}>
      <span className="toast-dot" aria-hidden="true" />
      <span className="toast-text">{item.message}</span>
      <button type="button" className="toast-close" aria-label={dismissLabel} onClick={dismiss}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
