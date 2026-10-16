import type {Decorator, Preview} from '@storybook/react-vite';
import {useEffect} from 'react';
import {MemoryRouter} from 'react-router';
import '../app/styles/app.css';

/** Every story renders in UI or wireframe mode (toolbar), at 390 or 1440 (viewport toolbar). */
const withMode: Decorator = (Story, context) => {
  const mode = (context.globals.mode as string) || 'ui';
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);
  return <Story />;
};

const withRouter: Decorator = (Story) => (
  <MemoryRouter initialEntries={['/']}>
    <Story />
  </MemoryRouter>
);

const withSurface: Decorator = (Story, context) => {
  const surface = (context.parameters.surface as string) || 'page';
  const bg =
    surface === 'dark'
      ? 'var(--color-surface-inverse)'
      : surface === 'brand'
        ? 'var(--color-surface-brand)'
        : surface === 'raised'
          ? 'var(--color-surface-raised)'
          : 'var(--color-surface-page)';
  const fg = surface === 'dark' ? 'var(--color-text-on-inverse)' : surface === 'brand' ? 'var(--color-text-on-brand)' : 'var(--color-text-primary)';
  return (
    <div data-surface={surface === 'page' || surface === 'raised' ? undefined : surface} style={{background: bg, color: fg, minHeight: '100%', padding: context.parameters.padded === false ? 0 : 'var(--space-5)'}}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withSurface, withRouter, withMode],
  globalTypes: {
    mode: {
      description: 'UI or wireframe mode',
      toolbar: {title: 'Mode', icon: 'contrast', items: [{value: 'ui', title: 'UI'}, {value: 'wire', title: 'Wireframe'}], dynamicTitle: true},
    },
  },
  initialGlobals: {mode: 'ui', viewport: {value: 'mobile390', isRotated: false}},
  parameters: {
    layout: 'fullscreen',
    backgrounds: {disable: true},
    viewport: {
      options: {
        mobile390: {name: 'Mobile 390', styles: {width: '390px', height: '844px'}, type: 'mobile'},
        tablet768: {name: 'Tablet 768', styles: {width: '768px', height: '1024px'}, type: 'tablet'},
        desktop1024: {name: 'Desktop 1024', styles: {width: '1024px', height: '768px'}, type: 'desktop'},
        desktop1440: {name: 'Desktop 1440', styles: {width: '1440px', height: '900px'}, type: 'desktop'},
      },
    },
    a11y: {
      test: 'error',
      config: {rules: [{id: 'region', enabled: false}]},
    },
    controls: {expanded: true},
    options: {
      storySort: {order: ['Foundation', 'Core', 'DIGS', 'Pages']},
    },
  },
};

export default preview;
