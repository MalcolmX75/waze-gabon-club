'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import C from '@/lib/colors';
import { CONFIG } from '@/lib/config';
import { externalLinkProps } from '@/utils/externalLink';
import { validateForm, checkHoneypot, canSubmit, markSubmitted } from '@/utils/form';

export default function RegisterModal({ show, onClose }) {
  const { t } = useTranslation();
  const [regForm, setRegForm] = useState({ name: '', email: '', wazeUser: '' });
  const [registered, setRegistered] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle');
  const [honeypot, setHoneypot] = useState('');

  const errStyle = { color: C.danger, fontSize: 12, marginTop: 4 };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!checkHoneypot(honeypot)) return;
    if (!canSubmit()) {
      setFormErrors({ _rate: true });
      return;
    }
    const { valid, errors, sanitized } = validateForm(regForm);
    if (!valid) { setFormErrors(errors); return; }
    setFormStatus('submitting');
    setFormErrors({});
    try {
      const res = await fetch(CONFIG.form.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...sanitized, _gotcha: honeypot }),
      });
      if (res.ok) {
        markSubmitted();
        setRegistered(true);
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const closeModal = () => {
    onClose();
    setRegistered(false);
    setFormStatus('idle');
    setFormErrors({});
    setRegForm({ name: '', email: '', wazeUser: '' });
  };

  if (!show) return null;

  return (
    <div className="register-modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: 40,
        maxWidth: 440, width: 'calc(100% - 48px)',
        animation: 'fadeUp .3s ease both',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {registered ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{'\u{1F389}'}</div>
            <h3 className="heading" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {t('register.success.title')}
            </h3>
            <p style={{ color: C.muted, marginBottom: 24 }}>{t('register.success.message')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={CONFIG.links.whatsapp} {...externalLinkProps} className="waze-btn waze-btn-whatsapp"
                style={{ justifyContent: 'center' }}>
                {'\u{1F4AC}'} {t('register.success.whatsapp')}
              </a>
              <a href={CONFIG.links.telegram} {...externalLinkProps} className="waze-btn"
                style={{ background: C.telegram, color: '#fff', justifyContent: 'center' }}>
                {'\u2708\u{FE0F}'} {t('register.success.telegram')}
              </a>
              <a href={CONFIG.links.facebook} {...externalLinkProps} className="waze-btn"
                style={{ background: C.facebook, color: '#fff', justifyContent: 'center' }}>
                {'\u{1F4D8}'} {t('register.success.facebook')}
              </a>
            </div>
            <button onClick={closeModal}
              style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 20, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              {t('register.close')}
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{'\u{1F1EC}\u{1F1E6}'}</div>
              <h3 className="heading" style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
                {t('register.title')}
              </h3>
              <p style={{ color: C.muted, fontSize: 14 }}>{t('register.subtitle')}</p>
            </div>

            <button onClick={() => { setRegistered(true); setFormStatus('success'); }}
              className="waze-btn" style={{ background: C.facebook, color: '#fff', width: '100%', justifyContent: 'center', marginBottom: 20, padding: '16px 24px' }}>
              {'\u{1F4D8}'} {t('register.facebook')}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0 0 20px', color: C.muted, fontSize: 13 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span>{t('register.or')}</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {formStatus === 'error' && (
              <div style={{ padding: '12px 16px', background: `${C.danger}10`, borderRadius: 12, marginBottom: 16, color: C.danger, fontSize: 14 }}>
                {t('form.error.submit')}
              </div>
            )}

            {formErrors._rate && (
              <div style={{ padding: '12px 16px', background: `${C.danger}10`, borderRadius: 12, marginBottom: 16, color: C.danger, fontSize: 14 }}>
                {t('form.error.cooldown')}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <input type="text" name="_gotcha" value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>
                  {t('register.name.label')}
                </label>
                <input className="input-field" type="text" placeholder={t('register.name')}
                  value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  style={formErrors.name ? { borderColor: C.danger } : {}} />
                {formErrors.name && <div style={errStyle}>{t('form.error.name')}</div>}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>
                  {t('register.email.label')}
                </label>
                <input className="input-field" type="email" placeholder={t('register.email')}
                  value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  style={formErrors.email ? { borderColor: C.danger } : {}} />
                {formErrors.email && <div style={errStyle}>{t('form.error.email')}</div>}
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>
                  {t('register.wazeUser.label')} <span style={{ color: C.muted, fontWeight: 400 }}>{t('register.wazeUserOptional')}</span>
                </label>
                <input className="input-field" type="text" placeholder={t('register.wazeUser')}
                  value={regForm.wazeUser} onChange={(e) => setRegForm({ ...regForm, wazeUser: e.target.value })}
                  style={formErrors.wazeUser ? { borderColor: C.danger } : {}} />
                {formErrors.wazeUser && (
                  <div style={errStyle}>
                    {regForm.wazeUser.trim().length > 50 ? t('form.error.wazeUserLength') : t('form.error.wazeUser')}
                  </div>
                )}
              </div>

              <button type="submit" className="waze-btn waze-btn-primary"
                disabled={formStatus === 'submitting'}
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 16, opacity: formStatus === 'submitting' ? 0.7 : 1 }}>
                {formStatus === 'submitting' ? t('register.submitting') : t('register.submit')} {'\u{1F697}'}
              </button>
            </form>

            <button onClick={closeModal}
              style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 16, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              {t('register.close')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
