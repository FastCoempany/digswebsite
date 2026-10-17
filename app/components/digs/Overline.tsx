import type {ReactNode} from 'react';
import './digs.css';

/** Micro caps label above a section ("CAPSULE 01"), with the d!gs dot as its bullet. */
export function Overline({children, tone = 'default', className = '', as: Tag = 'p'}: {children: ReactNode; tone?: 'default' | 'on-dark' | 'on-brand'; className?: string; as?: 'p' | 'span' | 'div'}) {
  return (
    <Tag className={`overline overline-${tone} type-micro type-caps ${className}`}>
      <span className="overline-dot" aria-hidden="true" />
      {children}
    </Tag>
  );
}
