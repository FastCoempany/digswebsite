import {useState, type FormEvent} from 'react';
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
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
  };
  if (status === 'success') {
    return (
      <p className={`newsletter newsletter-${variant} newsletter-success ${className}`} role="status">
        {labels.success}
      </p>
    );
  }
  return (
    <form className={`newsletter newsletter-${variant} ${className}`} onSubmit={submit} noValidate aria-busy={status === 'submitting' || undefined}>
      <Field type="email" name="email" label={labels.email} hideLabel placeholder={labels.placeholder} autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={status === 'error' ? labels.error : null} disabled={status === 'submitting'} />
      <Button type="submit" variant={onDark ? 'on-dark' : 'primary'} loading={status === 'submitting'} className="newsletter-btn">
        {labels.submit}
      </Button>
    </form>
  );
}
