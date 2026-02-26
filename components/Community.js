'use client';

import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';
import { COMMUNITY_CARDS, STEP_COLORS } from '@/lib/data';

export default function Community() {
  const { t } = useTranslation();

  const communityLink = (key) => {
    if (key === 'editor') return CONFIG.waze.editorUrl;
    return CONFIG.links[key];
  };

  return (
    <section id="community" style={{ padding: '100px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-badge" style={{ background: `${C.facebook}15`, color: C.facebook }}>{t('community.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            {t('community.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
            {t('community.subtitle')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {COMMUNITY_CARDS.map((card) => (
            <div key={card.key} className="card-lift" style={{
              background: card.gradient, borderRadius: 24, padding: '40px 28px', color: '#fff',
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
              <h3 className="heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
                {t(`community.${card.key}.title`)}
              </h3>
              <p style={{ opacity: .85, lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
                {t(`community.${card.key}.desc`)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, opacity: .75, marginBottom: 24 }}>
                {[1, 2, 3].map((n) => (
                  <span key={n}>{t(`community.${card.key}.feature${n}`)}</span>
                ))}
              </div>
              <a href={communityLink(card.key)} {...externalLinkProps}
                className="waze-btn" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }}>
                {t(card.cta)} {'\u2197'}
              </a>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 48, background: '#fff', borderRadius: 24,
          padding: '48px 36px', border: '1px solid #eee',
        }}>
          <h3 className="heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 36, textAlign: 'center' }}>
            {'\u{1F3AF}'} {t('community.steps.title')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${STEP_COLORS[n - 1]}, ${STEP_COLORS[n - 1]}bb)`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 22, margin: '0 auto 14px',
                  fontFamily: "'Outfit', sans-serif",
                }}>{n}</div>
                <h4 className="heading" style={{ fontWeight: 700, marginBottom: 6 }}>
                  {t(`community.steps.step${n}`)}
                </h4>
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
                  {t(`community.steps.step${n}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
