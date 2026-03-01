'use client';

import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <section id="privacy" style={{ padding: '80px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 750, margin: '0 auto' }}>
        <h2 className="heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 24 }}>
          {t('privacy.title')}
        </h2>
        {['intro', 'collected', 'purpose', 'thirdParty', 'storage', 'notCollected', 'localStorage', 'contact'].map((key) => (
          <p key={key} style={{ color: C.muted, lineHeight: 1.8, marginBottom: 16, fontSize: 15 }}>
            {t(`privacy.${key}`)}
          </p>
        ))}
      </div>
    </section>
  );
}
