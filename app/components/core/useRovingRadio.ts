import type {KeyboardEvent} from 'react';

/**
 * Roving tabindex + arrow keys for groups of role="radio" buttons (swatches, sizes, segments).
 * `move` is called with the next index; focus follows the selection, as native radios do.
 */
export function rovingRadio(i: number, count: number, selectedIndex: number, move: (next: number) => void) {
  const tabIndex = selectedIndex === -1 ? (i === 0 ? 0 : -1) : selectedIndex === i ? 0 : -1;
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : e.key === 'Home' ? -Infinity : e.key === 'End' ? Infinity : 0;
    if (!dir) return;
    e.preventDefault();
    const next = dir === -Infinity ? 0 : dir === Infinity ? count - 1 : (i + dir + count) % count;
    move(next);
    const radios = e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="radio"]');
    radios?.[next]?.focus();
  };
  return {tabIndex, onKeyDown};
}
