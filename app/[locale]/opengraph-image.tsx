/**
 * Imagem de compartilhamento gerada pelo proprio site.
 *
 * Por que isto existe: quando alguem cola o link no WhatsApp, X, LinkedIn ou
 * Discord, sem imagem o cartao fica um retangulo cinza com texto. A taxa de
 * clique de um cartao sem imagem e uma fracao da de um cartao com imagem — e
 * como o primeiro trafego de um site novo vem justamente de onde as pessoas
 * compartilham link, isso vale mais do que parece.
 *
 * Gerado no servidor, nao e arquivo estatico: assim o titulo acompanha a
 * mudanca da home sem ninguem precisar redesenhar nada.
 */
import { ImageResponse } from 'next/og';

export const alt = 'World Tools Hub — free browser tools that run offline';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf9f7',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: 16, background: '#101012',
              color: '#f5c518', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 38, fontWeight: 900,
            }}
          >
            W
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#101012' }}>World Tools Hub</div>
            <div style={{ fontSize: 20, color: '#6b6b73', letterSpacing: 1 }}>IATOOLS.ONLINE</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 900, color: '#101012', lineHeight: 1.08, letterSpacing: -2 }}>
            16 tools that run in your browser.
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#8a8a92', marginTop: 12 }}>
            No upload. No signup. No expiry.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {['PDF', 'Images', 'QR codes', 'Passwords', 'Text'].map((t) => (
            <div
              key={t}
              style={{
                background: '#fff', border: '2px solid #e6e0d4', borderRadius: 999,
                padding: '12px 24px', fontSize: 24, fontWeight: 700, color: '#101012',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
