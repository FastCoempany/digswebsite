import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {IconButton} from './IconButton';
import {useFocusTrap} from './useFocusTrap';
import './Modal.css';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (image zoom). */
  hideTitle?: boolean;
  closeLabel: string;
  size?: 'md' | 'lg' | 'full';
  children: ReactNode;
  className?: string;
};

/**
 * Native <dialog> modal: focus is trapped by the browser, Esc closes, backdrop click closes.
 * Opens/closes over 300ms (instant under reduced motion).
 */
export function Modal({open, onClose, title, hideTitle, closeLabel, size = 'md', children, className = ''}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useFocusTrap(ref, open);
  const titleId = useId();
  // Children mount while the modal is open (and through the closing transition), so closed
  // modals add nothing to the server HTML.
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      setMounted(true);
      el.showModal();
      el.classList.add('is-open');
    } else if (!open && el.open) {
      el.classList.remove('is-open');
      el.classList.add('is-closing');
      const done = () => {
        el.classList.remove('is-closing');
        el.close();
        setMounted(false);
      };
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const t = setTimeout(done, reduced ? 0 : 300);
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
    <dialog ref={ref} className={`modal modal-${size} ${className}`} aria-labelledby={titleId} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <header className="modal-head">
          <h2 id={titleId} className={`modal-title type-h3 ${hideTitle ? 'visually-hidden' : ''}`}>{title}</h2>
          <IconButton icon="close" label={closeLabel} onClick={onClose} className="modal-close" />
        </header>
        <div className="modal-body">{mounted ? children : null}</div>
      </div>
    </dialog>
  );
}
