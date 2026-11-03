# Quero Renovar: histórico e guia de recuperação

> Documento para retomar o projeto noutra conta do Claude (por exemplo, Claude Teams) sem perder nada.
> Última atualização: 3 de novembro de 2026.

## 1. O mais importante: nada disto vive no Claude

O projeto **não está guardado na conta do Claude**. Está em três sítios que são teus e continuam a existir quando mudares de conta:

| Onde | O quê | Endereço |
|---|---|---|
| **GitHub** | Todo o código, a foto, este documento, o histórico de alterações | https://github.com/bernas77764-glitch/QueroRenovar |
| **Cloudflare** | O site publicado, o domínio, a base de dados dos pedidos | https://dash.cloudflare.com (conta de bernardo.soares@mgbautomoveis.pt) |
| **dominios.pt** | O registo do domínio `querorenovar.pt` | https://my.dominios.pt |

Ao mudar para o Claude Teams só perdes **as conversas**. Para continuar basta ligar o GitHub à nova conta e dar ao Claude acesso à Cloudflare (ver secção 9).

---

## 2. O negócio

Site de **angariação de pedidos (leads)** de pessoas que querem remodelar parte ou a totalidade de uma casa, garagem, escritório, etc.

1. O cliente descreve a obra no site e deixa os contactos.
2. A Quero Renovar encaminha o pedido para um **parceiro** (empresa de remodelações).
3. A Quero Renovar ganha uma **percentagem sobre o valor da adjudicação**.

Para o cliente o serviço é gratuito e sem compromisso.

---

## 3. Infraestrutura e identificadores

| Item | Valor |
|---|---|
| Site | https://querorenovar.pt e https://www.querorenovar.pt |
| Endereço de reserva | https://querorenovar.bernardo-soares.workers.dev |
| Repositório GitHub | `bernas77764-glitch/QueroRenovar`, ramo principal `main` |
| Conta Cloudflare (Account ID) | `0a66491f79a79d019048080b1da55fae` |
| Zona Cloudflare `querorenovar.pt` (Zone ID) | `7a8ab7f2ffbfadbf17bfd5328097332c`, plano Free, estado `active` |
| Nameservers (definidos no dominios.pt) | `harleigh.ns.cloudflare.com` e `kyree.ns.cloudflare.com` |
| Worker Cloudflare | `querorenovar`, com os domínios personalizados `querorenovar.pt` e `www.querorenovar.pt` |
| Base de dados dos pedidos | Cloudflare KV `querorenovar-pedidos`, ID `c64f98634dc0482d9bb4901088aace17`, binding `PEDIDOS` |
| Publicação automática | GitHub Actions (`.github/workflows/ci.yml`): cada push para `main` verifica e publica |
| Segredos no GitHub | `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` (Settings → Secrets and variables → Actions) |

Os **tokens** (chaves secretas) não estão neste documento de propósito. Se for preciso um novo, cria-se em Cloudflare → My Profile → API Tokens.

Na mesma conta Cloudflare existem também os workers `compramoscarros-site` e `compramoscarros-crm` (domínio `compramoscarros.pt`). Não fazem parte deste projeto e não lhes mexemos.

---

## 4. O que o site faz hoje

### Página inicial (`/`)
- Topo com a foto de fundo (profissional a aplicar massa numa parede) e um gradiente azul por cima.
- Título «Quer remodelar a sua casa?» e botão **«Pedir propostas grátis»**.
- Garantias: gratuito, sem compromisso, profissionais da sua zona.
- Cartões dos 8 espaços, «Como funciona» em 3 passos, «Porquê o Quero Renovar» e uma faixa verde final com outro botão.

### Pedido em 5 passos (`/pedido/...`)
Cada passo aparece num cartão branco sobre uma faixa com a foto.

| Passo | Rota | Conteúdo |
|---|---|---|
| 1. Espaços | `/pedido/espacos` | 8 cartões: Corredores/Circulações, Sala, Cozinha, Quarto, Casa de banho, Escritório, Closet, Garagem/Arrecadação. Ao escolher um cartão aparecem **− e +** para indicar quantos (máximo 9 por tipo). |
| 2. Áreas | `/pedido/areas` | Para cada espaço: Até 10 m², 10 a 20 m², Mais de 20 m² ou **Personalizado** (m² exatos, de 1 a 2000). |
| 3. Trabalhos | `/pedido/trabalhos` | Lista abaixo, mais um campo opcional de observações. |
| 4. Urgência | `/pedido/urgencia` | Imediato (até 10 dias), Médio prazo (até 30 dias), Longo prazo (até 3 meses), Sem urgência. |
| 5. Contactos | `/pedido/contactos` | Página de agradecimento: nome, email, telefone, **distrito e concelho** (listas ligadas), aceitação dos Termos e botão «Enviar e receber propostas». No fim mostra uma referência do pedido, por exemplo `QR-1A2B3C4D`. |

**Trabalhos disponíveis:**

| Trabalho | Pede também |
|---|---|
| Remodelação total | Nível de qualidade |
| Pavimento | Nível de qualidade |
| Bancada | Nível de qualidade |
| Armários | Nível de qualidade |
| Janelas | Quantidade |
| Portas | Quantidade |
| Canalização | — |
| Eletricidade | — |
| Paredes | — |
| Pintura | — |
| Azulejos e revestimentos | Nível de qualidade |
| Louças sanitárias e duche | Nível de qualidade |
| Tetos falsos | — |
| Climatização | — |
| Isolamento | — |
| Outro trabalho | Descrição em texto |

Os níveis de qualidade são: Económico, Médio e Premium.

### Outras páginas
- `/termos`: Termos e Condições e Política de Privacidade (rascunho, ver pendências).

### Regras de funcionamento
- Até ao envio, as respostas ficam só no navegador do cliente. Os contactos nunca ficam guardados no navegador.
- Cada passo diz o que falta preencher. Abrir um passo sem completar os anteriores leva de volta ao passo em falta.
- O servidor volta a validar tudo antes de guardar.
- Um reenvio do mesmo pedido (duplo clique, falha de rede) não cria um segundo registo.
- Um campo escondido (*honeypot*) trava envios automáticos de bots.
- Cada pedido guarda a versão dos Termos que o cliente aceitou e a data em que foi recebido.

---

## 5. Onde ver os pedidos recebidos

Painel da Cloudflare → **Storage & Databases** → **KV** → `querorenovar-pedidos`.

- Há uma chave por pedido: `pedido:<id>`.
- Os metadados da chave mostram a referência, a data, o nome, o distrito, o concelho e a urgência.
- O valor da chave é um JSON com tudo, incluindo o campo `summary`: um resumo em texto simples (contactos, espaços, trabalhos, urgência, observações).

**Ainda não existe** aviso por email quando chega um pedido, nem uma página interna para ver a lista de pedidos. Ver pendências.

---

## 6. O que fizemos, por ordem

### 28 out 2026: arranque, marca e alojamento
1. **Primeira versão do produto** (commit `f1c3ee9`), a partir do documento base (`docs/documento-base.md`): percurso divisão a divisão com catálogo de trabalhos, perguntas condicionais, revisão do projeto e esqueleto de estimativa; modelo de dados em `prisma/schema.prisma`. Foi substituída no dia seguinte pelo formulário de angariação, mas continua no histórico do Git (commit `a2bd555`) caso se queira recuperar o catálogo detalhado ou a lógica de estimativa.
2. **Marca** (commit `96d3283`): o logotipo enviado em JPG foi convertido para `public/logo.png` (fundo transparente) e o símbolo recriado em SVG (`src/app/icon.svg`, `public/simbolo.svg`, ícone Apple). Paleta tirada do logotipo: azul-marinho `#08283d` e verde `#16a080`; nos botões e texto usa-se um verde mais escuro (`#0f7d63`) porque o verde do logotipo sobre branco não cumpre o contraste mínimo de acessibilidade.
3. **Alojamento** (commits `e1be1a6`, `a2bd555`): escolhido Cloudflare Workers com o adaptador **OpenNext** (`@opennextjs/cloudflare`), e não o *vinext* da Cloudflare, por este ser experimental. Os **Cache Components** do Next.js 16 foram desativados em `next.config.ts` porque bloqueavam o worker no runtime da Cloudflare (confirmado em pré-visualização local). Deploy automático pelo GitHub Actions com os secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
4. **Domínio na Cloudflare:** zona `querorenovar.pt` criada (plano Free, sem registos DNS anteriores) e nameservers alterados no dominios.pt (Servidores de Nome → personalizados, só os dois da Cloudflare).
5. **Segurança:** um API token da Cloudflare foi colado numa conversa nesse dia. Deve ser apagado em Cloudflare → My Profile → API Tokens e substituído por um novo, também no secret do GitHub, se ainda não foi feito.

### 29 out 2026: domínio e DNS
1. **Diagnóstico.** O `querorenovar.pt` não resolvia: o dominios.pt apontava para os seus servidores por defeito (`dnsX.host-redirect.com`), que recusavam os pedidos. A zona na Cloudflare estava `pending`, mas o worker e o endereço workers.dev já funcionavam.
2. **Correção no dominios.pt:** os nameservers foram trocados para `harleigh.ns.cloudflare.com` e `kyree.ns.cloudflare.com`. Cerca de 30 minutos depois a zona ficou `active`.
3. **O site não abria no computador do Bernardo** (`ERR_TIMED_OUT`). A causa era o **router Vodafone**, que ainda guardava a resposta DNS antiga. Ficou resolvido ao reiniciar o router. Se acontecer a outra pessoa: reiniciar o router, ou no Chrome ativar DNS seguro (Cloudflare 1.1.1.1).
4. **Script de configuração do ambiente cloud do Claude:** falhava no `npm ci` por correr fora da pasta do projeto. Ficou corrigido para `cd /home/user/QueroRenovar && npm ci`.

### 29 out 2026: site de angariação ([PR #1](https://github.com/bernas77764-glitch/QueroRenovar/pull/1))
- O percurso antigo (divisão a divisão, com estimativas) foi substituído pelo formulário de angariação em 5 passos descrito acima.
- Criada a base de dados KV `querorenovar-pedidos` e a API `POST /api/pedidos`.
- Página de Termos e Condições com «QueroRenovar, Lda.» e o email `geral@querorenovar.pt`.

### 29 out 2026: distrito e concelho em listas ([PR #2](https://github.com/bernas77764-glitch/QueroRenovar/pull/2))
- Os 18 distritos e as 2 regiões autónomas, com os 308 concelhos. O concelho é filtrado pelo distrito escolhido e o servidor confirma que pertence a esse distrito.

### 29 out 2026: design com foto ([PR #3](https://github.com/bernas77764-glitch/QueroRenovar/pull/3))
- A foto enviada (`Fundo.jpg`, 3 MB) foi otimizada para `public/fundo-960.webp` (telemóvel), `public/fundo-1920.webp` (computador) e `public/fundo-1200.jpg` (pré-visualização ao partilhar o link). O original continua no histórico do Git.
- Página inicial redesenhada e passos do pedido apresentados em cartão.

---

## 7. Decisões tomadas (podem ser revistas)

- **Os trabalhos aplicam-se ao pedido inteiro, não a cada espaço.** O formulário fica mais rápido, mas o parceiro não sabe, por exemplo, se o pavimento é só para a cozinha.
- Acrescentámos à lista pedida: Portas, Pintura, Azulejos e revestimentos, Louças sanitárias, Tetos falsos, Climatização, Isolamento e Outro trabalho. Também há nível de qualidade na Remodelação total e um campo de observações.
- **Os pedidos ficam no Cloudflare KV**, e não numa base de dados SQL, porque o token disponível não tinha acesso ao D1. Para os volumes iniciais chega.
- O ficheiro `prisma/schema.prisma` e o `docker-compose.yml` são do modelo antigo e **não são usados**.

---

## 8. Pendências

### Antes de anunciar o site (obrigações legais)
- [ ] **Constituir a empresa** e pôr o **NIF** em `src/app/termos/page.tsx`, que neste momento mostra `[NIF]`. O NIF `500100100` foi descartado: era fictício e o dígito de controlo nem sequer é válido.
- [ ] **Sede**: uma Lda. tem sempre sede registada, e a lei do comércio eletrónico obriga a mostrá-la no site. Pode ser uma morada de domiciliação.
- [ ] **Ativar o email `geral@querorenovar.pt`**. Hoje não recebe nada, porque o domínio não tem registos MX. Cloudflare → `querorenovar.pt` → Email → **Email Routing** → criar `geral` e reencaminhar para uma caixa existente (gratuito).
- [ ] **Revisão jurídica** dos Termos, sobretudo a partilha de dados com os parceiros (RGPD). Quando os Termos mudarem, atualizar `TERMS_VERSION` em `src/lead/store.ts`.
- [ ] Se começares a recolher pedidos antes de ter empresa, tem de ser em nome pessoal, com atividade aberta. Fala com um contabilista.

### Melhorias sugeridas
- [ ] Aviso por email a cada pedido novo.
- [ ] Página interna, protegida, com a lista de pedidos e o estado de cada um.
- [ ] Opcional: indicar os trabalhos por espaço.

---

## 9. Como retomar numa nova conta do Claude

1. **Ligar o GitHub** à nova conta (claude.ai → Settings → Connectors → GitHub) e dar acesso ao repositório `bernas77764-glitch/QueroRenovar`.
2. **Criar um ambiente** no Claude Code (web) com este repositório e:
   - variáveis de ambiente `CLOUDFLARE_API_TOKEN` (um token com permissões de Workers, Zone/DNS e KV) e `CLOUDFLARE_ACCOUNT_ID=0a66491f79a79d019048080b1da55fae`;
   - acesso à rede *Limited* com gestores de pacotes permitidos e os domínios `api.cloudflare.com`, `cloudflare-dns.com`, `dns.google`, `querorenovar.pt`, `www.querorenovar.pt` e `querorenovar.bernardo-soares.workers.dev`;
   - script de configuração: `cd /home/user/QueroRenovar && npm ci`.

### Se for preciso mudar o site para outra conta Cloudflare
1. Na conta nova: *Add a domain* → `querorenovar.pt` → Free → colocar os novos nameservers no dominios.pt.
2. Criar um namespace KV e pôr o id em `wrangler.jsonc` (`kv_namespaces[0].id`); para migrar pedidos, exportar as chaves `pedido:*` da conta antiga e importá-las com `wrangler kv key put`.
3. Criar um API token (modelo *Edit Cloudflare Workers* + *Zone · DNS · Edit* + *Workers KV Storage · Edit*) e atualizar os secrets do GitHub com o token e o Account ID novos.
4. Fazer push para `main` (ou `npm run deploy`): o worker e os domínios personalizados são criados pelo deploy.
3. **Primeira mensagem para o Claude**, por exemplo:
   > Lê `docs/HISTORICO-DO-PROJETO.md` e o `README.md`. É o meu projeto Quero Renovar, já publicado em querorenovar.pt. Continua a partir das pendências.
4. A forma de trabalhar que temos usado: o Claude trabalha num ramo, abre um pull request, espera que as verificações automáticas passem e faz o merge. O site publica-se sozinho cerca de 2 minutos depois.

### Comandos úteis (para quem programar)

```bash
npm install          # instalar dependências
npm run dev          # site local em http://localhost:3000 (com KV local)
npm test             # testes
npm run lint         # verificação de código
npm run typecheck    # verificação de tipos
npm run deploy       # publicar manualmente na Cloudflare
```

---

## 10. Mapa do código

```
src/app/page.tsx                 Página inicial
src/app/pedido/                  Os 5 passos do pedido
src/app/api/pedidos/route.ts     Recebe e guarda os pedidos
src/app/termos/page.tsx          Termos e Privacidade (dados da empresa no topo do ficheiro)
src/lead/catalog.ts              Espaços, áreas, trabalhos, qualidades e urgências (editar aqui para mudar opções)
src/lead/request.ts              Regras e validação do pedido
src/lead/store.ts                Gravação no KV
src/lead/concelhos.ts            Distritos e concelhos
src/components/pedido/           Ecrãs dos passos
src/app/globals.css              Cores da marca e foto de fundo
public/                          Logótipo, símbolo e fotos
wrangler.jsonc                   Configuração do worker, domínios e KV
```

Cores da marca: verde `#16a080` e azul-escuro `#08283d`.
