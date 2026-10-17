import {useState} from 'react';
import {Link} from '~/components/core/Link';
import {NewsletterForm, type NewsletterStatus} from '~/components/core/NewsletterForm';
import {FooterWordmark} from '~/components/digs/FooterWordmark';
import {Lockup} from '~/components/digs/marks/Lockup';
import {Script} from '~/components/digs/marks/Script';
import {copy} from '~/lib/copy';
import './chrome.css';

const LINKS: Record<string, string> = {
  'The Capsule': '/collections/all',
  'Size guide': '/pages/size-guide',
  'Shipping & returns': '/pages/shipping-returns',
  FAQ: '/pages/faq',
  Contact: '/pages/contact',
  Manifesto: '/pages/manifesto',
  Instagram: copy.brand.instagramUrl,
  Privacy: '/policies/privacy-policy',
  Terms: '/policies/terms-of-service',
  Accessibility: '/pages/accessibility',
};

/** Four short groups, the "Stay dope" sign-up, @dopeisgood, ©, then the edge-to-edge wordmark. */
export function SiteFooter({year = 2026, newsletterStatus}: {year?: number; newsletterStatus?: NewsletterStatus}) {
  const [status, setStatus] = useState<NewsletterStatus>(newsletterStatus ?? 'idle');
  const submit = (email: string) => {
    // UI only in this phase: a well-formed address reads as success, anything else as the error state.
    setStatus(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? 'success' : 'error');
  };
  return (
    <footer className="foot" aria-labelledby="foot-head">
      <h2 id="foot-head" className="visually-hidden">
        {copy.a11y.footerNav}
      </h2>
      <div className="foot-inner">
        <div className="foot-brand">
          <Lockup layout="stacked" surface="light" width="140px" />
          <p className="foot-ethos type-h3">
            Dope is <Script word="good" scale={1.4} />.
          </p>
        </div>
        <nav className="foot-groups" aria-label={copy.a11y.footerNav}>
          {Object.entries(copy.footer.groups).map(([group, items]) => (
            <div key={group} className="foot-group">
              <h3 className="foot-group-head type-micro type-caps">{group}</h3>
              <ul>
                {items.map((label) => (
                  <li key={label}>
                    <Link to={LINKS[label] ?? '/'} variant="footer" external={label === 'Instagram'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="foot-news">
          <h3 className="foot-news-head type-h3">{copy.footer.newsletterHead}</h3>
          <p className="type-small foot-news-sub">{copy.home.newsletterHead}</p>
          <NewsletterForm variant="footer" status={status} onSubmit={submit} labels={{email: copy.a11y.email, placeholder: copy.a11y.emailPlaceholder, submit: copy.cta.newsletter, success: copy.home.newsletterSuccess, error: copy.home.newsletterError}} />
        </div>
        <div className="foot-meta type-small">
          <a href={copy.brand.instagramUrl} target="_blank" rel="noreferrer" className="foot-handle">
            {copy.brand.instagram}
          </a>
          <span>{copy.brand.domain}</span>
          <span>{copy.brand.labelLine}</span>
          <span>{copy.footer.copyright.replace('{year}', String(year))}</span>
        </div>
      </div>
      <FooterWordmark tone="light" />
    </footer>
  );
}
