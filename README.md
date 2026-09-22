# WORLD-HUB-PRO — 50 Tools + 500 AI Directory | 12 Languages | $50/day

Híbrido 1+3: Hub de Ferramentas Grátis + Diretório de IAs. 1 domínio, 12 línguas, tripla monetização.

## Monetização
- **AdSense/Monetag** $8 RPM x 5k views = $40/dia
- **Afiliado** 5 vendas x $5 = $25/dia (Canva, Adobe, ElevenLabs, Jasper 30%)
- **Featured** $29/mês x 20 sponsors = $20/dia

## Stack
Next.js 14, Tailwind, 12 locales (en,es,pt,fr,de,it,ja,ko,zh,ar,hi,ru), Vercel ISR, Prisma (opcional).

## Rotas
- `/en` `/es` `/pt` ... 12 home hreflang
- `/[locale]/tools/[slug]` 50 tools x 12 = 600 páginas
- `/[locale]/directory/[slug]` 500 AIs x 12 = 6000 páginas
- `/[locale]/admin` CRUD

## Rodar
```bash
npm install
npm run dev # http://localhost:3000/en
npm run build
```

## Deploy Vercel
```bash
vercel --prod
# Env: NEXT_PUBLIC_ADSENSE_ID, STRIPE_*, DATABASE_URL
```

## .bat para iniciantes
- `INICIAR.bat` - git init + push
- `ATUALIZAR.bat` - git add . + push
- `CORRIGIR-VERCEL.bat` - fix vercel.json
