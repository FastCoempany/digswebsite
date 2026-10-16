import type {Route} from './+types/dev.tokens';
import {TokensPage} from '~/components/pages/TokensPage';

export const meta: Route.MetaFunction = () => [{title: 'digs · tokens'}, {name: 'robots', content: 'noindex'}];

/** Phase 0 done-criterion: `npm run dev` shows a token test page. */
export default function Tokens() {
  return <TokensPage />;
}
