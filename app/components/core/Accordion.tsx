import {useId, useState, type ReactNode} from 'react';
import {Icon} from './icons';
import './Accordion.css';

export type AccordionItem = {id: string; title: string; content: ReactNode};

export type AccordionProps = {
  items: AccordionItem[];
  /** Ids open at first render. */
  defaultOpen?: string[];
  /** One open at a time. */
  single?: boolean;
  /** Heading level of the triggers (default h3). */
  headingLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
};

/** Disclosure list: button with aria-expanded controlling a region. */
export function Accordion({items, defaultOpen = [], single = false, headingLevel: H = 'h3', className = ''}: AccordionProps) {
  const base = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : single ? [id] : [...cur, id]));
  return (
    <div className={`accordion ${className}`}>
      {items.map((item) => {
        const expanded = open.includes(item.id);
        const hid = `${base}-${item.id}-h`;
        const pid = `${base}-${item.id}-p`;
        return (
          <div key={item.id} className={`accordion-item ${expanded ? 'is-open' : ''}`}>
            <H className="accordion-heading">
              <button type="button" id={hid} className="accordion-trigger" aria-expanded={expanded} aria-controls={pid} onClick={() => toggle(item.id)}>
                <span>{item.title}</span>
                <Icon name="chevron-down" size={20} className="accordion-chevron" />
              </button>
            </H>
            <div id={pid} role="region" aria-labelledby={hid} className="accordion-panel" hidden={!expanded}>
              <div className="accordion-body">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
