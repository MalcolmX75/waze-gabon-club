import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';

export default function FloatingWhatsApp() {
  return (
    <a href={CONFIG.links.whatsapp} {...externalLinkProps}
      style={{
        position: 'fixed', bottom: 24, right: 24,
        width: 60, height: 60, borderRadius: '50%',
        background: C.whatsapp, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 6px 24px ${C.whatsapp}50`, zIndex: 999,
        fontSize: 28, textDecoration: 'none',
        animation: 'pulse 3s ease-in-out infinite',
      }}>
      {'\u{1F4AC}'}
    </a>
  );
}
