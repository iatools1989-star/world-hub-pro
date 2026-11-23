# World Tools Hub

Site de ferramentas gratuitas de navegador + diretorio de IA.
Publicado em **https://iatools.online** (Cloudflare Workers, via OpenNext).

## Stack

- Next.js 16 (App Router) + React 19 + Tailwind 4
- `@opennextjs/cloudflare` — o build do Next adaptado para Workers
- Deploy manual: `npm run deploy`

> OpenNext ainda nao suporta Turbopack, por isso o build usa `next build --webpack`.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build e deploy

```bash
npm run build      # next build --webpack
npm run preview    # roda localmente no runtime do Worker (workerd)
npm run deploy     # build + wrangler deploy
```

Se as variaveis `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` estiverem no
ambiente, o `wrangler` autentica sem pedir login.

## Estrutura

```
app/[locale]/           paginas (locale fixo em 'en')
  tools/[slug]          16 ferramentas client-side
  directory/[slug]      10 servicos de IA
  tools, directory      paginas de indice
  about, contact, privacy, terms, affiliate-disclosure
app/go/[slug]           redirect de afiliado (valida destino)
lib/seo.ts              SITE_URL, canonical, JSON-LD, breadcrumbs
lib/data.ts             TOOLS, DIRECTORY_ITEMS, LOCALES
```

## Regras do projeto

- **Tudo gratuito.** Nao existe plano pago, paywall ou upsell.
- **Nenhuma prova social inventada.** Sem nota, sem contagem de usuarios, sem avaliacao falsa.
- **Links de afiliado sao identificados.** Ver `/en/affiliate-disclosure`.
- **Processamento no navegador.** As ferramentas nao enviam arquivos para servidor algum.
