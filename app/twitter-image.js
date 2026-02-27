import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Waze Gabon Club — La 1ere communaute Waze du Gabon';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #0a1628 0%, #0f2847 40%, #0d4a3a 70%, #1a3a1a 100%)',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg, #33CCFF, #009E49)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32, fontSize: 64, fontWeight: 900, color: 'white',
        }}>W</div>

        <div style={{
          fontSize: 64, fontWeight: 900, color: 'white',
          letterSpacing: 2, marginBottom: 8, display: 'flex',
        }}>
          <span>WAZE </span>
          <span style={{ color: '#33CCFF' }}>GABON</span>
          <span> CLUB</span>
        </div>

        <div style={{
          background: '#FCD116', borderRadius: 30,
          padding: '6px 24px', fontSize: 24, fontWeight: 900,
          color: '#0a1628', marginBottom: 24,
        }}>#1</div>

        <div style={{
          fontSize: 28, color: 'rgba(255,255,255,0.8)',
          marginBottom: 12,
        }}>La 1ere communaute Waze du Gabon</div>

        <div style={{
          fontSize: 22, color: 'rgba(255,255,255,0.5)',
          display: 'flex', gap: 20,
        }}>
          <span>Tutoriels</span>
          <span>•</span>
          <span>Alertes trafic</span>
          <span>•</span>
          <span>Communaute</span>
        </div>

        <div style={{
          position: 'absolute', bottom: 50,
          fontSize: 22, color: '#33CCFF', fontWeight: 700,
          letterSpacing: 2,
        }}>wazegabon.com</div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 8, display: 'flex',
        }}>
          <div style={{ flex: 1, background: '#009E49' }} />
          <div style={{ flex: 1, background: '#FCD116' }} />
          <div style={{ flex: 1, background: '#3A75C4' }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
