# Auditoria e Plano Estratégico — World Tools Hub (iatools.online)
### Meta: US$ 1.000/mês de receita recorrente · Análise de 21/10/2026

**Escopo analisado:** branch `arena/1a86653d-world-hub-pro` (Next.js 16 / React 19 / Tailwind 4), build de produção, navegação de rotas, todos os 16 componentes de ferramentas, 10 fichas de diretório, páginas legais, configuração de AdSense, checkout Lemon Squeezy, sitemap e middleware.

---

## 1. Sumário executivo

O site é um **protótipo tecnicamente competente, mas comercialmente inoperante**. Ele tem boa base de engenharia (Next.js moderno, processamento real no cliente em 13 das 16 ferramentas, conteúdo editorial já escrito para 15 ferramentas) e uma posição de marca defensável (privacidade / zero upload). Porém, hoje ele **não tem nenhum caminho funcional até a receita**: os anúncios usam IDs de slot falsos, os "links de afiliado" são homepages sem tag de afiliado, 100% dos CTAs de afiliado dentro das ferramentas terminam em redirect para a home, e o único produto pago ($9/mês) não aparece na página do produto — o componente de paywall existe, mas não está conectado em nenhuma rota.

| Dimensão | Nota | Situação |
|---|---|---|
| Arquitetura / estrutura | **6,0 / 10** | Stack sólida, mas tudo renderizado dinamicamente, 6 locales sem tradução, dois apps duplicados no repo |
| Funcionalidade | **6,5 / 10** | Ferramentas principais funcionam de verdade; 3 são cosméticas/enganosas; recursos-chave quebrados |
| Design | **6,5 / 10** | Sistema visual coerente e limpo, mas genérico, com emojis como ícones, dark mode quebrado e prova social falsa |
| Usabilidade / mobile | **4,5 / 10** | Sem menu mobile, sem CTA no mobile, sem seletor de idioma, alertas em português numa UI em inglês |
| SEO técnico e conteúdo | **2,5 / 10** | Sem canonical, sem hreflang, sem OG, sem JSON-LD, sem dados estruturados, zero páginas estáticas, conteúdo duplicado entre locales |
| Prontidão para monetizar | **1,5 / 10** | 0 anúncios servidos, 0 links de afiliado válidos, produto pago inacessível ao cliente |
| Confiança / compliance | **3,0 / 10** | Alegações inventadas (2.341 vendedores, 4,9/5 com 847 avaliações), sem CMP de consentimento, sem política de reembolso |
| **Geral** | **4,4 / 10** | **Bom protótipo. Ainda não é um negócio.** |

### Os 6 achados que mais custam dinheiro

1. **O paywall não está no ar.** `components/BulkStudioPro.tsx` contém a lógica de limite, modal e link de checkout do Lemon Squeezy (`iatools.lemonsqueezy.com/checkout/buy/bf7025b6-...`), mas **nenhuma página importa esse componente** — `app/[locale]/tools/[slug]/page.tsx` renderiza `BulkStudio`, a versão sem paywall. Além disso, o checkout é burlável com `?pro=1` na URL (`BulkStudioPro.tsx:27`) e a página pública `/test` entrega Pro grátis para qualquer visitante. **Receita possível hoje: US$ 0.**

2. **Duas ferramentas renderizam o componente errado.** Em `app/[locale]/tools/[slug]/page.tsx:83-85`, `case 'remove-bg'` cai no mesmo `return <BulkStudio />` de `bulk-studio`. A página "Remove Background" entrega o conversor em lote, e o componente `RemoveBg.tsx` (264 linhas, funcional) é código morto. É a ferramenta com maior intenção de compra do site.

3. **Os anúncios nunca vão preencher.** Os slots em `lib/data.ts:3-5` são placeholders (`8910111213`, `9876543210`, `5432167890`) e o próprio código diz "Substitua pelo ID gerado no AdSense". Pior: **não existe banner de consentimento (CMP)** — desde 2024 o Google exige CMP certificada para tráfego do EEE/Reino Unido, caso contrário serve anúncios limitados. O `AdSenseBanner` ainda reserva `min-h-[250px]` vazio, o que gera um bloco cinza em todas as páginas.

4. **Todos os CTAs de afiliado das ferramentas estão mortos.** Em `app/go/[slug]/route.ts`, o mapa de fallback só tem `adobe`, `smallpdf`, `removebg`, `elevenlabs` — mas as ferramentas apontam para `/go/pdf-to-jpg`, `/go/compress-pdf`, `/go/remove-bg`, `/go/resume-builder`, `/go/text-to-speech`. Teste de rota confirmado: `GET /go/compress-pdf → 307 /en` e `GET /go/remove-bg → 307 /en`. Ou seja: o clique de maior intenção do site (quem já está usando a ferramenta) é jogado de volta para a home. **Perda de 100% da receita de afiliados das páginas de ferramenta.**

5. **Não há medição de nada.** Zero GA4, zero Vercel Analytics, zero Search Console (não há verificação no código), zero log de cliques em `/go`, zero UTM. Sem isso, qualquer decisão de monetização é chute e nenhum parceiro aceita negociar mídia.

6. **O site promete uma coisa e entrega outra — e isso é risco de SEO e de política.** README fala em "50 tools + 500 AI Directory + 12 languages"; o site real tem **16 ferramentas, 10 IAs e 6 locales (todos em inglês)**. `app/[locale]/page.tsx:15` fixa `currentLocale = 'en'` e todos os links vão para `/en`, então `/pt`, `/es`, `/de` servem **a mesma página em inglês** com `<html lang="en">` (`app/layout.tsx:24`), sem `hreflang` e sem canonical. São 162 URLs no sitemap (`app/sitemap.ts`) que são duplicatas imperfeitas. O hero ainda exibe "🔥 BESTSELLER • 2.341 sellers use it" e "4.9/5 (847 reviews)" — números inventados, tecnicamente falsos e um risco real de rejeição do AdSense e de problema de publicidade enganosa.

**Boa notícia:** nada disso exige reconstruir o produto. O trabalho é de **ligação, foco e credibilidade** — estimo **12 a 20 dias de desenvolvimento** para chegar a um site 100% funcional e monetizável, e **6 a 9 meses** para US$ 1.000/mês com o plano da seção 7.

---

## 2. Inventário real: o que existe × o que é prometido

| Item | Prometido (README / site) | Real (código) | Impacto |
|---|---|---|---|
| Ferramentas | 50 | **16** (`lib/data.ts`) | Credibilidade e cobertura de SEO |
| Diretório de IA | 500 | **10** fichas, sendo **5 sem análise** (`lib/directoryContent.ts`) | Páginas finas, risco de "thin content" |
| Idiomas | 12 | **6 rotas**, 1 idioma de fato (inglês) | Conteúdo duplicado, canibalização |
| URLs no sitemap | ~6.600 | **162** | Baixo potencial de indexação |
| Páginas no blog | — | **0** | Dependência total de páginas de ferramenta |
| Anúncios servindo | Sim | **Não** (slots falsos, sem CMP) | US$ 0 |
| Links de afiliado | Sim | **0 válidos** | US$ 0 |
| Produto pago | $9/mês | **Inacessível** (componente não roteado) | US$ 0 |
| Newsletter / captura de e-mail | — | **Não existe** | Sem ativo de retenção |
| Analytics | — | **Não existe** | Nenhuma otimização possível |

---

## 3. Auditoria por dimensão

### 3.1 Estrutura e arquitetura

**Pontos fortes**
- App Router moderno, componentes de ferramenta isolados e reutilizáveis, bom uso de `generateMetadata`, 404 via `notFound()`, build limpo em Next 16 (validado: compila e passa TypeScript).
- Conteúdo editorial desacoplado em `lib/toolContent.ts` (302 linhas: resumo, 3 passos, 3 features, 3 FAQs por ferramenta) — a base do que o AdSense chama de conteúdo de valor já está pronta.
- Redirect centralizado em `/go/[slug]`, isolando os destinos externos (boa prática de compliance e de troca de programas).

**Problemas**
| # | Problema | Evidência | Impacto |
|---|---|---|---|
| E1 | **Nenhuma página é estática.** Não há `generateStaticParams`; o build mostra todas as rotas como `ƒ (Dynamic)` | build de produção | TTFB alto, sem CDN/ISR, crawl budget desperdiçado |
| E2 | **Dois apps no mesmo repositório**: `app/`, `components/`, `lib/` e a cópia `world-hub-pro-clean/` | `world-hub-pro-clean/` (295 KB, 40+ arquivos) | Ambiguidade de deploy, risco de editar a árvore errada, peso no CI |
| E3 | **Arquivos mortos e configs duplicadas**: `next.config.js` + `next.config.ts`, `postcss.config.js` + `.mjs`, `backup/*.bak` (460 KB), `components/tools/Batch2Combined.tsx` (725 linhas) e `BulkStudioPro.tsx` sem import | grep de imports | Manutenção confusa, bundle inflado |
| E4 | **i18n decorativo**: `middleware.ts` redireciona por idioma, mas nenhuma página usa `messages/*.json` nem `next-intl` (instalado e não usado) | zero imports de `next-intl` | 5 locales de conteúdo duplicado |
| E5 | `middleware` depreciado no Next 16 (aviso no build: usar `proxy`) | build log | Dívida técnica de baixo risco, mas some numa major futura |
| E6 | Sitemap com `lastModified: new Date()` em toda requisição | `app/sitemap.ts:12,21,31` | Sinal de "sempre mudou" → Google ignora |

### 3.2 Funcionalidade — ferramenta por ferramenta

| Ferramenta | Status real | Problema concreto | Correção |
|---|---|---|---|
| QR Generator | ✅ Real (lib `qrcode`) | Sem histórico, sem logo, sem SVG | Baixo esforço: SVG + logo + PIX com valor |
| Password Generator | ✅ Real | Sem "passphrase", sem checagem de vazamento | Adicionar modo frase + medidor de entropia visível |
| Word Counter | ✅ Real | Sem upload de .docx/.pdf/txt | Adicionar extração de texto (mammoth/pdf.js) |
| Unit Converter | ✅ Real | Categorias incompletas (sem dados/tempo/velocidade) | Completar; é a mais fácil de expandir |
| Color Picker | ⚠️ Parcial | Contraste/AA e paletas limitados | Adicionar verificador WCAG e export Tailwind/CSS |
| PDF → JPG | ⚠️ Depende de CDN externo (`cdnjs`) | Se o CDN cair, a ferramenta morre; contradiz "100% offline" | Instalar `pdfjs-dist` via npm e importar dinamicamente |
| JPG → PDF | ❌ **Não gera PDF** | Abre janela de impressão (`window.print`) e depende de pop-up liberado (`JpgToPdf.tsx:67`) | Gerar PDF real com `jspdf`/`pdf-lib` |
| Comprimir PDF | ⚠️ Re-renderiza páginas em imagem | Qualidade cai, texto deixa de ser selecionável, lento em arquivos grandes | Manter opção "manter texto" (Ghostscript wasm) + aviso claro |
| Remover fundo | ❌ **Componente não roteado** | `case 'remove-bg'` cai em `return <BulkStudio />` (`tools/[slug]/page.tsx:83-85`): a página promete remover fundo e entrega o conversor em lote. O `RemoveBg.tsx` (264 linhas) está pronto e é código morto. Quando ativado, é remoção por cor dos cantos — não é IA | Rotear o componente, renomear para "remover fundo sólido" e oferecer IA (PhotoRoom/remove.bg) via afiliado |
| Compressor de imagem | ✅ Real | Sem WebP/AVIF, sem comparação antes/depois | Adicionar formato de saída + preview lado a lado |
| Age Calculator | ✅ Real | Simples, pouco tráfego comercial | Manter (tráfego/ads) |
| Resume Builder | ⚠️ Só impressão | Pop-up + sem export .pdf real | `jspdf` + templates ATS + download direto |
| Text to Speech | ✅ Real (Web Speech) | Voz depende do dispositivo; sem download de MP3 | Avisar limitação + afiliado ElevenLabs no ponto de fricção |
| "URL Shortener" | ⚠️ **Não encurta** | Apenas remove UTMs (`URLShortener.tsx`) | Renomear para "Limpar link/remover rastreadores" (o nome atual atrai e frustra) |
| Merge PDF | ⚠️ CDN externo | Mesmo risco do PDF→JPG | npm `pdf-lib` |
| **Bulk Studio** | ⚠️ Funciona, mas com bug sério | Redimensiona **tudo para 2000×2000 quadrado com padding branco** (`BulkStudio.tsx:37-45`), distorcendo o enquadramento de fotos de produto; quota em `localStorage` com chave por data e sem paywall ativo | Presets reais (2000×2000, 1000×1000, original, corte inteligente) + limite conectado ao checkout |
| GenericToolRunner | ❌ Cosmético | Simula processamento com `setTimeout` e diz "Done!" | Remover da rota ou implementar |

**Conclusão:** a base é honesta (13/16 executam processamento real), mas **3 ferramentas quebram a promessa explícita** (Remover fundo, JPG→PDF e "URL Shortener") e 3 dependem de CDN externo ou de pop-up liberado. O caso do Remover fundo é o mais grave: é a ferramenta de maior intenção comercial do site e o componente correto nunca é renderizado — e o mesmo `case` faz `bulk-studio` e `remove-bg` apontarem para o mesmo componente. Para um site que cobra por confiabilidade, isso é o principal risco de reputação.

### 3.3 Design

**O que está bom:** paleta consistente (zinc + amarelo de acento), cards com raio grande, hierarquia clara, hero com proposta de valor específica (não genérica), uso correto de contraste em botões principais, layout responsivo em grid.

**O que precisa mudar**
1. **Dark mode quebrado.** `Header.tsx` alterna a classe `dark` no `<html>`, mas o Tailwind 4 está sem `@custom-variant dark` em `app/globals.css` (só `@import "tailwindcss"`). O tema escuro só responde a `prefers-color-scheme`; o botão da lua não faz nada. Correção: `@custom-variant dark (&:where(.dark, .dark *));`.
2. **Emojis como ícones** (🔳 🔐 📦) em vez de um sistema de ícones (Lucide) — é o maior sinal visual de "projeto amador" para um produto que quer cobrar $9.
3. **Sem ativos de marca**: não existe favicon, `app/icon`, logo em SVG nem imagem Open Graph. Compartilhar o site no WhatsApp/X gera card vazio.
4. **Prova social falsa** no hero ("2.341 sellers", "4.9/5 847 reviews", "Trusted by 10k+ creators") — visualmente convincente, eticamente indefensável. Substituir por números reais (ex.: "16 ferramentas · 0 uploads · processamento local") ou remover.
5. **Blocos de anúncio vazios** de 250px com borda tracejada e a palavra "Publicidade" — parece erro de layout.
6. Tipografia padrão do sistema; falta uma fonte display + escala tipográfica definida.

### 3.4 Usabilidade e mobile

| # | Problema | Impacto em conversão |
|---|---|---|
| U1 | `nav` é `hidden md:flex` e **não há menu mobile** — no celular o cabeçalho tem só logo e tema | Usuário mobile não navega |
| U2 | O CTA "Go Pro $9" é `hidden sm:inline-flex` — **invisível em telas < 640 px** (a maioria dos celulares em retrato) | 50–60% do tráfego nunca vê a oferta |
| U3 | **Não existe seletor de idioma** (e os locales não são traduzidos) | Promessa global não cumprida |
| U4 | Links de navegação usam âncoras `#tools` / `#directory`, que só existem na home; nas páginas internas não levam a lugar algum | Navegação quebrada |
| U5 | Sem breadcrumbs nem links "ferramentas relacionadas" | Profundidade de sessão baixa |
| U6 | **Idioma misturado**: UI em inglês com `alert()` em português ("Selecione um arquivo PDF válido", "Processando... 100%") | Parece produto inacabado |
| U7 | Erros só por `alert()` do navegador; sem toasts, sem estados de erro inline, sem cancelar processamento | Fricção em arquivos grandes |
| U8 | Sem drag-and-drop na maioria das ferramentas; `<input type=file>` cru | Menor taxa de início de uso |
| U9 | Nenhuma ferramenta tem deep link de resultado, histórico ou "usar novamente" | Sem retenção/recorrência |
| U10 | Sem área de conta real (login, faturas, cancelamento) | Assinatura não gerenciável → churn e chargeback |

### 3.5 SEO técnico e conteúdo

Sem `canonical`, sem `hreflang`, sem Open Graph/Twitter card, sem favicon, sem JSON-LD, sem `generateStaticParams`, sem breadcrumb, sem `last-updated`, sem autor/método editorial, sem páginas de categoria, sem blog, sem busca interna.

Isso desperdiça o ativo mais valioso que o site já tem: **15 páginas de ferramenta com ~500–700 palavras de conteúdo próprio e 3 FAQs cada**. Um `FAQPage` + `SoftwareApplication` + `BreadcrumbList` bem implementados nessas 15 páginas são a diferença entre aparecer no resultado rico do Google e não aparecer.

Além disso:
- **Sitemap não separado por locale** e sem `alternates` → 6 cópias da mesma página competindo entre si.
- **5 fichas de diretório sem análise** (só Jasper, Runway, Midjourney, ElevenLabs e Pika têm `DIRECTORY_DETAILS`) → as outras 5 são páginas de ~300 palavras com links de afiliado: exatamente o padrão que o Google classifica como thin affiliate content.
- **AdSense**: além dos slots falsos, o site mistura páginas legais razoáveis com alegações inventadas e sem CMP — combinação típica de reprovação ou limitação de anúncios.

### 3.6 Monetização atual — por que hoje é US$ 0

```
Tráfego → página de ferramenta → CTA "Pro: Adobe Acrobat ↗" → /go/pdf-to-jpg → 307 /en  →  ❌ receita
Tráfego → home → "⚡ Go Pro $9" → /en/tools/bulk-studio → BulkStudio (sem paywall)     →  ❌ receita
Tráfego → /go/jasper → https://jasper.ai (sem tag de afiliado)                          →  ❌ receita
Tráfego → qualquer página → banner AdSense com slot inválido                            →  ❌ receita
```
Só existe receita se existir **pelo menos um** caminho completo e **medição**. Hoje não existe nenhum.

---

## 4. Priorização dos problemas (P0 = bloqueia receita)

| Pri. | Item | Arquivo principal | Esforço | Impacto |
|---|---|---|---|---|
| **P0** | Remover `/test` e o bypass `?pro=1` | `app/test/page.tsx`, `components/BulkStudioPro.tsx:27` | 1 h | Fecha vazamento de receita |
| **P0** | Rotear o produto pago: substituir `BulkStudio` por `BulkStudioPro` e corrigir o bug 2000×2000 | `app/[locale]/tools/[slug]/page.tsx:84-85` | 4 h | Habilita assinatura |
| **P0** | Rotear `RemoveBg` corretamente (hoje a página renderiza Bulk Studio) | `app/[locale]/tools/[slug]/page.tsx:83-85` | 1 h | Recupera a ferramenta de maior intenção comercial |
| **P0** | Corrigir todos os destinos `/go/*` + colocar tags de afiliado reais | `app/go/[slug]/route.ts`, `lib/data.ts` | 4 h | Habilita afiliados |
| **P0** | Analytics + Search Console + evento `go_click` + UTM | novo `lib/analytics.ts`, layout | 4 h | Torna tudo mensurável |
| **P0** | Remover alegações falsas e "prova social" inventada | home, footer | 1 h | Compliance/AdSense |
| **P0** | Slots de anúncio reais + CMP de consentimento | `lib/data.ts`, `app/layout.tsx` | 3 h | Habilita anúncios |
| **P1** | `generateStaticParams` + ISR + `lastModified` real | todas as rotas | 6 h | Core Web Vitals, indexação |
| **P1** | canonical + hreflang + OG image + JSON-LD (FAQ, SoftwareApplication, Breadcrumb, Review) | `generateMetadata` | 8 h | CTR orgânico |
| **P1** | Decidir i18n: reduzir para EN/PT/ES **traduzidos** ou remover locales | `middleware.ts`, `app/[locale]` | 8–20 h | Elimina duplicação |
| **P1** | Menu mobile + CTA fixo + seletor de idioma + âncoras corrigidas | `Header.tsx` | 5 h | Conversão mobile |
| **P1** | Substituir CDN por `pdfjs-dist`/`pdf-lib` no bundle; JPG→PDF real com `jspdf` | 4 componentes | 8 h | Confiabilidade |
| **P2** | Dark mode, ícones Lucide, favicon/logo, toasts, breadcrumbs | global | 8 h | Percepção de qualidade |
| **P2** | Limpeza de repo (`world-hub-pro-clean`, `backup/`, configs duplicadas) | raiz | 2 h | Manutenibilidade |
| **P2** | Páginas de categoria, busca interna, relacionadas | novo | 12 h | Sessões/página |
| **P2** | Página de preços + gestão de assinatura + reembolso | novo | 8 h | Conversão e churn |

---

## 5. Posicionamento: a decisão estratégica mais importante

Hoje o site tenta ser três coisas ao mesmo tempo (hub de ferramentas, diretório de IA, SaaS de imagens). Isso dilui SEO, mensagem e produto. Três caminhos possíveis:

| Opção | Tese | Receita realista em 12 meses | Risco | Veredito |
|---|---|---|---|---|
| **A. Hub genérico de ferramentas** | Competir com iLovePDF, Smallpdf, Canva por termos como "compress pdf" | US$ 100–400 | Altíssimo (SEO brutalmente disputado, RPM baixo) | ❌ Não recomendado |
| **B. Diretório de IA** | Virar "o G2 das IAs" | US$ 300–900, se conseguir 300+ fichas boas | Conteúdo caro, concorrência (Futurepedia, TAAFT) | ⚠️ Só como suporte |
| **C. Toolkit de imagens para vendedores de e-commerce (Shopify, Etsy, Mercado Livre)** | Ser a ferramenta que resolve a rotina de fotos de produto: redimensionar, comprimir, remover fundo, renomear para SEO, gerar QR/PIX, exportar em lote | **US$ 1.000–2.500** | Médio (nicho, mas com dor clara e disposição a pagar) | ✅ **Recomendado** |

**Por que C:** o próprio site já sinaliza isso (hero do Bulk Studio, copy "Perfect for Shopify, Etsy and Amazon sellers", "SEO para Shopify/Etsy"). É o único ponto em que o produto tem uma dor específica, um público que já paga por apps, e concorrência fraca em **português e espanhol**. Além disso muda a matemática: US$ 9/mês de 110 vendedores é mais realista do que 200 mil pageviews de anúncios.

**Recomendação de posicionamento:** *"O kit de imagens do vendedor online: 100 fotos padronizadas, comprimidas e prontas para Shopify, Etsy e Mercado Livre — sem upload, direto no navegador."* O diretório de IA passa a ser secundário, focado em ferramentas **para vendedores** (fotos, anúncios, copy, vídeo), o que aumenta a conversão de afiliados por intenção.

**Implicações diretas:**
- A home passa a vender Bulk Studio + 5 ferramentas de imagem; PDF/utilitários ficam em uma seção "também úteis" (eles trazem tráfego de anúncio, não de assinatura).
- O diretório é reduzido às 20 ferramentas que um vendedor realmente usa, todas com análise própria e link de afiliado.
- Os idiomas prioritários são **inglês, português (BR) e espanhol** — não 12.

---

## 6. A matemática de US$ 1.000/mês

### 6.1 Mix recomendado (cenário-alvo)

| Pilar | Alavanca | Matemática | Receita/mês |
|---|---|---|---|
| Anúncios | 50.000 pageviews × US$ 5 RPM | migrar AdSense → Mediavine Journey/Ezoic a partir de 10 mil sessões | **US$ 250** |
| Afiliados | 5% de CTR em `/go` → 3.000 cliques × 2% conv. × US$ 10 | 40–60 vendas/mês | **US$ 500–600** |
| Assinatura Pro | 30 assinantes ativos × US$ 8 líquidos | 2% de conversão sobre 3.000 visitas qualificadas/mês ao paywall | **US$ 240** |
| Patrocínio do diretório | 3 slots × US$ 39 | vendido só com prova de tráfego (mídia kit) | **US$ 117** |
| | | | **≈ US$ 1.100** |

### 6.2 Indicador-chave: receita por 1.000 sessões (RPS)

| Modelo | RPS típico | Sessões necessárias para US$ 1.000 |
|---|---|---|
| Só AdSense (RPM US$ 4) | US$ 5,6 | **~180.000** (inviável em 12 meses) |
| AdSense + afiliados | US$ 12 | ~83.000 |
| **Mix completo (recomendado)** | **US$ 18–22** | **~45.000–55.000** |

**Regra de gestão:** toda decisão de produto é aprovada se aumentar o RPS, não apenas o tráfego. Um site com 20 mil sessões e RPS 20 ganha mais que um com 60 mil e RPS 5.

### 6.3 Projeção de 12 meses (cenário-base, conservador)

Premissas: pageviews = 1,4 × sessões; RPM 4,0 → 5,0; afiliados 5% CTR, 2% conversão, US$ 10 de comissão média; Pro a US$ 8 líquidos com churn de 12%/mês; patrocínio a partir do mês 6.

| Mês | Sessões | Anúncios | Afiliados | Pro (assinantes) | Patrocínio | **Total** |
|---|---|---|---|---|---|---|
| 1 | 1.500 | 8 | 15 | 0 | – | **23** |
| 2 | 3.500 | 20 | 35 | 0 | – | **55** |
| 3 | 7.000 | 39 | 70 | 24 (3) | – | **133** |
| 4 | 12.000 | 76 | 120 | 48 (6) | – | **244** |
| 5 | 18.000 | 113 | 180 | 80 (10) | – | **373** |
| 6 | 25.000 | 157 | 250 | 120 (15) | 39 | **566** |
| 7 | 33.000 | 231 | 330 | 160 (20) | 39 | **760** |
| 8 | 40.000 | 280 | 400 | 200 (25) | 78 | **958** |
| 9 | 48.000 | 336 | 480 | 240 (30) | 78 | **1.134** |
| 10 | 55.000 | 385 | 550 | 272 (34) | 117 | **1.324** |
| 11 | 62.000 | 434 | 620 | 304 (38) | 117 | **1.475** |
| 12 | 70.000 | 490 | 700 | 336 (42) | 156 | **1.682** |

*Custos fixos: US$ 25–45/mês (Vercel Pro US$ 20 — obrigatório, o plano Hobby proíbe uso comercial — domínio, e-mail). Receita líquida no mês 9 ≈ US$ 1.090.*

**Cenário acelerado (se o foco em PT/ES + afiliados funcionar):** US$ 1.000 no mês 6–7, porque a comissão média sobe para US$ 15 (Semrush, Canva Pro, Hostinger) e o RPM sobe para US$ 8 com Mediavine. **Cenário pessimista:** US$ 1.000 só no mês 12–15, se o Google não indexar as páginas novas — por isso o Pilar 1 do roadmap é SEO técnico, não conteúdo.

---

## 7. Roadmap de 90 dias

### Fase 0 — Semana 1: parar de perder dinheiro (P0)
**Objetivo: existir um caminho completo até o checkout e até o clique de afiliado.**

1. Apagar `app/test/page.tsx` e remover `?pro=1` de `BulkStudioPro.tsx`.
2. Trocar `<BulkStudio />` por `<BulkStudioPro />` no case `bulk-studio`; corrigir o preset de redimensionamento (manter proporção, opções 2000×2000 / 1000×1000 / largura original, sem padding branco forçado). Separar o `case 'remove-bg'` para renderizar `<RemoveBg />` (hoje cai no Bulk Studio).
3. Criar tabela `AFFILIATES` em `lib/data.ts` com, no mínimo: `pdf-to-jpg → Adobe (Impact)`, `compress-pdf → Smallpdf`, `remove-bg → PhotoRoom/remove.bg`, `text-to-speech → ElevenLabs`, `resume-builder → Rezi`, `bulk-studio → Canva Pro`. Todos os links com tag/`subid` do programa.
4. Reescrever `app/go/[slug]/route.ts`: mapa único de destino, log de clique (`console` + evento GA4 + tabela/planilha), fallback para `/` com 302, nunca redirect silencioso para home sem registro.
5. Instalar GA4 (ou Plausible) + verificar Search Console + Bing; eventos: `tool_start`, `tool_complete`, `download`, `paywall_view`, `checkout_click`, `go_click` (com `slug` e `source`).
6. Remover "2.341 sellers", "4.9/5 (847 reviews)", "Trusted by 10k+ creators", "STRIPE SECURE" se o processador for Lemon Squeezy.
7. Publicar `ads.txt` correto (já está), criar os 3 slots reais no AdSense e ativar um CMP certificado (Google CMP ou Cookiebot). Enquanto o AdSense não aprovar, desligar o componente em vez de mostrar caixa vazia.

**Critério de aceite:** é possível sair de qualquer página de ferramenta e chegar a um checkout ou a um link de afiliado rastreado em ≤ 2 cliques, e cada clique aparece no analytics.

### Fase 1 — Semanas 2–4: SEO técnico e arquitetura
8. `generateStaticParams` + `revalidate = 3600` em home, ferramentas, diretório, páginas legais; `lastModified` real por conteúdo.
9. `metadata.alternates` (canonical + hreflang) e OG image dinâmica com `next/og` (uma por ferramenta).
10. JSON-LD: `SoftwareApplication` + `FAQPage` nas 16 ferramentas; `Review` + `BreadcrumbList` nas fichas de diretório; `Organization` na home.
11. Corrigir `html lang` por locale; decidir i18n (recomendo **EN + PT + ES traduzidos de verdade** com `next-intl`, ou remover os outros 3 locales até traduzir). Nunca manter rota que serve inglês com `lang="pt"`.
12. Criar `/tools` (índice), categorias (`/tools/imagem`, `/tools/pdf`, `/tools/texto`) e busca client-side (`fuse.js`) — 4 páginas novas com boa intenção de busca.
13. Corrigir âncoras do header, breadcrumbs, "ferramentas relacionadas" (3 por página).
14. Limpar repositório: remover `world-hub-pro-clean/`, `backup/`, `next.config.ts` **ou** `next.config.js`, `postcss.config.mjs` **ou** `.js`, `Batch2Combined.tsx`; mover `BulkStudioPro` para `components/tools/`; adicionar CI (`build` + `lint` no PR).

### Fase 2 — Semanas 5–8: produto, preço e retenção
15. **Página de preços** (`/[locale]/pricing`) com tabela Free × Pro × Lifetime e comparação com Smallpdf/Canva.
16. **Licenciamento real**: usar a License API do Lemon Squeezy (ou Stripe + webhook) para emitir uma chave; validar na ativação do Pro. Sem isso, a quota em `localStorage` é decorativa. (Aceite que um usuário técnico burle; o objetivo é evitar a burla trivial de `?pro=1`.)
17. **Novos limites de produto**: Free 10 imagens/dia, Pro 500/dia, Pro+ presets em lote e renomeação SEO automática (`produto-01-shopify-2000x2000.jpg`), export WebP, "cortar para quadrado" com detecção de assunto.
18. **Portal do assinante mínimo**: e-mail, plano, próxima cobrança, botão de cancelar (Lemon Squeezy Customer Portal resolve).
19. **Captura de e-mail**: lead magnet "Checklist: 12 correções de imagem que aumentam conversão no Shopify (PDF)" via Resend/Brevo; newsletter quinzenal.
20. **Política de reembolso (7 dias)**, termos de assinatura, disclosure de afiliado visível em cada página com link externo, página de metodologia editorial com autor real.

### Fase 3 — Semanas 9–12: tráfego e prova social real
21. Publicar os 12 clusters de conteúdo da seção 10 (começar por PT/ES, onde a concorrência é menor).
22. Lançar Bulk Studio no Product Hunt + 15 diretórios de ferramentas (AlternativeTo, SaaSHub, Uneed, Tiny Startups, etc.).
23. Mídia kit + prospecção de 3 patrocinadores a US$ 39/mês (usar números reais do GA4).
24. Programa de afiliados próprio (30% recorrente) para criadores de conteúdo de e-commerce.
25. Ciclo semanal de otimização: exportar GSC, identificar páginas com impressões e CTR < 2%, reescrever title/meta e adicionar FAQ.

---

## 8. Backlog técnico com correções concretas

**a) Dark mode (Tailwind 4)** — `app/globals.css`:
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

**b) Páginas estáticas** — em cada `page.tsx`:
```ts
export const revalidate = 3600;
export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}
```
(para `[locale]`, cruzar `LOCALES × TOOLS`).

**c) Metadata completa** em `[locale]/tools/[slug]/page.tsx`:
```ts
return {
  title: `${tool.name} — grátis e sem upload`,
  description: guide?.summary.slice(0, 155),
  alternates: {
    canonical: `https://www.iatools.online/${locale}/tools/${slug}`,
    languages: Object.fromEntries(LOCALES.map(l => [l.code, `/${l.code}/tools/${slug}`])),
  },
  openGraph: { images: [`/${locale}/tools/${slug}/opengraph-image`] },
};
```

**d) Rota `/go` com rastreamento**:
```ts
const AFFILIATES: Record<string, { url: string; program: string }> = { ... };
export async function GET(req, ctx) {
  const { slug } = await ctx.params;
  const dest = AFFILIATES[slug];
  if (!dest) return NextResponse.redirect(new URL('/en/tools', req.url), 302);
  // registrar clique (GA4 Measurement Protocol ou KV/planilha)
  return NextResponse.redirect(dest.url, 307);
}
```

**e) Quota única e correta** (`lib/quota.ts`), com chave ISO e fonte única:
```ts
const key = () => `quota:${new Date().toISOString().slice(0, 10)}`;
export const getUsed = () => Number(localStorage.getItem(key()) ?? 0);
export const addUsed = (n: number) => localStorage.setItem(key(), String(getUsed() + n));
```
Hoje cada componente inventa sua chave (`localStorage.getItem(today)` em `BulkStudio.tsx` vs `bulk_used` em `BulkStudioPro.tsx`) — os dois contadores não conversam.

**f) JPG→PDF sem pop-up**: `jspdf` com `addImage` por página + `doc.save()`; idem currículo.

**g) PDFs sem CDN**: `npm i pdfjs-dist pdf-lib`, `const pdfjs = await import('pdfjs-dist')`, `GlobalWorkerOptions.workerSrc` apontando para o worker empacotado pelo Next. Ganho: funciona offline, sem bloqueio de CSP/rede, ~40% menos tempo até o primeiro uso.

**h) Bulk Studio correto**:
```ts
const target = Math.min(maxSize / img.width, maxSize / img.height, 1);
canvas.width = Math.round(img.width * target);
canvas.height = Math.round(img.height * target);
```
mais presets: `{2000, 2000, 'pad' | 'crop' | 'fit'}`, saída JPEG/WebP, nome baseado no arquivo original + sufixo.

**i) Imagens de produto reais** substituindo o mock do hero: 3 screenshots/GIF do app funcionando (aumenta conversão mais que qualquer copy).

**j) Observabilidade**: Sentry (free tier) para erros de canvas/JSZip — hoje um `canvas.toBlob` nulo em Safari falha silenciosamente.

---

## 9. Backlog de design e UX (ordem de impacto)

1. Header mobile com menu + CTA "Pro" sempre visível (sticky bottom bar no mobile: "Processar 100 fotos — $9/mês").
2. Ícones Lucide no lugar de emojis; favicon e logo SVG; OG image.
3. Fonte: `next/font` (Inter/Geist) + uma display para títulos.
4. Antes/depois visual nas ferramentas de imagem (o usuário precisa *ver* o resultado).
5. Toasts (sonner) em vez de `alert()`; estados de carregamento com barra e botão cancelar.
6. Drag-and-drop universal + `<input capture>` no mobile.
7. Página de preços com ancoragem (Free / **Pro $9** / Lifetime $79) e 3 objeções respondidas acima do botão.
8. Tabela comparativa "nós × iLovePDF × Smallpdf × Canva" (foco em privacidade e lote).
9. Selo de confiança real: "Arquivos processados no seu dispositivo — verificado com devtools" com link para como testar.
10. Modo escuro corrigido, contraste AA, focus rings visíveis, `aria-label` em botões de ícone.

---

## 10. Marketing e tráfego

### 10.1 Distribuição de esforço
| Canal | % do esforço | Meta de sessões no mês 6 | Observação |
|---|---|---|---|
| SEO orgânico | 50% | 15.000 | 12 clusters + 60 páginas programáticas |
| Comunidades (Reddit/FB/WhatsApp/Telegram) | 20% | 5.000 | onde estão os vendedores, em PT e EN |
| Pinterest | 10% | 2.500 | altíssimo para "remove background", "product photo size" |
| YouTube Shorts / TikTok / Reels | 10% | 1.500 | demo "100 fotos → ZIP em 10s" |
| Lançamentos e backlinks | 10% | 1.000 | Product Hunt, diretórios, guest posts |

### 10.2 Os 12 clusters de conteúdo (comece pelos de baixa concorrência em PT/ES)

| # | Cluster | Exemplos de página | Intenção |
|---|---|---|---|
| 1 | Tamanho de imagem por marketplace | "imagem 2000x2000 Shopify", "foto 1000x1000 Mercado Livre", "Etsy tamanho mínimo" | Altíssima, comercial |
| 2 | Comprimir para limite | "comprimir imagem para 500kb", "comprimir PDF para 200kb", 8 variações | Alta, volume grande |
| 3 | Remover fundo de foto de produto | "remover fundo foto produto grátis", "fundo branco Shopify" | Alta, converte para Pro |
| 4 | Converter formatos | "converter JPG para WebP", "PNG para JPG em lote" | Média |
| 5 | SEO de imagens | "nome de arquivo SEO Shopify", "alt text produtos" | Baixa concorrência |
| 6 | Lote / produtividade | "redimensionar várias imagens de uma vez", "renomear imagens em lote" | Alta, é o produto |
| 7 | Comparativos | "iLovePDF vs Smallpdf vs WorldHub", "remove.bg vs PhotoRoom" | Alta conversão de afiliado |
| 8 | Alternativas | "alternativa gratuita ao Smallpdf", "alternativa ao Canva para fotos" | Alta |
| 9 | IA para vendedores | "melhores IA para criar anúncios", "IA para descrição de produto" | Diretório |
| 10 | QR / PIX | "QR code PIX estático", "QR code para cardápio" | Brasil, alto volume |
| 11 | Currículo/ATS | "currículo ATS grátis", "currículo em PDF sem Word" | Volume alto, EUA |
| 12 | Guias de segurança | "gerador de senha seguro", "senha forte 2026" | Volume, RPM baixo |

**Páginas programáticas recomendadas (baixo esforço, alto retorno):** "comprimir PDF para {100, 200, 300, 500 KB, 1 MB}" (5 páginas × 3 idiomas), "imagem {W}×{H} para {Shopify, Etsy, Mercado Livre, Amazon}" (12 páginas), "{ferramenta} alternativa ao {concorrente}" (20 páginas). Total ≈ 50–70 páginas novas com um único template — cada uma com conteúdo único de 400+ palavras (não apenas variável trocada).

### 10.3 20 ações concretas de lançamento
1. Responder 3 threads/semana em r/EtsySellers, r/shopify, r/dropship com dica real + link contextual (nunca spam).
2. 5 posts/semana em 3 grupos de WhatsApp/Telegram de vendedores Mercado Livre/Shopify BR.
3. Product Hunt: preparar assets, 5 comentários de apoio, lançar terça-feira.
4. Publicar em 15 diretórios de ferramentas (backlinks + referral constante).
5. Pinterest: 5 pins/dia, cada um linkando para uma ferramenta (formato 1000×1500 com antes/depois).
6. 3 Shorts/semana: "100 fotos em 10 segundos", "por que seu produto parece amador", "o tamanho certo de foto no Shopify".
7. 1 vídeo tutorial de 5 min por ferramenta no YouTube (PT-BR primeiro).
8. Guest post em 3 blogs de e-commerce por mês (oferecer ferramenta grátis em troca de menção).
9. Parceria com 5 agências de tráfego pago para e-commerce (afiliado 30% recorrente).
10. Parceria com criadores de curso de dropshipping (comissão + cupom).
11. Lead magnet PDF + popup de saída na página do Bulk Studio (exit intent, sem interstitial agressivo).
12. Newsletter quinzenal: 1 dica de imagem + 1 ferramenta + 1 case.
13. Responder perguntas no Quora e no Google "People also ask" (usar o conteúdo das FAQs já escrito).
14. IndexNow + envio manual de sitemap no GSC após cada release.
15. Mídia kit de 1 página com métricas reais; prospectar 20 apps de e-commerce.
16. Programa de afiliados próprio no Lemon Squeezy (30%).
17. Cupom de lançamento "FOUNDER50" (50% no primeiro mês, limitado a 30).
18. Case study: "Como padronizei 300 fotos em 8 minutos" (com números do usuário).
19. Webinar/AMA com vendedor convidado (gera gravação para Shorts).
20. Sistema de indicação dentro do app: "indique e ganhe 1 mês" (após o licenciamento real).

**O que NÃO fazer agora:** Google Ads antes de RPS > 15; comprar seguidores/avaliações; publicar 500 fichas de IA geradas automaticamente; traduzir para 12 idiomas com tradução automática; investir em Instagram sem produto de vitrine.

---

## 11. Métricas: painel e rotina

### 11.1 Métrica-norte
**Receita por 1.000 sessões (RPS)** — alvo: US$ 18–22 até o mês 9.

### 11.2 Painel semanal

| KPI | Fonte | Baseline hoje | Meta mês 3 | Meta mês 6 |
|---|---|---|---|---|
| Sessões orgânicas | GA4 + GSC | 0 | 5.000 | 18.000 |
| Páginas indexadas | GSC | ? | 100 | 250 |
| CTR médio orgânico | GSC | – | 2,5% | 4% |
| Posição média | GSC | – | 25 | 12 |
| LCP / INP mobile | PageSpeed/CrUX | ? | < 2,5 s / < 200 ms | idem |
| Taxa de conclusão de ferramenta | GA4 `tool_complete / tool_start` | não medido | 45% | 60% |
| CTR de afiliado (`go_click`) | GA4 | 0 | 5% | 6% |
| EPC (receita de afiliado / cliques) | painéis de afiliado | US$ 0 | US$ 0,12 | US$ 0,18 |
| Visitas ao paywall | GA4 | 0 | 1.500 | 4.000 |
| Conversão do paywall | LS + GA4 | 0 | 1,5% | 2,5% |
| MRR / assinantes ativos | Lemon Squeezy | US$ 0 | US$ 24 | US$ 120 |
| Churn mensal | LS | – | < 15% | < 10% |
| RPM de anúncios | AdSense/Mediavine | US$ 0 | US$ 4 | US$ 6 |
| **RPS** | cálculo | US$ 0 | US$ 6 | US$ 15 |

### 11.3 Plano de medição (obrigatório antes de qualquer otimização)
- **GA4**: `tool_start`, `tool_complete`, `file_download` (nome + tamanho), `paywall_view`, `checkout_click`, `purchase` (via webhook LS), `go_click` (`slug`, `source`, `locale`), `newsletter_signup`.
- **Search Console**: enviar sitemap, monitorar "Páginas não indexadas", usar o relatório de consultas para decidir o próximo conteúdo.
- **Afiliados**: exigir `subid`/`utm_content` por posição (hero, fim de ferramenta, sidebar, e-mail) — sem isso você não sabe qual CTA paga as contas.
- **UTMs** padronizados: `utm_source=worldhub&utm_medium=affiliate&utm_campaign={programa}&utm_content={posicao}`.

### 11.4 Rotina
- **Segunda (30 min):** números da semana no painel; 1 decisão (escalar, corrigir ou matar uma página).
- **Quarta (2 h):** 1 página nova (cluster) + internal links.
- **Sexta (1 h):** 5 ações de comunidade + 1 envio de newsletter.
- **Mensal (2 h):** revisão de preço, churn, top 10 páginas por receita, poda de páginas sem impressão após 90 dias.

---

## 12. Riscos e mitigação

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| AdSense recusar/limitar (thin content, alegações falsas, sem CMP) | Alta | Alto | Remover alegações, CMP, conteúdo único, 5 fichas completas, política editorial |
| Dependência de um único canal (Google) | Média | Alto | Comunidades + Pinterest + e-mail desde o mês 1 |
| Usuários burlarem o paywall client-side | Alta | Médio | Licença validada + foco em features difíceis de copiar (presets, lote, renomeação) |
| Concorrentes gigantes (Adobe, Smallpdf, Canva) | Alta | Alto | Não competir por termos genéricos; vencer em nicho, idioma e lote |
| Traduções automáticas penalizadas | Média | Médio | Traduzir só 3 idiomas, com revisão humana |
| Vercel Hobby (uso não comercial) | Certa | Médio | Migrar para Vercel Pro (US$ 20) ao ativar cobrança |
| Chargebacks/reembolsos | Média | Médio | Política de 7 dias clara, suporte por e-mail, portal de cancelamento |
| Bug em processamento de imagens (Safari/iOS) | Média | Alto | Testes em iOS, fallback de canvas, Sentry |
| Site quebra em produção sem ninguém ver | Média | Alto | CI + Sentry + status check semanal das 16 rotas |

---

## 13. Próximos 7 dias (checklist executável)

- [ ] Apagar `/test` e o bypass `?pro=1`.
- [ ] Rotear `BulkStudioPro` na página `bulk-studio` e corrigir o preset 2000×2000.
- [ ] Preencher o mapa `/go` com os 6 programas reais + `subid` + log de clique.
- [ ] Instalar GA4 + GSC + Bing + eventos.
- [ ] Remover os números inventados do hero e do footer.
- [ ] Criar os slots reais no AdSense e instalar CMP; desligar o banner enquanto não aprovado.
- [ ] Escrever a página de preços e o disclosure de afiliado.
- [ ] Publicar o primeiro cluster (3 páginas PT: "comprimir imagem para 500kb", "2000x2000 Shopify", "redimensionar fotos em lote").
- [ ] Fazer 5 respostas em comunidades de vendedores.
- [ ] Criar a planilha de acompanhamento com os 14 KPIs da seção 11.2.

---

## Anexos (arquivos entregues junto deste relatório)

- `docs/modelo-receita-1000usd.csv` — modelo de 12 meses (tráfego, anúncios, afiliados, assinaturas, patrocínio, custos) para você editar as premissas.
- `docs/calculadora-meta.html` — calculadora interativa: ajuste sessões, RPM, CTR de afiliado, conversão e preço para ver quanto falta para US$ 1.000.
