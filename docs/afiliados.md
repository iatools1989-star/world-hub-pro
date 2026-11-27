# Afiliados: o que fazer para o site começar a pagar

O site está pronto. O que falta é o cadastro nos programas e colar o link de rastreio na aba **Afiliados** do painel (`/en/admin` → Afiliados). Cada programa tem uma linha no registro `content/afiliados.json`.

**Regra que o código já aplica sozinho:** enquanto um programa estiver `pendente` ou sem link, o site mostra link direto, **sem** `#ad` e com a frase "we earn nothing from this click". Quando o link é cadastrado, o botão passa a apontar para o link rastreado, ganha `#ad` + `rel="sponsored"` e o texto muda para "we may earn a commission". Nada de editar arquivo de conteúdo.

## Ordem de cadastro (por retorno esperado)

| # | Programa | Onde cadastrar | Por que primeiro |
|---|---|---|---|
| 1 | **ElevenLabs** | elevenlabs.io/affiliates → PartnerStack | 22% por 12 meses, aprovação automática, pessoa física e mundial. Serve a página Text to Speech. Pro de US$ 99/mês rende ~US$ 261 por indicação. |
| 2 | **Adobe** | adobe.com/affiliates | 85% do 1º mês. Encaixa em PDF→JPG e JPG→PDF, as duas ferramentas com mais intenção de compra do site. |
| 3 | **Canva** | canva.com/affiliates → Impact | ~US$ 36 por Pro. Cobre 5 CTAs (QR, color picker, compressor, currículo, Bulk Studio). Pode exigir audiência grande para aprovar. |
| 4 | **Jasper** | jasper.ai/partners → PartnerStack | 25–30% por 12 meses. Uma página só, mas de alto ticket. |
| 5 | **Copy.ai** | copy.ai/affiliates → PartnerStack | ~45% no 1º ano. Usado no Word Counter. |
| 6 | **Amazon Associates** | associados.amazon.com.br | Tag `iatools06-20` já registrada. Não encaixa nas ferramentas: só vale para guias de equipamento (mesa, microfone, webcam), a criar. Cookie de 24h. |

Verificar depois (marcados como `pendente`): Otter.ai, Pika, Notion AI, remove.bg.
Sem programa (não anunciar comissão): Smallpdf, Midjourney, Runway, GitHub Copilot.

## O que fazer ao ser aprovado

1. Pegar o **link de rastreio** no painel do programa (não o ID solto).
2. `/en/admin` → **Afiliados** → no card do programa: status `aprovado`, colar o link → **Salvar**.
3. O painel commita `content/afiliados.json`; o Cloudflare rebuilda em ~2 min.
4. Conferir na página: o botão deve ir para o link com o seu parâmetro e mostrar `#ad`.

O link precisa ser **https e do domínio do programa** — a API recusa qualquer outro. Isso evita que um link torto vire redirect para fora.

## O que NÃO fazer

- Não anunciar comissão antes de ter o link: é divulgação enganosa (FTC/ASA) e sinal de baixo valor para o AdSense. O site já impede isso por padrão.
- Não prometer comissão em Smallpdf, Midjourney, Runway ou GitHub Copilot: não têm programa pago.
- Não trocar o veredito de uma página por causa de comissão. As páginas de diretório têm uma seção "when it is the wrong choice" de propósito — parceria que é compra errada continua escrita como compra errada.

## Onde cada programa aparece

- **tools/text-to-speech** → ElevenLabs
- **tools/pdf-to-jpg**, **tools/jpg-to-pdf** → Adobe
- **tools/merge-pdf**, **tools/compress-pdf** → Smallpdf (sem programa; candidato a trocar por Adobe)
- **tools/remove-bg** → remove.bg
- **tools/word-counter** → Copy.ai
- **tools/qr-generator**, **color-picker**, **image-compressor**, **resume-builder**, **bulk-studio** → Canva
- **directory/\*** → o programa da própria entrada

## Como o código está organizado

| arquivo | papel |
|---|---|
| `content/afiliados.json` | registro: status, ID, link, comissão, cookie, onde aparece |
| `lib/afiliados.ts` | decide link, `#ad`, `sponsored` e o texto sobre dinheiro |
| `lib/toolEditorial.ts` | `programa` no CTA + `rotuloDoCta` (texto do rodapé) |
| `app/[locale]/tools/[slug]/page.tsx` | aplica `ctaResolvido` antes de renderizar |
| `app/[locale]/directory/[slug]/page.tsx` | botão e o bloco "how this page is funded" |
| `app/go/[slug]/route.ts` | redirect: link aprovado → URL oficial → fallback |
| `app/api/admin/afiliados/route.ts` | GET/PUT do registro (sessão obrigatória, campos fechados) |
| `components/AdminAfiliados.tsx` | a tela do painel |
