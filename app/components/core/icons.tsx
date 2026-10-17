import type {SVGProps} from 'react';

export type IconName = 'menu' | 'close' | 'plus' | 'minus' | 'chevron-left' | 'chevron-right' | 'chevron-down' | 'arrow-right' | 'check' | 'zoom';

const PATHS: Record<IconName, string> = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M5 5l14 14M19 5L5 19',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'chevron-left': 'M15 5l-7 7 7 7',
  'chevron-right': 'M9 5l7 7-7 7',
  'chevron-down': 'M5 9l7 7 7-7',
  'arrow-right': 'M4 12h16m-6-6 6 6-6 6',
  check: 'M5 12l5 5L20 7',
  zoom: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4M11 8v6M8 11h6',
};

/** Hairline UI icons, 24px grid, stroke follows currentColor. Decorative by default. */
export function Icon({name, size = 24, ...rest}: {name: IconName; size?: number} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
