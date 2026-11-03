# Quero Renovar — guia de recuperação e continuação do projeto

Atualizado em 2026-11-03. Este documento existe para que o projeto possa ser retomado por qualquer pessoa (ou por uma nova sessão do Claude) noutra conta, sem depender do histórico de conversas. Tudo o que importa está no repositório GitHub e nas contas de serviço listadas abaixo; as conversas com o Claude não são necessárias para continuar.

## 1. O que é

**Quero Renovar** (querorenovar.pt) é um site de angariação de pedidos (leads) de pessoas que querem remodelar parte ou a totalidade de uma casa, garagem ou escritório. O cliente descreve a obra em cinco passos e deixa os contactos; a equipa encaminha o pedido para profissionais parceiros, que apresentam propostas. É gratuito e sem compromisso para o cliente. Empresa: **QueroRenovar, Lda.**; contacto geral: `geral@querorenovar.pt`.

A ideia original, mais ambiciosa (estimativa de custos e identificação de especialidades), está em `docs/documento-base.md`. A primeira implementação seguiu-a (percurso por divisão com catálogo de trabalhos e perguntas condicionais); foi depois substituída por um percurso mais simples, focado em angariar o pedido e os contactos. O código da primeira versão continua no histórico git (commit `a2bd555`), caso se queira recuperar o catálogo detalhado ou o modelo de estimativa.

## 2. Onde está tudo

| Recurso | Localização | Conta / acesso |
|---|---|---|
| **Código** (fonte única da verdade) | https://github.com/bernas77764-glitch/QueroRenovar — branch `main` | GitHub, utilizador `bernas77764-glitch` |
| **Site publicado** | Cloudflare Workers, worker `querorenovar` | Cloudflare, conta de `bernardo.soares@mgbautomoveis.pt`, Account ID `0a66491f79a79d019048080b1da55fae` |
| **Domínio** (registo) | `querorenovar.pt` no **dominios.pt** (my.dominios.pt), conta em nome de Miguel Frade, nº cliente 313112 | dominios.pt |
| **Domínio** (DNS) | Zona `querorenovar.pt` na Cloudflare, Zone ID `7a8ab7f2ffbfadbf17bfd5328097332c`; nameservers do dominios.pt apontados para os da Cloudflare | Cloudflare |
| **Pedidos recebidos** (dados dos clientes) | Cloudflare KV, namespace `querorenovar-pedidos` (id `c64f98634dc0482d9bb4901088aace17`) | Cloudflare → Storage & Databases → KV |
| **Deploy automático** | GitHub Actions, `.github/workflows/ci.yml` | Secrets do repositório: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |
| **Logotipo** | `public/logo.png` (lettering), `public/simbolo.svg` e `src/app/icon.svg` (símbolo) | no repositório |
| **Foto de fundo** | `public/fundo-*.webp` / `.jpg` | no repositório |

**Não há base de dados externa nem outros serviços.** Se a conta GitHub e a conta Cloudflare continuarem acessíveis, nada se perde. Se o repositório for movido para outra organização GitHub, basta atualizar o remoto; se for recriado, há que repor os dois secrets do GitHub Actions.

## 3. Como recuperar numa conta nova (checklist)

1. **Código:** clonar `https://github.com/bernas77764-glitch/QueroRenovar` (ou transferir o repositório para a organização nova em *Settings → Danger zone → Transfer*; os secrets não são transferidos).
2. **Correr localmente:** Node.js 22+, `npm install`, `npm run dev` → http://localhost:3000. Testes: `npm test`; lint e tipos: `npm run lint`, `npm run typecheck`.
3. **Deploy manual** (sem GitHub Actions): `npx wrangler login` e `npm run deploy`. Precisa de acesso à conta Cloudflare onde está o worker, ou de criar um worker novo noutra conta (ver secção 6).
4. **Deploy automático:** no repositório GitHub, *Settings → Secrets and variables → Actions*, criar `CLOUDFLARE_API_TOKEN` (token criado em https://dash.cloudflare.com/profile/api-tokens com o modelo *Edit Cloudflare Workers* mais *Zone · DNS · Edit* na zona `querorenovar.pt`) e `CLOUDFLARE_ACCOUNT_ID`. Cada push para `main` passa a publicar.
5. **Pedidos recebidos:** estão no KV da Cloudflare, não no código. Para os exportar: Cloudflare → KV → `querorenovar-pedidos` → cada chave `pedido:<id>` tem o pedido em JSON com um campo `summary` legível.
6. **Sessão nova do Claude:** ver secção 8.

## 4. Estado atual (2026-11-03)

### Feito e publicado

- Página inicial com foto de fundo, lista de espaços, «Como funciona», «Porquê» e chamada à ação.
- Percurso do pedido em cinco passos (`/pedido/espacos` → `/pedido/areas` → `/pedido/trabalhos` → `/pedido/urgencia` → `/pedido/contactos`), com validação em cada passo e progresso guardado no navegador até ao envio.
- Contactos com distrito e concelho em listas ligadas (308 concelhos em `src/lead/concelhos.ts`), aceitação dos termos obrigatória.
- Receção dos pedidos em `POST /api/pedidos`, validados de novo no servidor e guardados no Cloudflare KV; referência `QR-XXXXXXXX` devolvida ao cliente; reenvios não duplicam; *honeypot* contra bots.
- Página de Termos e Condições e Privacidade (`/termos`), versão `2026-10-29`, identificando QueroRenovar, Lda. (sem morada).
- Marca aplicada: lettering no cabeçalho, símbolo em SVG (favicon e ícone Apple), paleta a partir do logotipo (azul-marinho `#08283d`, verde `#16a080`; verde mais escuro `#0f7d63` em botões e texto por contraste).
- Alojamento em Cloudflare Workers via OpenNext, CI com lint, tipos, testes e build, deploy automático em cada push.

### Por confirmar / em aberto

- **Domínio:** o worker está ligado a `querorenovar.pt` e `www.querorenovar.pt`, mas na última verificação (2026-10-29) o nome ainda não resolvia (`DNS_PROBE_FINISHED_NXDOMAIN`) — a mudança de nameservers no dominios.pt ainda não tinha propagado ou não ficou gravada. Confirmar em Cloudflare → Domains → querorenovar.pt (deve dizer *Active*) e, no dominios.pt → Servidores de Nome, que está «personalizados» com apenas os dois `…ns.cloudflare.com`. Se estiver tudo bem e continuar sem resolver, contactar o suporte do dominios.pt.
- **Endereço provisório:** `querorenovar.bernardo-soares.workers.dev` (ativar em Workers & Pages → querorenovar → Domains → *workers.dev*).
- **SSL/TLS:** quando a zona estiver *Active*, definir *Full (strict)* em SSL/TLS → Overview.
- **Token da Cloudflare:** um token foi exposto numa conversa em 2026-10-28; deve ser apagado em *API Tokens* e substituído por um novo, também no secret do GitHub (se ainda não foi feito).
- **Termos:** falta a morada da empresa e a revisão jurídica.
- **Email:** não há registos MX; endereços `@querorenovar.pt` exigem configurar email (Cloudflare Email Routing para reencaminhar, ou um fornecedor).
- `prisma/schema.prisma` e `docker-compose.yml` são do modelo de dados do documento base; não são usados pelo percurso atual.

## 5. Decisões técnicas e porquê

| Decisão | Motivo |
|---|---|
| Next.js 16 (App Router) + TypeScript + Tailwind 4 | Uma só aplicação para site, percurso e futura área interna; mobile-first. |
| Cloudflare Workers via **OpenNext** (não *vinext*) | O utilizador quis Cloudflare; OpenNext é estável e suporta Next 16.4+; vinext é experimental. |
| **Cache Components desativados** (`next.config.ts`) | Vêm ligados por omissão no Next 16 e bloqueavam o worker no runtime da Cloudflare (confirmado em pré-visualização local). Não são necessários. |
| Imagens `unoptimized: true` | Só há ficheiros da marca; evita o *binding* de Cloudflare Images. |
| Pedidos em **Cloudflare KV** | Sem base de dados externa; suficiente para leads; consulta pelo painel. Se crescer, migrar para D1 ou PostgreSQL gerido via Hyperdrive (esquema em `prisma/`). |
| Validação partilhada navegador/servidor (`src/lead/request.ts`) | O servidor nunca aceita o que o navegador não aceitaria. |
| Ids do catálogo nunca mudam | Ficam gravados nos pedidos (`src/lead/catalog.ts`). |
| Marca «Quero Renovar» (duas palavras) na interface | Segue o logotipo; o documento base diz «Quer Renovar». |

## 6. Mudar o site de conta Cloudflare (se necessário)

1. Na conta nova: *Add a domain* → `querorenovar.pt` → plano Free → anotar os novos nameservers e colocá-los no dominios.pt.
2. Criar um namespace KV (*Storage & Databases → KV → Create*) e colocar o seu id em `wrangler.jsonc` → `kv_namespaces[0].id`. Para migrar pedidos já recebidos, exportá-los da conta antiga (chaves `pedido:*`) e importá-los com `wrangler kv key put`.
3. Criar um API token (modelo *Edit Cloudflare Workers* + *Zone · DNS · Edit*) e atualizar os secrets do GitHub (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` da conta nova).
4. Fazer push (ou `npm run deploy`): o worker e os *custom domains* são criados pelo deploy.

## 7. Mapa do código

```
docs/documento-base.md        Visão original do produto (estimativas, especialidades)
docs/recuperacao-do-projeto.md Este guia
src/app/page.tsx              Página inicial
src/app/pedido/*              Passos 1–5 (cada página renderiza um componente de src/components/pedido)
src/app/api/pedidos/route.ts  Receção dos pedidos (POST)
src/app/termos/page.tsx       Termos e privacidade
src/lead/catalog.ts           Espaços, áreas, trabalhos, níveis, urgência (editar aqui para mudar opções)
src/lead/request.ts           Estado do pedido, redutor, validação, resumo em texto
src/lead/store.ts             Gravação no KV, referência, versão dos termos
src/lead/concelhos.ts         Distritos e concelhos
src/lead/LeadProvider.tsx     Estado no navegador (localStorage até ao envio)
src/components/pedido/*       Ecrãs dos passos
src/components/ui/*           Botão, cartão de escolha, campos, avisos
wrangler.jsonc                Worker, bindings (ASSETS, WORKER_SELF_REFERENCE, KV PEDIDOS), domínios
open-next.config.ts           Adaptador OpenNext (sem cache incremental)
next.config.ts                Cache Components off, imagens sem otimização
.github/workflows/ci.yml      Verificação + deploy
```

Comandos: `npm run dev`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run preview` (worker local), `npm run deploy`.

## 8. Retomar com uma sessão nova do Claude

Ambiente (cloud) recomendado para a sessão:

- **Acesso à rede:** *Limited*, com gestores de pacotes permitidos, e os domínios `api.cloudflare.com`, `cloudflare-dns.com`, `dns.google`, `querorenovar.pt`, `www.querorenovar.pt`, `querorenovar.bernardo-soares.workers.dev`.
- **Variáveis de ambiente:** `CLOUDFLARE_API_TOKEN` (token novo, nunca colado no chat), `CLOUDFLARE_ACCOUNT_ID=0a66491f79a79d019048080b1da55fae`.
- **Script de configuração:** `npm ci`.

Mensagem inicial sugerida:

> Projeto Quero Renovar — lê primeiro docs/recuperacao-do-projeto.md e o README.md. Site de angariação de pedidos de remodelação em Next.js 16, publicado em Cloudflare Workers via OpenNext com deploy automático pelo GitHub Actions; pedidos guardados em Cloudflare KV. Tarefa: [descrever]. Antes de alterar o catálogo, lembra-te de que os ids ficam gravados nos pedidos.

## 9. Próximos passos sugeridos

1. Confirmar que `https://querorenovar.pt` abre (secção 4) e definir SSL *Full (strict)*.
2. Substituir o token da Cloudflare exposto.
3. Configurar email `geral@querorenovar.pt` (Cloudflare Email Routing é gratuito) e completar os termos com a morada.
4. Notificação de novos pedidos por email à equipa (hoje só ficam no KV); depois, uma área interna mínima para consultar e encaminhar pedidos.
5. Rede de profissionais parceiros e critérios de encaminhamento (documento base §8 e §17).
6. Se se quiser retomar a estimativa de custos, partir do código em `a2bd555` e da tabela de preços validada com profissionais.

## 10. Histórico de commits (resumo)

| Data | Commit | O quê |
|---|---|---|
| 2026-10-28 | `f1c3ee9` | Base do projeto e percurso por divisão (etapas 1–3 do documento base) |
| 2026-10-28 | `96d3283` | Marca: logotipo, símbolo SVG, paleta |
| 2026-10-28 | `e1be1a6` | Cloudflare Workers via OpenNext, domínio, CI |
| 2026-10-28 | `a2bd555` | Deploy automático pelo GitHub |
| 2026-10-29 | `b439733` | Novo percurso de angariação (espaços, áreas, trabalhos, urgência, contactos) com KV |
| 2026-10-29 | `97aace8`, `b2166ec` | Termos: QueroRenovar, Lda., geral@querorenovar.pt |
| 2026-10-29 | `12ef9b1` | Distrito e concelho em listas ligadas |
| 2026-10-29 | `edee961` | Design: foto de fundo, página inicial redesenhada |
