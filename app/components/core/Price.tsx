import './Price.css';

export type Money = {amount: string; currencyCode: string} | null | undefined;

export type PriceProps = {
  price: Money;
  compareAtPrice?: Money;
  /** "From" prefix for ranges on cards. */
  from?: boolean;
  labels: {tba: string; from?: string; sale?: string; regular?: string};
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function formatMoney(m: NonNullable<Money>, locale = 'en-US') {
  const n = Number(m.amount);
  return new Intl.NumberFormat(locale, {style: 'currency', currency: m.currencyCode, minimumFractionDigits: n % 1 === 0 ? 0 : 2}).format(n);
}

/** Reads `price: null` as the TBA label (decision O1). Sale shows the struck regular price first. */
export function Price({price, compareAtPrice, from, labels, size = 'md', className = ''}: PriceProps) {
  if (!price) {
    return <span className={`price price-${size} price-tba ${className}`}>{labels.tba}</span>;
  }
  const onSale = compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);
  return (
    <span className={`price price-${size} ${onSale ? 'price-on-sale' : ''} ${className}`}>
      {from && labels.from ? <span className="price-from">{labels.from} </span> : null}
      {onSale && compareAtPrice ? (
        <>
          <span className="visually-hidden">{labels.regular ?? ''} </span>
          <s className="price-compare">{formatMoney(compareAtPrice)}</s>{' '}
          <span className="visually-hidden">{labels.sale ?? ''} </span>
        </>
      ) : null}
      <span className="price-amount">{formatMoney(price)}</span>
    </span>
  );
}
