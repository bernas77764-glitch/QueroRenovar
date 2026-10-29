# Quero Renovar

<p align="center"><img src="public/logo.png" alt="Quero Renovar" width="360"></p>

Site de angariação de pedidos (leads) de pessoas que querem remodelar parte ou a totalidade de uma casa, garagem, escritório, etc. O cliente descreve a obra em poucos passos e deixa os contactos; a equipa encaminha o pedido para um profissional parceiro.

O documento base original do produto está em [`docs/documento-base.md`](docs/documento-base.md). O percurso atual segue a especificação de angariação descrita abaixo, mais simples que a do documento base.

## Percurso do cliente

| Passo | Rota | O que o cliente faz |
|---|---|---|
| Início | `/` | Apresentação e botão «Pedir propostas grátis» |
| 1. Espaços | `/pedido/espacos` | Escolhe os espaços (cartões). Um cartão escolhido mostra − e + para indicar quantos (ex.: 2 quartos) |
| 2. Áreas | `/pedido/areas` | Indica a área de cada espaço: até 10 m², 10 a 20 m², mais de 20 m² ou personalizado (m² exatos) |
| 3. Trabalhos | `/pedido/trabalhos` | Escolhe os trabalhos; nível de qualidade (económico, médio, premium) ou quantidade onde se aplica; observações opcionais |
| 4. Urgência | `/pedido/urgencia` | Imediato (até 10 dias), médio prazo (até 30), longo prazo (até 3 meses) ou sem urgência |
| 5. Contactos | `/pedido/contactos` | Página de agradecimento: nome, email, telefone, concelho da obra, aceitação dos termos e envio |
| Termos | `/termos` | Termos e Condições e Política de Privacidade (rascunho: completar a identificação da empresa) |

Até ao envio, as respostas ficam só no navegador (`localStorage`); os contactos nunca são guardados lá. Cada passo valida as suas respostas e, se faltar algo, diz o quê. Abrir um passo sem os anteriores completos leva de volta ao passo em falta.

## Pedidos recebidos

O envio faz `POST /api/pedidos`. O servidor volta a validar tudo com as mesmas regras do navegador e guarda o pedido no **Cloudflare KV**, namespace `querorenovar-pedidos` (binding `PEDIDOS` em `wrangler.jsonc`):

- uma chave por pedido: `pedido:<id do pedido>`;
- o valor é JSON com o pedido, os contactos, a data de receção, a versão dos termos aceites e um resumo em texto (`summary`) legível sem a aplicação;
- os metadados da chave têm a referência, a data, o nome, o concelho e a urgência.

Para ver os pedidos: painel da Cloudflare → Storage & Databases → KV → `querorenovar-pedidos`.

Um reenvio do mesmo pedido (duplo clique, falha de rede) não cria um segundo registo. Há um campo escondido (*honeypot*) contra bots.

## Tecnologia

- [Next.js](https://nextjs.org) 16 (App Router) com React 19 e TypeScript
- Tailwind CSS 4
- Cloudflare Workers via OpenNext, domínio querorenovar.pt, Cloudflare KV para os pedidos
- Vitest para testes das regras do pedido

## Começar

Requisitos: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000>. Em desenvolvimento, os pedidos enviados ficam num KV local (`.wrangler/`), não no da produção.

Outros comandos:

```bash
npm run build       # compilação de produção
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # testes (vitest)
```

## Alojamento: Cloudflare Workers

O site corre em Cloudflare Workers através do adaptador [OpenNext](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`), com o domínio `querorenovar.pt`. A configuração está em `wrangler.jsonc`, `open-next.config.ts` e `next.config.ts`. Cada *push* para `main` publica automaticamente (`.github/workflows/ci.yml`).

```bash
npm run preview   # compila e corre o worker localmente (runtime da Cloudflare)
npm run deploy    # compila e publica (pede login na Cloudflare na primeira vez)
```

Notas:

- **Cache Components** do Next.js 16 estão desativados em `next.config.ts`: não os usamos e não correm de forma fiável no runtime da Cloudflare.
- **Imagens** usam `unoptimized: true` (só há os ficheiros da marca).
- `prisma/schema.prisma` e `docker-compose.yml` são do modelo de dados do documento base e não são usados pelo percurso atual.

## Organização do código

```
src/app/                   Rotas (App Router)
  page.tsx                 Página inicial
  pedido/                  Passos 1 a 5 do pedido
  api/pedidos/route.ts     Receção e gravação dos pedidos
  termos/                  Termos e Condições e Privacidade
src/lead/
  catalog.ts               Espaços, áreas, trabalhos, níveis de qualidade e urgência
  request.ts               Estado do pedido, regras puras (redutor), validação partilhada com o servidor
  store.ts                 Gravação no KV
  concelhos.ts             Os 308 concelhos (sugestões no formulário)
  LeadProvider.tsx         Estado no navegador
src/components/pedido/     Ecrãs dos passos
src/components/ui/         Componentes base acessíveis (botão, cartão de escolha, campos, avisos)
```

Para acrescentar ou mudar espaços, trabalhos ou níveis, editar `src/lead/catalog.ts`. Os `id` ficam gravados com cada pedido: não os mudar depois de haver pedidos.
