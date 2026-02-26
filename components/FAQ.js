'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { FAQ_COUNT } from '@/lib/data';

export default function FAQ() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section id="faq" style={{ padding: '100px 24px', background: C.bg }}>
      <div style={{ maxWidth: 750, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-badge" style={{ background: '#7c3aed15', color: '#7c3aed' }}>{t('faq.badge')}</span>
          <h2 className="heading" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800 }}>
            {t('faq.title')}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: FAQ_COUNT }, (_, i) => i).map((i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, overflow: 'hidden',
              border: `1px solid ${openFaq === i ? C.waze + '40' : '#eee'}`,
              transition: 'all .3s ease',
            }}>
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {t(`faq.q${i + 1}.question`)}
                <span style={{
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform .3s ease', color: C.waze, flexShrink: 0, marginLeft: 12,
                }}>{'\u25BC'}</span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 24px 20px', color: C.muted,
                  lineHeight: 1.75, fontSize: 15, animation: 'fadeIn .3s ease',
                }}>
                  {t(`faq.q${i + 1}.answer`)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
