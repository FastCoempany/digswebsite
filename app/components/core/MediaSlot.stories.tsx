import type {Meta, StoryObj} from '@storybook/react-vite';
import {MediaSlot} from './MediaSlot';
import {Badge} from './Badge';
import {photoFor, srcSetFor} from '~/lib/mock';
import {copy} from '~/lib/copy';

/**
 * MediaSlot (05-components.md, Core): every image goes through it with an explicit ratio and
 * shot code, so layout never jumps and wireframe mode can label the slot
 * (`data-media-slot="4:5 · P-TLS-01"`). States: loaded, loading, error, placeholder; switch the
 * Mode toolbar to Wireframe for the wire state.
 */
const meta = {
  title: 'Core/MediaSlot',
  component: MediaSlot,
  args: {ratio: '4:5', code: 'P-TLS-01'},
} satisfies Meta<typeof MediaSlot>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Approved photography only (assets/photography via the manifest). */
const photo = photoFor('P-TLS-01', 'Off White');
const back = photoFor('P-TLS-02', 'Off White');
const hero916 = photoFor('H-01', null, '9:16');
const hero169 = photoFor('H-01', null, '16:9');

function Frame({children, width = '20rem'}: {children: React.ReactNode; width?: string}) {
  return <div style={{maxWidth: width}}>{children}</div>;
}

export const Loaded: Story = {
  name: 'Loaded · P-TLS-01 Off White (approved photo)',
  render: () => (
    <Frame>
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} srcSet={srcSetFor(photo?.url)} sizes="(min-width: 1024px) 25vw, 100vw" alt={photo?.altText ?? ''} priority />
    </Frame>
  ),
};

export const Loading: Story = {
  name: 'Loading (state="loading")',
  render: () => (
    <Frame>
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} srcSet={srcSetFor(photo?.url)} alt={photo?.altText ?? ''} state="loading" />
    </Frame>
  ),
};

export const ErrorState: Story = {
  name: 'Error (state="error") · falls back to the labelled placeholder',
  render: () => (
    <Frame>
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} alt={photo?.altText ?? ''} state="error" />
    </Frame>
  ),
};

export const Placeholder: Story = {
  name: 'Placeholder · no image yet (P-TLS-03, side)',
  render: () => (
    <Frame>
      <MediaSlot ratio="4:5" code="P-TLS-03" image={null} />
    </Frame>
  ),
};

export const Ratios: Story = {
  name: 'Ratios · 9:16 and 16:9 hero crops, 3:4 and 4:5 placeholders',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', alignItems: 'start'}}>
      <MediaSlot ratio="9:16" code="H-01" image={hero916} srcSet={srcSetFor(hero916?.url)} alt={hero916?.altText ?? ''} />
      <MediaSlot ratio="16:9" code="H-01" image={hero169} srcSet={srcSetFor(hero169?.url)} alt={hero169?.altText ?? ''} />
      <MediaSlot ratio="3:4" code="E-04" image={null} />
      <MediaSlot ratio="4:5" code="P-TLS-04" image={null} />
    </div>
  ),
};

export const AllStates: Story = {
  name: 'All states · loaded / loading / error / placeholder',
  render: () => (
    <div style={{display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'}}>
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} srcSet={srcSetFor(photo?.url)} alt={photo?.altText ?? ''} />
      <MediaSlot ratio="4:5" code="P-TLS-02" image={back} srcSet={srcSetFor(back?.url)} alt={back?.altText ?? ''} state="loading" />
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} alt={photo?.altText ?? ''} state="error" />
      <MediaSlot ratio="4:5" code="P-TLS-03" image={null} />
    </div>
  ),
};

export const WithOverlay: Story = {
  name: 'With overlay content (badge in the slot)',
  render: () => (
    <Frame>
      <MediaSlot ratio="4:5" code="P-TLS-01" image={photo} srcSet={srcSetFor(photo?.url)} alt={photo?.altText ?? ''}>
        <span style={{position: 'absolute', left: 'var(--space-3)', top: 'var(--space-3)'}}>
          <Badge status="coming-soon">{copy.product.comingSoon}</Badge>
        </span>
      </MediaSlot>
    </Frame>
  ),
};

export const Contain: Story = {
  name: 'fit="contain" (zoom view)',
  render: () => (
    <Frame width="24rem">
      <MediaSlot ratio="1:1" code="P-TLS-01" image={photo} srcSet={srcSetFor(photo?.url)} alt={photo?.altText ?? ''} fit="contain" style={{background: 'var(--color-surface-raised)'}} />
    </Frame>
  ),
};
