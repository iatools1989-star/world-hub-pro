/**
 * Google Tag Manager (GTM-TNRV4LXN).
 *
 * O snippet segue exatamente o que o painel do Google mostra, porque o
 * verificador do Google procura o padrao literal:
 *
 *  1. no <head>, um script async que carrega o gtm.js
 *  2. logo depois, o dataLayer + gtag('js', new Date())
 *
 * Dois detalhes que costumam quebrar a instalacao:
 *
 * - **Nao usar o componente <Script> do Next** para o gtm.js. Ele injeta
 *   atributos proprios (data-nscript) que o Google rejeita em algumas
 *   verificacoes, do mesmo jeito que rejeita no AdSense. Vai como <script> cru.
 *
 * - **Nao instalar duas vezes.** O GTM daqui ja e o contêiner que distribui
 *   GA4 (G-S8SZLT7KZY). Colocar tambem o gtag.js do GA4 direto no <head>
 *   faria cada visita contar duas vezes, e a unica coisa pior que nao ter
 *   numero e ter numero errado.
 */
export const GTM_ID = 'GTM-TNRV4LXN';

export default function GoogleTagManager() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        // O atributo abaixo nao e decorativo: sem ele o `gtm.js` ainda carrega,
        // mas o Google nao usa o hit como prova de instalacao para o GA4.
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`,
        }}
      />
    </>
  );
}
