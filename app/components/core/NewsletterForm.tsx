import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Button} from './Button';
import {Field} from './Field';
import './NewsletterForm.css';

export type NewsletterStatus = 'idle' | 'submitting' | 'success' | 'error';

export type NewsletterFormProps = {
  variant?: 'inline' | 'footer';
  status?: NewsletterStatus;
  labels: {email: string; placeholder: string; submit: string; success: string; error: string};
  /** UI only in this phase: the handler receives the email and decides the next status. */
  onSubmit?: (email: string) => void;
  onDark?: boolean;
  className?: string;
};

/** Email + "Stay dope" button. Success and error are announced; nothing is wired yet. */
export function NewsletterForm({variant = 'inline', status = 'idle', labels, onSubmit, onDark, className = ''}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const statusRef = useRef<HTMLParagraphElement>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
  };
  // The form stays mounted through every status; on success focus moves to the confirmation.
  useEffect(() => {
    if (status === 'success') statusRef.current?.focus();
  }, [status]);
  const done = status === 'success';
  return (
    <form className={`newsletter newsletter-${variant} ${done ? 'is-done' : ''} ${className}`} onSubmit={submit} noValidate aria-busy={status === 'submitting' || undefined}>
      {!done ? (
        <>
          <Field type="email" name="email" label={labels.email} hideLabel placeholder={labels.placeholder} autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={status === 'error' ? labels.error : null} disabled={status === 'submitting'} />
          <Button type="submit" variant={onDark ? 'on-dark' : 'primary'} loading={status === 'submitting'} className="newsletter-btn">
            {labels.submit}
          </Button>
        </>
      ) : null}
      <p ref={statusRef} tabIndex={-1} className="newsletter-success" role="status">
        {done ? labels.success : ''}
      </p>
    </form>
  );
}
