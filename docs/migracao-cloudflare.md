# Migração do World Hub Pro para Cloudflare — runbook operacional

Data de referência: 21/10/2026. Domínio identificado no código: **www.iatools.online**. Confirme a propriedade e o domínio real antes do corte.

## 0. Situação e limites desta execução

**Preparado no repositório; não publicado na conta Cloudflare.** Não há conexão Cloudflare disponível nesta sessão nem credenciais Cloudflare configuradas no ambiente. DNS, nameservers, certificados, WAF e faturamento não foram alterados. Não envie tokens, senhas ou chaves no chat.

Arquitetura escolhida: **Next.js exportado no build + Workers Static Assets + Worker pequeno de roteamento**. Não é um servidor VPS; não há banco, upload de arquivos ou servidor Next.js em produção. As ferramentas continuam no navegador. A escolha evita adaptar o runtime completo do Next e mantém o custo inicial em zero, dentro das franquias. SSR futuro exigirá reavaliar um adaptador compatível.

- `next.config.ts`: exportação estática; configuração duplicada removida.
- `app/[locale]/layout.tsx` e páginas de ferramentas/diretório: parâmetros gerados no build.
- `cloudflare/worker.ts`: `/`, links legados sem locale, `/go/*`, `/healthz`.
- `wrangler.jsonc`: produção e staging separados, sem rotas de domínio configuradas.
- `public/_headers`: headers de segurança não invasivos; cache longo apenas nos assets com hash.
- `.github/workflows/cloudflare-staging.yml`: publicação manual somente em staging.
- `scripts/verify-cloudflare-build.mjs`, `scripts/smoke-cloudflare.mjs`, `tests/cloudflare.test.ts`: verificações automatizadas.
- Rota pública `/test`, que concedia Pro localmente sem pagamento, removida do artefato.
- Links da home/header agora preservam o locale. Os seis prefixos antigos foram preservados para não cortar URLs durante a migração.
- Next atualizado de 16.3.6 para o patch 16.3.8 e dependência source-map-js corrigida após audit.

**Não confundir migração com correção integral do produto:** textos em inglês em outros locales, `html lang` global, metadados incompletos, IDs de anúncios de exemplo, alegações comerciais e funcionalidades/paywall frágeis ainda precisam do backlog da auditoria. As traduções não foram implementadas nesta etapa. Destinos `/go` são links oficiais, não comprovantes de afiliação nem links com comissão garantida. Os slugs usados pelas ferramentas agora têm destinos fixos HTTPS; slugs desconhecidos retornam 404 em vez de um redirecionamento enganoso.

### Política de custos

| Recurso | Decisão inicial | Por quê |
|---|---|---|
| DNS, TLS gerenciado, Workers Static Assets | Usar Free | Base da migração |
| Worker de roteamento | Free, controlar franquia | Evitar SSR por visita |
| WAF Free Managed Ruleset e regras customizadas | Usar no domínio da zona | Proteção básica |
| DDoS padrão | Proteção automática | Não precisa comprar add-on |
| Polish | Não contratar agora | Não disponível no Free; otimizar no build |
| Mirage | Não implementar | Descontinuado e indisponível |
| Argo / Smart Shield | Desligado | Pago; pouco benefício esperado sem origem externa |
| Load Balancing | Não criar | Não existem dois backends independentes a balancear |
| Exportação contínua de logs / Logpush | Não contratar inicialmente | Confirmar preço, dataset e destino antes de habilitar |

Workers Free: 100.000 requisições dinâmicas/dia e 10 ms de CPU por execução segundo a documentação consultada. Requisições servidas diretamente por Static Assets não consomem a franquia de invocações do Worker. Free tem limites de arquivos e tamanho; o verificador usa 20.000 arquivos e 25 MiB por arquivo. No staging todas as requisições passam pelo Worker para aplicar `noindex` e `no-store`, portanto consomem a franquia dinâmica. Não há SLA de plano pago. Não habilitar upgrade ou recarga automática sem orçamento.

## 1. Inventário e backup antes de qualquer alteração

1. No provedor DNS atual, exportar a zona e guardar uma cópia privada fora do Git público.
2. Registrar nomes/valores/TTL dos registros de `@`, `www`, MX, SPF, DKIM, DMARC, CAA, TXT de verificações, subdomínios e quaisquer SRV.
3. Registrar nameservers, DNSSEC/DS e registrar do domínio. Não confundir migração de DNS com transferência de registrador: não é necessário transferir o domínio.
4. Na Vercel, registrar URL/ID do deployment que está funcionando, domínio e commit. Mantê-lo intacto por pelo menos 7 dias após o corte; não apagar projeto/domínio ainda.
5. Anotar o destino Vercel **exato mostrado para este projeto**. Não copiar IP ou CNAME genérico de um tutorial.
6. Se houver deploy automático da Vercel para esta branch, interrompê-lo/colocá-lo sob revisão antes de enviar estas mudanças: a nova build é estática e substitui middleware e `/go` por um Worker externo à Vercel.
7. Medir baseline de home, ferramentas e diretório: status HTTP, tempo de resposta, HTML, arquivos baixados e navegação mobile. Registrar problemas preexistentes separadamente.
8. Agendar uma janela de menor tráfego; evitar publicar conteúdo junto com o corte.

Benefício: rollback sem adivinhar registros e sem perder e-mail. Armadilha: o scan de DNS da Cloudflare não garante importar tudo, especialmente DKIM e registros pouco usados.

## 2. Publicar e testar staging antes do DNS

### Local (não exige conta)

```bash
npm ci
npm run test:cloudflare
npm run build:cloudflare
npm run preview:cloudflare -- --env staging
# Em outro terminal:
npm run smoke:cloudflare -- http://127.0.0.1:8787
```

A exportação fica em `out/`, ignorada pelo Git. Nunca editar essa pasta manualmente: o build a recria. Node 22 recomendado. O preview é local; não prova DNS/TLS/WAF reais.

### Na sua máquina autenticada na Cloudflare

```bash
npx wrangler login
npx wrangler whoami
npm run build:cloudflare
npx wrangler deploy --env staging
npm run smoke:cloudflare -- https://ENDERECO-EXATO-RETORNADO-PELO-WRANGLER
```

Substituir o endereço pelo resultado real, não por um hostname inventado. Staging usa `world-hub-pro-staging`, não possui custom domains e envia `X-Robots-Tag: noindex, nofollow` e `Cache-Control: no-store`. `noindex` não é autenticação: não colocar conteúdo privado em staging. Se necessário, usar Cloudflare Access com política de identidade e confirmar disponibilidade/configuração.

### GitHub Actions opcional

1. Criar environment `cloudflare-staging`; exigir revisão manual se disponível no plano do GitHub.
2. Criar token Cloudflare de privilégio mínimo, restrito à conta: usar o template/permissão de edição de Workers Scripts e somente permissões adicionais efetivamente exigidas pelo deploy. Não conceder DNS Edit ou Zone Settings Edit a esse token. Não usar Global API Key.
3. Guardar `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` nos Secrets do environment, nunca em JSON, `.env` versionado ou chat.
4. Revisar o workflow antes de enviar. Ele só aceita a branch `arena/1a86653d-world-hub-pro` e não publica automaticamente por push nem toca DNS.
5. `workflow_dispatch` precisa existir na branch padrão para aparecer/executar conforme as regras do GitHub; integrar via PR revisado primeiro. Nenhuma publicação remota foi executada nesta sessão.
6. Aguardar testes e build antes do deploy. Executar smoke tests contra a URL pública retornada.

Por que não Pages? Pages seria adequado para HTML puro; Workers Static Assets reúne o estático com os redirecionamentos necessários, sem manter duas implantações. Não instalar OpenNext/SSR completo para este conjunto de ferramentas de navegador. O adaptador mais recente também exige uma faixa de Next diferente da versão inicial; evitar uma migração dupla desnecessária.

## 3. DNS: mover a autoridade sem mudar a hospedagem ao mesmo tempo

1. Adicionar `iatools.online` à Cloudflare e escolher Free.
2. Conferir os registros importados contra o inventário, inclusive e-mail.
3. Inicialmente manter os registros web apontando à Vercel, preferencialmente **DNS only durante a troca de autoridade** para não misturar problemas de proxy e origem. E-mail/SSH/FTP continuam DNS only; MX e TXT não recebem proxy HTTP.
4. Se DNSSEC estiver ativo, remover o DS no registrador e aguardar o TTL do DS da zona pai expirar **antes** de trocar nameservers. Validar a ausência do DS. Não apenas desligar uma opção e trocar imediatamente.
5. No registrador, usar exatamente os dois nameservers atribuídos à sua zona Cloudflare.
6. Aguardar a zona ficar Active; validar resolução pública, web e entrega de e-mail.
7. Só depois ativar DNSSEC na Cloudflare e publicar o novo DS no registrador. Validar a cadeia antes de considerar concluído.

TTL: antes de mudanças de registros DNS only, reduzir para 300 s no provedor atual quando possível e aguardar o TTL antigo expirar. Registros proxied normalmente usam TTL Auto; não forçar um TTL manual incompatível. A troca de nameservers tem propagação própria, não é instantânea porque o A/CNAME foi reduzido.

```bash
dig NS iatools.online
dig DS iatools.online
dig MX iatools.online
dig TXT iatools.online
dig +dnssec iatools.online
```

A existência de RRSIG sozinha não prova validação. Validar também com resolvedor que valide DNSSEC e/ou DNSViz. Não colocar exportação privada da zona no repositório.

## 4. SSL/TLS e HTTPS

Na zona: **SSL/TLS → Overview → Full (strict)**. Não usar Flexible.

- Durante qualquer fase com origem Vercel proxied, a origem precisa atender HTTPS e ter certificado válido, não expirado, para o hostname solicitado. Erros 525/526 exigem corrigir TLS/SNI/certificado, não baixar a segurança para Flexible.
- Para Workers/Pages com domínio personalizado, a própria Cloudflare gerencia o endpoint e certificado. Não há um VPS onde instalar Origin CA. Full (strict) continua sendo a política correta para eventuais origens externas, mas não representa um segundo salto TLS para um servidor que não existe.
- Confirmar certificado Active antes de enviar tráfego para o custom domain. Revisar CAA se a emissão falhar; não apagar CAA sem compreender os emissores necessários.
- Ativar Always Use HTTPS quando todos os hostnames envolvidos tiverem HTTPS válido.
- TLS mínimo recomendado: 1.2; TLS 1.3 habilitado quando disponível.
- HSTS: deixar desligado durante a migração. Depois de estabilidade, considerar prazo inicial curto (por exemplo 1 dia), sem `includeSubDomains` nem preload. Só ampliar após garantir HTTPS em todos os destinos e no rollback.

Benefício: criptografia e prevenção de loops de HTTPS. Armadilha: HSTS/preload não se desfaz instantaneamente no navegador, mesmo se o DNS voltar.

## 5. Publicação de produção e corte de domínio

Depois de staging aprovado:

```bash
npm ci
npm run test:cloudflare
npm run build:cloudflare
npx wrangler deploy --env ""
# Testar primeiro a URL workers.dev retornada:
npm run smoke:cloudflare -- https://URL-REAL-DE-PRODUCAO-RETORNADA
```

`npm run deploy:cloudflare` publica staging por segurança; `npm run deploy:cloudflare:production` é a opção explícita de produção.

Esse comando publica o Worker `world-hub-pro`, mas o arquivo não possui rotas ou domínios. Portanto o comando sozinho não muda `www.iatools.online`.

1. Em Workers & Pages, abrir **world-hub-pro → Settings → Domains & Routes**.
2. Adicionar `www.iatools.online` como **Custom Domain**. Confirmar a substituição do registro existente somente na janela de corte e guardar seu valor antigo.
3. Adicionar o apex `iatools.online` quando aprovado. A Cloudflare gerencia a associação DNS e o certificado; não criar CNAME manual apontando para `workers.dev` nem inventar IP de Worker.
4. Criar uma **Single Redirect Rule** para apex → `https://www.iatools.online` preservando caminho e query. Usar 302 enquanto valida e 301 após estabilidade; não criar a regra inversa. Expressão de host: `http.host eq "iatools.online"`. Destino dinâmico: `concat("https://www.iatools.online", http.request.uri.path)` com preservação de query habilitada.
5. Manter URLs dos seis idiomas e o domínio canônico atual. Não cortar idiomas, renomear slugs ou mudar arquitetura de conteúdo nesta janela.
6. Registrar o ID da versão/deployment Cloudflare aprovada.
7. Executar smoke tests no domínio público e validar manualmente as ferramentas. Manter Vercel pronta para retorno, sem promover esta branch automaticamente lá.
8. Se desejar declarar custom domains no Wrangler depois, fazer isso como alteração separada e revisada. O token de staging não deve ganhar permissão de DNS para isso.
9. Após estabilidade do domínio, desabilitar workers.dev/preview URLs da **produção** se não forem necessários e proteger staging via Access se desejado. O staging já é separado e noindex. Não permitir que um endereço alternativo público contorne controles que você depende do WAF da zona.

Proxy otimizado significa **somente web HTTP/HTTPS no proxy** e uma origem/associação correta; não significa ligar nuvem laranja em todos os registros. WAF/Regras da sua zona precisam ser validados no custom domain, não no workers.dev compartilhado.

## 6. Cache, performance e substitutos de Page Rules

Usar **Cache Rules, Redirect Rules e Configuration Rules**, não montar uma infraestrutura nova em Page Rules legado. Começar sem regras amplas de cache: Static Assets já tem entrega e invalidação gerenciadas.

| Conteúdo | Política recomendada |
|---|---|
| `/_next/static/*` (nomes com hash) | Browser `public, max-age=31536000, immutable`; já em `_headers` |
| HTML / páginas de locale | Manter cache/browser padrão com revalidação; não forçar TTL de 1 ano |
| `/`, `/go/*`, `/healthz`, redirects por idioma | `Cache-Control: no-store`; Worker já aplica |
| Futuras APIs, checkout, login, webhooks | Bypass; nunca cachear estado de usuário |
| Sitemap, robots, ads.txt | Revalidação curta/padrão; não prender versão antiga por meses |

Regras de bypass podem ser adicionadas como defesa para as rotas dinâmicas, se você configurar regras de cache de zona: `(http.request.uri.path eq "/" or starts_with(http.request.uri.path, "/go/") or http.request.uri.path eq "/healthz")` → Bypass. Não adicionar depois uma regra genérica que sobrescreva esse bypass. O comportamento do cache de Static Assets deve ser validado pelos headers reais, não presumido a partir de um botão no dashboard.

**Nunca usar Cache Everything em todo o domínio.** A escolha de idioma por cookie/Accept-Language não pode ser compartilhada entre visitantes. Não ignorar query strings globalmente: arquivos Next/RSC e URLs de negócio podem depender delas. Não configurar fallback SPA 200 para toda URL; páginas inexistentes precisam retornar 404.

HTTP/2, HTTP/3 e compressão: manter/habilitar as opções suportadas no plano e validar a negociação. Não habilitar Rocket Loader no corte: pode alterar ordem dos scripts e quebrar hidratação, anúncios e bibliotecas PDF. Não usar tutoriais antigos de Auto Minify/Mirage como checklist atual.

Depois de publicar, purgar somente URLs HTML afetadas **se existir regra de cache de zona retendo conteúdo antigo**. Não fazer Purge Everything rotineiramente. Se usar purge no rollback, incluir cache de redirects e páginas alteradas.

## 7. WAF e regras customizadas

No Free há Free Managed Ruleset e até 5 custom rules; regras OWASP completas e alguns campos/ações dependem de plano. Não usar `cf.bot_management.score`, regex ou ação Log sem confirmar disponibilidade: Log de custom rules não está no Free.

1. Confirmar o Free Managed Ruleset ativo no domínio customizado.
2. Aplicar cada regra individualmente; testar a navegação e inspecionar Security Events após ativar. No Free, usar staging e ativação gradual, não prometer modo Log disponível.
3. Exemplos para este site estático, limitados ao hostname real:

**R1 — bloquear sondas de aplicações que o site não usa (Block):**

```text
(http.host in {"iatools.online" "www.iatools.online"} and
 (http.request.uri.path eq "/wp-login.php" or
  starts_with(http.request.uri.path, "/wp-admin/") or
  http.request.uri.path eq "/xmlrpc.php" or
  http.request.uri.path eq "/.env" or
  starts_with(http.request.uri.path, "/.git/")))
```

**R2 — bloquear métodos incompatíveis com a arquitetura estática (Block):**

```text
(http.host in {"iatools.online" "www.iatools.online"} and
 not http.request.method in {"GET" "HEAD" "OPTIONS"})
```

R2 só é correta enquanto formulários, pagamentos e beacons usam serviços externos e não existe API própria. Revisá-la ANTES de adicionar um webhook ou endpoint POST. Não bloquear `/.well-known/` em massa.

4. Rate limiting: considerar uma regra focada em `/go/*` **somente se houver abuso medido**, dentro da cota e períodos disponíveis no Free. Não limitar todos os assets por IP: usuários em redes compartilhadas e downloads legítimos sofrem falso positivo.
5. Não bloquear países inteiros em um site multilíngue. Não confiar em User-Agent como autenticação de Googlebot.
6. Não habilitar Bot Fight Mode sem testar crawlers, monitoramento, Adsense e acessibilidade; não é necessário para o corte.
7. Em incidente, desativar a regra ofensora, não desligar todo o WAF. Registrar expressão, ação e horário de cada mudança.

O WAF não corrige um paywall de localStorage nem protege arquivos premium públicos. Uma arquitetura estática não valida compra sozinha.

## 8. Imagens e assets: Polish, Mirage e alternativa gratuita

- **Mirage:** descontinuado em 15/09/2025 e não disponível. Substituir por `loading="lazy"`, `srcset`, `<picture>`, width/height explícitos. Não fazer lazy loading da imagem LCP.
- **Polish:** indisponível no Free. Se houver orçamento futuro e uma origem elegível, testar Lossless primeiro e WebP, comparar visual/bytes e `Cf-Polished` em respostas reais. Não presumir que marcar a opção otimiza automaticamente todo asset servido por Workers; verificar a compatibilidade do caminho de entrega antes de contratar.
- Gratuito agora: exportar imagens de marketing em WebP/AVIF durante produção/build, evitar originais gigantes, usar SVG seguro para ícones, dividir JS por ferramenta e carregar bibliotecas pesadas sob demanda.
- Neste site a maioria das imagens processadas é enviada pelo próprio visitante para um canvas local; Polish no CDN não otimiza essas imagens locais nem acelera o processamento da ferramenta.
- `images.unoptimized` evita depender do otimizador de imagens de um servidor Next ausente. Se forem usadas imagens Next/Image no futuro, fornecer variantes otimizadas no build ou um loader explicitamente configurado.
- Não contratar Cloudflare Images/R2 sem calcular armazenamento, operações e transformação. Não são necessários para a migração atual.

## 9. Argo e Load Balancing

**Argo Smart Routing / Smart Shield:** recurso pago/medido; manter desligado no orçamento zero. Serve para otimizar caminhos de rede, principalmente entre edge e origens. Nosso conteúdo está na própria plataforma, portanto medir TTFB antes de considerar. Se futuramente houver origem externa lenta, fazer teste controlado, conferir tabela atual e limites de cobrança. Não habilitar cobrança só porque aparece um botão recomendado.

**Load Balancing:** não criar. Workers/Static Assets já distribuem o serviço globalmente; isso não é igual a possuir dois backends independentes para failover. Considerar o add-on apenas quando houver pelo menos duas origens reais, health check coerente, deploys sincronizados, certificados válidos e orçamento. Vercel Hobby não é um standby comercial permanente compatível com o plano de monetização; é somente uma ponte temporária durante a migração. Failover entre Cloudflare e Vercel não é automático nesta entrega.

## 10. DDoS

Proteção DDoS padrão é automática na rede Cloudflare e disponível no Free; não exige inventar uma regra manual de ativação. Confirmar que os hostnames web usam a plataforma/proxy e acompanhar Security Analytics.

Em incidente: revisar tráfego e rotas, bloquear o padrão confirmado e considerar temporariamente Managed Challenge/Under Attack para páginas navegáveis, avaliando impacto em SEO, APIs e acessibilidade. Não deixar Under Attack permanentemente sem necessidade. A proteção DDoS não elimina todas as possibilidades de exaustão de franquias de aplicação. O código usa Static Assets primeiro em produção para evitar desperdiçar invocações em JS/CSS/HTML existentes.

## 11. Analytics, logs e alertas

1. Ativar Cloudflare Web Analytics para o domínio de produção. Usar inserção automática quando aplicável OU snippet do painel, nunca os dois. Confirmar recebimento de dados e Core Web Vitals. Não inventar token de beacon.
2. Usar Workers Metrics para invocações, erros, CPU, status e tendências. `/healthz` confirma execução, mas também monitorar `/en` e uma ferramenta para detectar falha nos assets.
3. Observability está preparada com amostragem de 10% e invocation logs desabilitados. O Worker não grava cookies, query strings, conteúdos de arquivos ou dados de pagamento em console. Sem logs personalizados, não esperar um registro detalhado de cada clique; acesso estático direto não executa o Worker.
4. Para diagnóstico curto: `npx wrangler tail world-hub-pro` (ou `--env staging`, usando a configuração). Requer autenticação. Cuidado ao exportar eventos: mascarar IPs, URLs sensíveis e identificadores; definir retenção.
5. Security Analytics/Events servem para revisar WAF/DDoS; dados podem ser amostrados e não equivalem a log completo de acesso.
6. Logs Free têm limites e retenção; segundo a tabela consultada em outubro de 2026, Workers Free inclui 200.000 eventos/dia com 3 dias de retenção. A Cloudflare anuncia mudança do modelo de Observability em 01/12/2026: revisar antes dessa data.
7. Logpush/Log Explorer e destinos externos: conferir dataset, disponibilidade e custo de ingestão/armazenamento antes de habilitar; não prometemos exportação ilimitada gratuita.
8. Configurar notificações suportadas pelo plano para erros, incidentes e uso. Se não houver alerta nativo para a métrica desejada, revisar diariamente o painel e usar monitor externo gratuito dentro de sua franquia.
9. Medir receita e conversões no fornecedor de pagamento/afiliados. CDN analytics não substitui analytics de negócio. Revisar consentimento/LGPD/GDPR antes de ativar scripts publicitários/marketing.

Critérios de observação: erros HTTP inesperados, p95 de latência, 404 em assets, comportamento mobile, consumo de invocações e relatos de usuários. Definir alertas, por exemplo 5xx >1% por 5 min (com volume significativo), home indisponível por 2 verificações independentes ou falha reproduzível no download de uma ferramenta.

## 12. Checklist pós-migração

### Antes de liberar produção

- [ ] Backup privado de DNS, TLS e deployment Vercel confirmado.
- [ ] `npm ci`, testes, build, audit e dry-run aprovados.
- [ ] Staging público testado sem trocar DNS; noindex confirmado.
- [ ] Sem `.env`, chaves, sourcemaps ou arquivos pagos publicados.
- [ ] Registros MX/TXT/DKIM/DMARC revisados; DNSSEC válido ou transição segura.
- [ ] Domínios/certificados Active e Full (strict) configurado onde aplicável.
- [ ] Recursos pagos mantidos desligados.

### Depois do corte

- [ ] `http://` redireciona para HTTPS sem loop.
- [ ] Apex redireciona uma vez para www preservando caminho/query.
- [ ] Seis prefixos e links profundos existentes continuam 200.
- [ ] `/` respeita idioma/cookie sem cache compartilhado.
- [ ] CTAs `/go/*` conhecidos retornam 307 HTTPS; desconhecidos retornam 404.
- [ ] `/test`, `/test.html` e URLs aleatórias retornam 404, não home 200.
- [ ] Arquivos `/_next/static/*` retornam 200 e **um único** `max-age=31536000, immutable` coerente.
- [ ] HTML revalida; redirecionamentos por visitante são no-store.
- [ ] `robots.txt`, `sitemap.xml`, `ads.txt` acessíveis; produção não tem noindex.
- [ ] Compressão, certificado e versões TLS verificados no navegador/curl externo.
- [ ] QR, compressão de imagens, PDF, ZIP e downloads testados no navegador desktop e mobile com arquivos pequenos e grandes adequados.
- [ ] Requests para cdnjs/Google/checkout testados em uma rede real; o sandbox não comprova serviços externos.
- [ ] Formulários/links de contato e e-mail do domínio funcionando.
- [ ] WAF não desafia usuários legítimos/crawlers/monitoramento sem necessidade.
- [ ] Analytics e painéis de erros recebem dados reais; não duplicam beacons.
- [ ] Sitemap reenviado ao Search Console, cobertura/404 acompanhados.
- [ ] Rollback exercitado em staging e deployment anterior ainda disponível.
- [ ] Revisão após 1 h, 24 h, 72 h e 7 dias; só então remover dependências temporárias.

## 13. Rollback de emergência

### Gatilhos

Indisponibilidade confirmada, erros 5xx sustentados, 525/526, assets essenciais 404, redirecionamento em loop ou falha de download introduzida no corte. Não confundir com bugs de ferramenta já existentes na baseline.

### A. Regra errada (primeira opção, minutos)

1. Pausar publicações.
2. Desativar apenas a última regra WAF/cache/redirect alterada.
3. Se necessário, purgar somente URLs afetadas por regra de cache.
4. Reexecutar smoke tests e testar ferramenta. Não desligar TLS/segurança globalmente como primeira resposta.

### B. Código novo ruim, Cloudflare ainda saudável

1. Em Workers → Deployments, restaurar a última versão conhecida como boa.
2. Alternativa CLI autenticada: `npx wrangler rollback ID-REAL-DA-VERSAO --name world-hub-pro` (verificar a versão e ajuda do CLI antes de confirmar).
3. Rollback do código não desfaz DNS, regras, bindings ou schema de banco. Aqui não há banco, mas é necessário verificar configuração do domínio.
4. Revalidar `/en`, `/healthz`, links e cache. Um primeiro deployment sem versão anterior exige a opção C.

### C. Retornar à Vercel mantendo DNS na Cloudflare

1. Confirmar que a URL antiga Vercel responde e o domínio continua vinculado com HTTPS válido.
2. Remover/desativar a associação **Custom Domain / Route** do Worker para os hosts afetados. Só editar CNAME pode não bastar enquanto um Worker ainda captura o hostname.
3. Restaurar os A/AAAA/CNAME exatos do inventário para `www` e apex. Remover conflitos. Usar DNS only para reduzir variáveis quando apropriado e compatível com a origem. Isso reduz a proteção da zona para esse tráfego: registrar como medida temporária.
4. Desativar regras específicas da nova origem se interferirem. Purgar conteúdo/redirects antigos quando aplicável.
5. Manter HTTPS válido; não usar Flexible. Respeitar HSTS já entregue a navegadores.
6. Aguardar TTL/propagação e testar em mais de um resolvedor/rede. O retorno por DNS não é instantâneo.
7. Registrar incidente; restaurar Cloudflare somente depois de corrigir em staging.

### D. Troca de nameservers (último recurso)

Só usar se o problema for a zona/DNS ou indisponibilidade do provedor, não um deploy de frontend. Restaurar a zona antiga antes; coordenar DS/DNSSEC com o provedor de destino e remover o DS incorreto aguardando TTL quando necessário. Depois trocar NS e validar cadeia. Nunca restaurar NS antigos deixando um DS que só corresponde à zona Cloudflare. Propagação pode levar horas; não é a rota de rollback rápido.

## 14. Validação realizada nesta sessão

- 8 testes unitários de idioma, redirects fixos, métodos, staging e health aprovados.
- Build Next.js com páginas pré-renderizadas, sem servidor Next em produção.
- Verificador do export: 188 arquivos HTML; 960 arquivos no momento do build, dentro dos limites usados no teste.
- Smoke HTTP local em Wrangler: idiomas, ferramentas, diretório, redirects, assets, 404, método e arquivos públicos.
- Dry-run de empacotamento Wrangler, sem upload/publicação/autenticação de conta.
- `npm audit`: zero vulnerabilidades conhecidas no lockfile após atualizações; não é garantia de ausência de falhas.
- DNS/TLS/WAF reais, propagação, compatibilidade de todos os navegadores e desempenho em usuários reais permanecem pendentes da implantação autenticada.

## Fontes oficiais consultadas

- Workers Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Roteamento seletivo: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/
- Headers: https://developers.cloudflare.com/workers/static-assets/headers/
- Limites: https://developers.cloudflare.com/workers/platform/limits/
- Preços Workers e logs: https://developers.cloudflare.com/workers/platform/pricing/
- Routing/domains: https://developers.cloudflare.com/workers/configuration/routing/
- DNS/NS: https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
- DNSSEC: https://developers.cloudflare.com/dns/dnssec/
- Full (strict): https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/
- Page Rules → Rules: https://developers.cloudflare.com/rules/reference/page-rules-migration/
- WAF Free: https://developers.cloudflare.com/waf/
- Custom rules/quotas: https://developers.cloudflare.com/waf/custom-rules/
- DDoS: https://developers.cloudflare.com/ddos-protection/
- Polish: https://developers.cloudflare.com/images/polish/
- Mirage descontinuado: https://developers.cloudflare.com/speed/optimization/images/mirage/
- Observability: https://developers.cloudflare.com/observability/pricing/
- Add-ons: https://www.cloudflare.com/plans/

Preços, nomes de menus e limites podem mudar. Confirmar no painel antes de aceitar cobrança.
