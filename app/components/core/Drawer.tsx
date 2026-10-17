import {useEffect, useId, useRef, type ReactNode} from 'react';
import {IconButton} from './IconButton';
import {useFocusTrap} from './useFocusTrap';
import './Drawer.css';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Accessible name when the title is a graphic. */
  label?: string;
  closeLabel: string;
  /** right: 420px panel on desktop, full screen on mobile · full: full screen everywhere (menu). */
  side?: 'right' | 'full';
  /** Surface for the full variant (the menu is ice; the cart is raised white). */
  tone?: 'raised' | 'page';
  children: ReactNode;
  footer?: ReactNode;
  /** Rendered inside the dialog (top layer) outside the panel: fixed overlays such as toasts. */
  slot?: ReactNode;
  /** Called once the dialog has actually closed (after the closing transition). */
  onClosed?: () => void;
  className?: string;
  id?: string;
};

/** Native <dialog> drawer: slides in over 300ms, focus trapped by the browser, Esc closes. */
export function Drawer({open, onClose, title, label, closeLabel, side = 'right', tone = 'raised', children, footer, slot, onClosed, className = '', id}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useFocusTrap(ref, open);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      requestAnimationFrame(() => el.classList.add('is-open'));
    } else if (!open && el.open) {
      el.classList.remove('is-open');
      el.classList.add('is-closing');
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t = setTimeout(() => {
        el.classList.remove('is-closing');
        el.close();
        onClosed?.();
      }, reduced ? 0 : 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener('cancel', onCancel);
    return () => el.removeEventListener('cancel', onCancel);
  }, [onClose]);
  return (
    <dialog ref={ref} id={id} className={`drawer drawer-${side} drawer-${tone} ${className}`} aria-label={label} aria-labelledby={label ? undefined : titleId} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer-panel">
        <header className="drawer-head">
          <div className="drawer-title" id={titleId}>{title}</div>
          <IconButton icon="close" label={closeLabel} onClick={onClose} className="drawer-close" />
        </header>
        <div className="drawer-body">{children}</div>
        {footer ? <footer className="drawer-foot">{footer}</footer> : null}
      </div>
      {slot}
    </dialog>
  );
}
