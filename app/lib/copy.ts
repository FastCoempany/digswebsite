/** Typed access to the site copy. Nothing is typed straight into a component (08-copy.md). */
import en from '../../content/copy/en.json';

export type Copy = typeof en;
export const copy: Copy = en;

/** Resolve a draft-or-string field ("status": "draft" lines wait for the founder). */
export function text(field: string | {status?: string; text: string}): string {
  return typeof field === 'string' ? field : field.text;
}

export function isDraft(field: string | {status?: string; text: string}): boolean {
  return typeof field !== 'string' && field.status === 'draft';
}

/** Replace `{name}` placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`));
}
