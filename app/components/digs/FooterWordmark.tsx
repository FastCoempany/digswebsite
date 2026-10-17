import {Wordmark} from './marks/Wordmark';
import './FooterWordmark.css';

/** The edge-to-edge wordmark that closes every page (BOAST "do"). Blue on ice, or ice on black. */
export function FooterWordmark({tone = 'light', className = ''}: {tone?: 'light' | 'dark'; className?: string}) {
  return (
    <div className={`footmark footmark-${tone} ${className}`} data-surface={tone === 'dark' ? 'dark' : undefined}>
      <Wordmark color={tone === 'dark' ? 'ice' : 'blue'} edgeToEdge label="digs" />
    </div>
  );
}
