# World Hub Pro

Hub de ferramentas de navegador e diretório de IA. O catálogo atual contém 16 ferramentas e 10 itens de diretório, com seis prefixos de idioma preservados. Ter uma URL localizada não significa que todo o conteúdo já esteja traduzido. Receita, afiliações e funcionalidade completa não são garantidas pelo deploy.

## Stack e hospedagem

Next.js 16, React 19, Tailwind 4. Build estático em `out/`, servido por Cloudflare Workers Static Assets. Um Worker pequeno trata escolha de idioma, links `/go/*` e health check. Sem banco ou servidor Next.js em produção.

## Desenvolvimento

```bash
npm ci
npm run dev
```

O servidor Next de desenvolvimento não emula os redirects do Worker. Para testar o ambiente de hospedagem:

```bash
npm run test:cloudflare
npm run build:cloudflare
npm run preview:cloudflare -- --env staging
# Em outro terminal:
npm run smoke:cloudflare -- http://127.0.0.1:8787
```

Node 22 recomendado. Não executar `next start`: esta aplicação agora usa exportação estática.

## Deploy Cloudflare

Na sua máquina autenticada, após ler o runbook:

```bash
npx wrangler login
npm run build:cloudflare
npx wrangler deploy --env staging
```

Não adicionar domínios nem alterar DNS antes de validar staging. `wrangler.jsonc` não tem rotas/domínios de produção configurados. O workflow GitHub Actions é manual e publica somente staging; credenciais ficam em Secrets do environment.

**Guia completo:** [Migração Cloudflare: DNS, TLS, cache, segurança, checklist e rollback](docs/migracao-cloudflare.md).

**Auditoria de produto:** [Auditoria e plano de receita](docs/auditoria-e-plano-1000usd.md).

## Limitações e segurança

- Pagamentos e conteúdo exclusivo exigem plataforma externa ou validação segura; localStorage não comprova compra.
- Recursos pagos Cloudflare não estão habilitados. DNS/TLS/WAF só são aplicados na conta após configuração autorizada.
- Não versionar tokens, `.dev.vars`, arquivos `.env` sensíveis ou exportações privadas de DNS.
- A migração não resolve todos os problemas preexistentes de conteúdo, anúncios, SEO e ferramentas listados na auditoria.
- Manter o deployment anterior intacto durante a janela de rollback; não publicar automaticamente esta branch na antiga origem Vercel.
