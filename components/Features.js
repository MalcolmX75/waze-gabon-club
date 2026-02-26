'use client';

import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { FEATURES } from '@/lib/data';

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" style={{ padding: '100px 24px', background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="section-badge" style={{ background: `${C.waze}15`, color: C.blue }}>{t('features.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            {t('features.title')}
          </h2>
          <p style={{ color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
            {t('features.subtitle')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.key} className="card-lift" style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #f0f0f0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${f.color}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, fontSize: 28,
              }}>{f.icon}</div>
              <h3 className="heading" style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{t(`features.${f.key}.title`)}</h3>
              <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 15 }}>{t(`features.${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
