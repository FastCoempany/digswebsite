import {copy, fill, isDraft, text} from '~/lib/copy';
import './Draftable.css';

export type DraftField = string | {status?: string; text: string};

/**
 * A copy line from en.json. While the line is still marked "draft" (08-copy.md: it waits for the
 * founder), a small flag follows it so review screens show what is and isn't final.
 */
export function Draftable({field, values}: {field: DraftField; values?: Record<string, string | number>}) {
  const s = values ? fill(text(field), values) : text(field);
  return (
    <>
      {s}
      {isDraft(field) ? <span className="draft-flag">{copy.a11y.draftFlag}</span> : null}
    </>
  );
}
