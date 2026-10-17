import type {Meta, StoryObj} from '@storybook/react-vite';
import {TokensPage} from './TokensPage';

const meta: Meta<typeof TokensPage> = {title: 'Foundation/Tokens', component: TokensPage};
export default meta;

export const AllTokens: StoryObj<typeof TokensPage> = {name: 'All tokens'};
