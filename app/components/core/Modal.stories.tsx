import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {Modal, type ModalProps} from './Modal';
import {Button} from './Button';
import {SizeChart} from './SizeChart';
import {MediaSlot} from './MediaSlot';
import {PRODUCTS, digs, photoFor, srcSetFor} from '~/lib/mock';
import {copy, text} from '~/lib/copy';

/**
 * Modal (05-components.md, Core): size-guide and generic. States: open, closing. Native
 * <dialog>: focus trapped by the browser, Esc closes, backdrop click closes, 300ms in and out.
 */
const thermal = PRODUCTS[0];
const chart = digs.sizeChart(thermal);
if (!chart) throw new Error('size chart metafield missing from the mock product');
const CHART_LABELS = {units: copy.a11y.unitToggle, inches: copy.a11y.inches, centimetres: copy.a11y.centimetres, measurement: copy.product.measurementsHeadNoSize, laidFlat: copy.a11y.laidFlat, note: copy.product.sizeNoteLaidFlat};
const photo = photoFor('P-TLS-01', 'Off White');

const meta = {
  title: 'Core/Modal',
  component: Modal,
  // Every story renders through the Stateful wrapper below; these satisfy the required props.
  args: {open: true, onClose: () => undefined, title: copy.cta.sizeGuide, closeLabel: copy.a11y.close, children: null},
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Forced mid-transition look for the closing state (tokens only): the two properties Modal.css animates, held halfway. */
const FORCED = `
.modal.is-open.story-closing { opacity: 0.5; transform: translateY(var(--space-2)); }
`;

/** Open at render (or on the trigger), closes for real so Esc and the close button work. */
function Stateful({initial, trigger, ...props}: Omit<ModalProps, 'open' | 'onClose'> & {initial: boolean; trigger: string}) {
  const [open, setOpen] = useState(initial);
  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const genericBody = (
  <div style={{display: 'grid', gap: 'var(--space-4)'}}>
    <p>{text(copy.pages.shippingReturns.intro)}</p>
    {copy.pages.shippingReturns.sections.map((s) => (
      <div key={s.title}>
        <h3 className="type-h3">{s.title}</h3>
        <p>{text(s.body)}</p>
      </div>
    ))}
  </div>
);

export const GenericOpen: Story = {
  name: 'Generic · open (md)',
  render: () => (
    <Stateful initial trigger={copy.pages.shippingReturns.head} title={copy.pages.shippingReturns.head} closeLabel={copy.a11y.close}>
      {genericBody}
    </Stateful>
  ),
};

export const SizeGuideOpen: Story = {
  name: 'Size guide · open (lg, SizeChart inside)',
  render: () => (
    <Stateful initial trigger={copy.cta.sizeGuide} title={copy.cta.sizeGuide} closeLabel={copy.a11y.close} size="lg">
      <SizeChart title={thermal.title} sizes={chart.sizes} rows={chart.rows} selectedSize="M" note={chart.note} labels={CHART_LABELS} />
    </Stateful>
  ),
};

export const FullOpen: Story = {
  name: 'Full · image zoom (title hidden)',
  render: () => (
    <Stateful initial trigger={copy.a11y.zoomImage} title={copy.a11y.zoomImage} hideTitle closeLabel={copy.a11y.close} size="full">
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} srcSet={srcSetFor(photo?.url)} alt={photo?.altText ?? ''} fit="contain" sizes="100vw" style={{width: 'min(100vw, 80dvh)'}} />
    </Stateful>
  ),
};

export const Trigger: Story = {
  name: 'Closed · opens from a trigger',
  render: () => (
    <Stateful initial={false} trigger={copy.cta.sizeGuide} title={copy.cta.sizeGuide} closeLabel={copy.a11y.close} size="lg">
      <SizeChart title={thermal.title} sizes={chart.sizes} rows={chart.rows} note={chart.note} labels={CHART_LABELS} />
    </Stateful>
  ),
};

export const Closing: Story = {
  name: 'Closing (forced mid-transition)',
  tags: ['no-axe'],
  render: () => (
    <>
      <style>{FORCED}</style>
      <Stateful initial trigger={copy.pages.shippingReturns.head} title={copy.pages.shippingReturns.head} closeLabel={copy.a11y.close} className="story-closing">
        {genericBody}
      </Stateful>
    </>
  ),
};
