import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from 'react';

export type OverlayName = 'menu' | 'cart' | 'size-guide' | 'zoom' | null;
export type ToastItem = {id: number; message: string; kind?: 'added-to-cart' | 'generic'};

type OverlayState = {
  open: OverlayName;
  setOpen: (name: OverlayName) => void;
  close: () => void;
  toasts: ToastItem[];
  toast: (message: string, kind?: ToastItem['kind']) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<OverlayState | null>(null);

/** One overlay at a time (menu, cart drawer, modals) plus a toast queue. Brand-agnostic. */
export function OverlayProvider({children, initialOpen = null}: {children: ReactNode; initialOpen?: OverlayName}) {
  const [open, setOpenState] = useState<OverlayName>(initialOpen);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const setOpen = useCallback((name: OverlayName) => setOpenState(name), []);
  const close = useCallback(() => setOpenState(null), []);
  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((message: string, kind: ToastItem['kind'] = 'generic') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, {id, message, kind}]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  const value = useMemo(() => ({open, setOpen, close, toasts, toast, dismissToast}), [open, setOpen, close, toasts, toast, dismissToast]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOverlay(): OverlayState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOverlay needs an OverlayProvider');
  return v;
}
