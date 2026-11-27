'use client';

/**
 * Banner de consentimento de cookies (GDPR / LGPD).
 *
 * POR QUE ISSO EXISTE
 * O site roda Google Analytics 4 (via GTM) e Google AdSense. Os dois gravam
 * cookie no navegador do visitante. Na Uniao Europeia (GDPR) e no Brasil
 * (LGPD), gravar cookie de medicao ou publicidade antes de o visitante
 * autorizar nao e permitido. Nao e detalhe de conformidade: e o tipo de coisa
 * que a revisao do AdSense olha e que rende multa.
 *
 * A REGRA DURA DESTE COMPONENTE
 * Nada dispara antes da escolha. Nao basta mostrar um banner e continuar
 * medindo enquanto ele esta na tela — isso e "consentimento cosmetico", e
 * tecnicamente e a mesma coisa que nao ter banner. Por isso o GTM e o AdSense
 * so entram no DOM depois do clique em "Aceitar".
 *
 * COMO O "NAO" FUNCIONA
 * Recusar nao quebra o site: as ferramentas rodam no navegador e nao dependem
 * de analytics nem de anuncio. Sem consentimento o site simplesmente nao mede
 * e nao mostra anuncio — o visitante continua usando tudo normalmente.
 *
 * ONDE FICA A ESCOLHA
 * localStorage (`wtb-consent`). Nao e cookie: guardar a recusa num cookie seria
 * contraditorio. A escolha vale por 6 meses e depois e perguntada de novo,
 * porque consentimento velho deixa de ser consentimento informado.
 */

import { useEffect, useState } from 'react';
import { GTM_ID } from './GoogleTagManager';
import { ADSENSE_CONFIG, ADSENSE_ATIVO } from '@/lib/data';

export const CHAVE_CONSENT = 'wtb-consent';
const VALIDADE_MESES = 6;

type Escolha = 'aceito' | 'recusado';

type Guardado = { escolha: Escolha; quando: number };

/** Le a escolha salva. Devolve null quando nao existe ou quando expirou. */
function lerEscolha(): Escolha | null {
  try {
    const bruto = localStorage.getItem(CHAVE_CONSENT);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Guardado;
    if (!dados?.escolha) return null;
    const validade = VALIDADE_MESES * 30 * 24 * 3600 * 1000;
    if (Date.now() - dados.quando > validade) return null;
    return dados.escolha;
  } catch {
    return null;
  }
}

function salvarEscolha(escolha: Escolha) {
  try {
    localStorage.setItem(CHAVE_CONSENT, JSON.stringify({ escolha, quando: Date.now() }));
  } catch {
    /* navegador com storage bloqueado: segue sem lembrar, pergunta de novo */
  }
}

/** Remove os cookies de medicao que o GA4 tenha deixado de uma sessao anterior. */
function limparCookiesDeMedicao() {
  const nomes = document.cookie.split(';').map((c) => c.split('=')[0].trim());
  for (const nome of nomes) {
    if (nome === '_ga' || nome.startsWith('_ga_') || nome === '_gid') {
      document.cookie = `${nome}=; Max-Age=0; path=/; domain=${location.hostname}`;
      document.cookie = `${nome}=; Max-Age=0; path=/`;
    }
  }
}

export default function ConsentBanner() {
  const [escolha, setEscolha] = useState<Escolha | null>(null);
  const [decidido, setDecidido] = useState(false);
  const [detalhes, setDetalhes] = useState(false);

  // Le a escolha no cliente. O componente nao renderiza nada no servidor, para
  // o HTML nao sair com scripts de anuncio/medicao antes do consentimento.
  useEffect(() => {
    setEscolha(lerEscolha());
    setDecidido(true);
  }, []);

  function decidir(nova: Escolha) {
    salvarEscolha(nova);
    setEscolha(nova);
    if (nova === 'recusado') limparCookiesDeMedicao();
  }

  // Sem decisao salva, o banner aparece.
  const mostrar = decidido && escolha === null;

  /**
   * Injeta as tags DEPOIS do aceite.
   *
   * Nao adianta escrever <script> no JSX daqui: React insere o no via
   * innerHTML, e o navegador nao executa script criado assim. O dataLayer
   * chegava a existir (o GTM criava o dele), mas o `gtag('js')` nunca rodava e
   * o GA4 nao recebia evento nenhum — um banner que "aceita" e nao mede nada.
   * Por isso os elementos sao criados com document.createElement.
   *
   * A ordem tambem importa: dataLayer e gtag primeiro, gtm.js depois. Ao
   * contrario, o GTM carrega antes de existir fila para empurrar eventos.
   */
  useEffect(() => {
    if (!decidido || escolha !== 'aceito') return;
    if (document.getElementById('gtm-snippet')) return; // ja injetado

    const inline = document.createElement('script');
    inline.id = 'gtm-snippet';
    inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`;
    document.head.appendChild(inline);

    const gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(gtm);

    // AdSense: mesma regra. Sem aceite, nenhum script de anuncio viaja para o
    // celular do visitante.
    if (ADSENSE_ATIVO) {
      const ads = document.createElement('script');
      ads.async = true;
      ads.crossOrigin = 'anonymous';
      ads.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.client}`;
      document.head.appendChild(ads);
    }
  }, [decidido, escolha]);

  if (!mostrar) return null;

  return (
    <>

      {mostrar && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
        >
          <div className="mx-auto max-w-[860px] rounded-[14px] border border-[var(--color-line-strong)] bg-[var(--color-surface)] shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
            <div className="p-4 sm:p-5">
              <p className="text-[13px] sm:text-sm font-bold text-[var(--color-ink)]">
                Cookies, in plain English
              </p>
              <p className="mt-1.5 text-[12px] sm:text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                The tools on this site run in your browser and never send your files anywhere. For
                that, we need no permission at all. We do ask about two other things: <strong>analytics</strong>{' '}
                (which pages people find useful, via Google Analytics) and <strong>ads</strong> (which
                keep the tools free, via Google AdSense). Both set cookies. Refusing costs you nothing:
                every tool keeps working exactly the same.
              </p>

              {detalhes && (
                <ul className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                  <li>
                    <strong className="text-[var(--color-ink-soft)]">Analytics:</strong> Google
                    Analytics 4, cookies <code>_ga</code> and <code>_ga_*</code>, up to 2 years. Records
                    pages, time on page, country, browser. Never the content of your files.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-soft)]">Advertising:</strong> Google
                    AdSense, cookies used to pick and measure ads. You can also opt out of
                    personalised ads at{' '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-[var(--color-brand-deep)]"
                    >
                      Google Ads Settings
                    </a>
                    .
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-soft)]">Your choice</strong> is stored in
                    your browser for 6 months, then we ask again. Details in our{' '}
                    <a href="/en/privacy" className="font-bold underline text-[var(--color-brand-deep)]">
                      Privacy Policy
                    </a>
                    .
                  </li>
                </ul>
              )}

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <button
                  onClick={() => decidir('aceito')}
                  className="rounded-full bg-[var(--color-btn-bg)] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[var(--color-btn-brand-fg)] hover:opacity-90 transition"
                >
                  Accept all
                </button>
                <button
                  onClick={() => decidir('recusado')}
                  className="rounded-full border border-[var(--color-line-strong)] px-5 py-2 text-[12px] sm:text-[13px] font-bold text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] transition"
                >
                  Reject non-essential
                </button>
                <button
                  onClick={() => setDetalhes((v) => !v)}
                  className="sm:ml-auto text-[12px] font-bold underline text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  {detalhes ? 'Hide details' : 'What exactly?'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Botao para mudar de ideia depois. Fica no rodape.
 *
 * Sem isso, "aceitar" vira irreversivel na pratica: o visitante teria de
 * limpar o storage na mao. Consentimento que nao pode ser retirado tao
 * facilmente quanto foi dado nao e consentimento.
 */
export function BotaoCookies() {
  return (
    <button
      onClick={() => {
        try {
          localStorage.removeItem(CHAVE_CONSENT);
        } catch {
          /* storage bloqueado */
        }
        limparCookiesDeMedicao();
        location.reload();
      }}
      className="text-left hover:underline"
    >
      Cookie settings
    </button>
  );
}
