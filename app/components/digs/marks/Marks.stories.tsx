import type {Meta, StoryObj} from '@storybook/react-vite';
import {Brandmark, Lockup, Script, Wordmark} from './index';
import scriptIndex from '~/assets/script/index.json';

const meta: Meta = {
  title: 'Foundation/Marks',
  parameters: {layout: 'padded'},
};
export default meta;

export const WordmarkBlueOnIce: StoryObj = {
  name: 'Wordmark · blue on ice',
  render: () => <Wordmark color="blue" height="64px" />,
};

export const WordmarkIceOnBlue: StoryObj = {
  name: 'Wordmark · ice on blue',
  parameters: {surface: 'brand'},
  render: () => <Wordmark color="ice" height="64px" />,
};

export const WordmarkIceOnBlack: StoryObj = {
  name: 'Wordmark · ice on black',
  parameters: {surface: 'dark'},
  render: () => <Wordmark color="ice" height="64px" />,
};

export const WordmarkEdgeToEdge: StoryObj = {
  name: 'Wordmark · edge to edge',
  parameters: {padded: false},
  render: () => <Wordmark color="blue" edgeToEdge />,
};

export const LockupInlineOnLight: StoryObj = {
  name: 'Lockup · inline on ice',
  render: () => <Lockup layout="inline" surface="light" width="320px" />,
};

export const LockupInlineOnBlue: StoryObj = {
  name: 'Lockup · inline on blue',
  parameters: {surface: 'brand'},
  render: () => <Lockup layout="inline" surface="blue" width="320px" />,
};

export const LockupStackedOnBlue: StoryObj = {
  name: 'Lockup · stacked on blue',
  parameters: {surface: 'brand'},
  render: () => <Lockup layout="stacked" surface="blue" width="220px" />,
};

export const LockupInlineOnDark: StoryObj = {
  name: 'Lockup · inline on black',
  parameters: {surface: 'dark'},
  render: () => <Lockup layout="inline" surface="dark" width="320px" />,
};

export const LockupStackedOnLight: StoryObj = {
  name: 'Lockup · stacked on ice',
  render: () => <Lockup layout="stacked" surface="light" width="220px" />,
};

export const BrandmarkTriad: StoryObj = {
  name: 'Brandmark · blue, black, ice',
  render: () => (
    <div style={{display: 'flex', gap: 'var(--space-5)', alignItems: 'center'}}>
      <Brandmark color="blue" size="64px" />
      <Brandmark color="black" size="64px" />
      <span style={{background: 'var(--color-surface-inverse)', padding: 'var(--space-3)'}}>
        <Brandmark color="ice" size="64px" />
      </span>
    </div>
  ),
};

export const ScriptInline: StoryObj = {
  name: 'Script · inline in a headline',
  render: () => (
    <p className="type-display">
      Dope is <Script word="good" />.
    </p>
  ),
};

export const ScriptDrawOn: StoryObj = {
  name: 'Script · draw-on (600ms, off under reduced motion)',
  render: () => (
    <p className="type-display">
      Wear your <Script word="story" drawOn />.
    </p>
  ),
};

export const ScriptAllWords: StoryObj = {
  name: 'Script · every word',
  render: () => (
    <ul className="type-h2" style={{display: 'grid', gap: 'var(--space-4)'}}>
      {Object.keys(scriptIndex).map((w) => (
        <li key={w}>
          <Script word={w} /> <code className="type-micro">{w}</code>
        </li>
      ))}
    </ul>
  ),
};

export const ScriptOnDark: StoryObj = {
  name: 'Script · on black (currentColor)',
  parameters: {surface: 'dark'},
  render: () => (
    <p className="type-display">
      Wear your <Script word="ambition" />.
    </p>
  ),
};
