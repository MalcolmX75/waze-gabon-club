'use client';

import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';

export default function Download() {
  const { t } = useTranslation();

  return (
    <section id="download" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-badge" style={{ background: `${C.green}15`, color: C.green }}>{t('download.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
            {t('download.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 520, margin: '12px auto 0', lineHeight: 1.8 }}>{t('download.subtitle')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { emoji: '\u{1F34E}', title: 'iPhone & iPad', store: t('download.ios'), req: 'iOS 15+ \u00B7 CarPlay', url: CONFIG.waze.appStoreUrl, bg: `linear-gradient(135deg, ${C.waze}, ${C.blue})` },
            { emoji: '\u{1F916}', title: 'Android', store: t('download.android'), req: 'Android 10+ \u00B7 Android Auto', url: CONFIG.waze.playStoreUrl, bg: `linear-gradient(135deg, ${C.green}, #00c853)` },
          ].map((d) => (
            <div key={d.title} className="card-lift" style={{ background: '#fff', borderRadius: 24, padding: '36px 28px', textAlign: 'center', border: '1px solid #eee' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{d.emoji}</div>
              <h3 className="heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{d.title}</h3>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 4 }}>{d.store}</p>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>{d.req}</p>
              <a href={d.url} {...externalLinkProps} className="waze-btn"
                style={{ background: d.bg, color: '#fff', width: '100%', justifyContent: 'center' }}>
                {t('download.cta')} {'\u2197'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
