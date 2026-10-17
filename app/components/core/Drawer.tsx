import {useEffect, useRef, type ReactNode} from 'react';
import {IconButton} from './IconButton';
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
  className?: string;
  id?: string;
};

/** Native <dialog> drawer: slides in over 300ms, focus trapped by the browser, Esc closes. */
export function Drawer({open, onClose, title, label, closeLabel, side = 'right', tone = 'raised', children, footer, className = '', id}: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
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
      }, reduced ? 0 : 300);
      return () => clearTimeout(t);
    }
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
    <dialog ref={ref} id={id} className={`drawer drawer-${side} drawer-${tone} ${className}`} aria-label={label} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer-panel">
        <header className="drawer-head">
          <div className="drawer-title">{title}</div>
          <IconButton icon="close" label={closeLabel} onClick={onClose} className="drawer-close" />
        </header>
        <div className="drawer-body">{children}</div>
        {footer ? <footer className="drawer-foot">{footer}</footer> : null}
      </div>
    </dialog>
  );
}
