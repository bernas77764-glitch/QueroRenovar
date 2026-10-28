# Quer Renovar

Plataforma que liga pessoas que querem remodelar a sua casa a profissionais capazes de executar os trabalhos. O cliente descreve o que pretende renovar, divisão a divisão; a plataforma organiza um resumo dos trabalhos, apresenta uma estimativa indicativa e identifica as especialidades necessárias.

O documento base do produto está em [`docs/documento-base.md`](docs/documento-base.md). Este repositório segue-o como referência.

## Estado

**Iteração 1 — base e percurso do cliente (etapas 1 a 3).**

| Etapa | Estado |
|---|---|
| Página inicial | Feita |
| 1. Escolher divisões e quantidades (com nomes opcionais e atalho «casa inteira») | Feita |
| 2. Configurar cada divisão: área por intervalos ou exata, trabalhos, perguntas condicionais, observações | Feita |
| 3. Rever o projeto: resumo editável, trabalhos comuns à casa, localização e contexto | Feita |
| 4. Estimativa e especialidades | Especialidades a partir do catálogo; **estimativa por fazer** (exige tabela de preços validada) |
| 5. Contactos e pedido de propostas | Por fazer |
| Área interna da equipa | Por fazer (modelo de dados preparado em `prisma/schema.prisma`) |

O progresso do cliente fica guardado apenas no navegador (`localStorage`). Nada é enviado para um servidor nesta iteração.

## Tecnologia

- [Next.js](https://nextjs.org) 16 (App Router) com React 19 e TypeScript
- Tailwind CSS 4
- Prisma 7 + PostgreSQL (esquema preparado; ainda sem uso em runtime)
- Vitest para testes do catálogo e do domínio

## Começar

Requisitos: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000>.

Outros comandos:

```bash
npm run build       # compilação de produção
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # testes (vitest)
```

### Base de dados (opcional nesta iteração)

```bash
cp .env.example .env
docker compose up -d       # PostgreSQL local
npm run db:validate        # valida prisma/schema.prisma
```

As migrações e o cliente Prisma serão introduzidos quando a submissão de pedidos for implementada.

## Organização do código

```
docs/                      Documento base do produto
prisma/schema.prisma       Modelo de dados (documento base §12)
src/app/                   Rotas (App Router)
  page.tsx                 Página inicial
  projeto/divisoes/        Etapa 1 — escolher divisões
  projeto/divisoes/[id]/   Etapa 2 — configurar uma divisão
  projeto/rever/           Etapa 3 — rever o projeto
  projeto/estimativa/      Etapa 4 — estimativa (placeholder)
src/catalog/               Catálogo editável pela equipa: divisões, intervalos de área,
                           trabalhos, perguntas complementares, trabalhos comuns, especialidades
src/domain/                Estado do projeto, regras puras (redutor), persistência local
src/components/ui/         Componentes base acessíveis (botão, contador, cartão de escolha, diálogo…)
src/components/wizard/     Ecrãs do percurso do cliente
```

### Catálogo separado da interface

Conforme o documento base (§18), as listas de divisões e trabalhos, os intervalos de área, as perguntas complementares e o mapeamento para especialidades estão em `src/catalog/` e não nos ecrãs. A equipa pode afinar estas regras sem redesenhar o percurso.

- `rooms.ts` — tipos de divisão, intervalos de área (limites inequívocos: «até 4» é (0, 4], «mais de 4 até 7» é (4, 7]) e trabalhos oferecidos por divisão, com designações próprias quando necessário.
- `works.ts` — trabalhos, unidade de cálculo prevista, perguntas associadas, dependências (`implies`) e especialidades. Trabalhos sem regra de cálculo têm `requiresAssessment: true` e nunca entram a zero.
- `questions.ts` — perguntas complementares, todas com resposta «ainda não sei» quando a resposta possa exigir medição.
- `project-works.ts` — trabalhos comuns à casa, com `covers` para não contar duas vezes os trabalhos por divisão.
- `specialties.ts` — especialidades (documento base §8).

`validateCatalog()` verifica a integridade do catálogo em desenvolvimento e nos testes; um catálogo inconsistente falha de forma visível.

### Regras já garantidas

- Nenhuma divisão, quantidade ou trabalho vem pré-selecionado.
- Cada divisão tem identificador próprio; duas casas de banho são independentes.
- Alterar ou remover uma divisão não afeta as restantes; remover uma divisão preenchida pede confirmação.
- Retirar um trabalho apaga as respostas que só lhe pertenciam.
- «Não sei» e intervalos abertos ficam «por confirmar»; nunca se transformam em medidas ou zeros.
- Dependências entre trabalhos (ex.: trocar banheira por duche inclui canalização, impermeabilização e revestimentos) e trabalhos comuns à casa são identificados para serem contados uma só vez.
- O percurso funciona no telemóvel e com teclado; os estados não dependem só da cor.

## Decisões em aberto

Ver documento base §17: cobertura inicial, tabela de preços e IVA, modelo de encaminhamento, partilha da estimativa com profissionais, campos de contacto obrigatórios, retenção de dados e modelo de receita. Nenhuma destas decisões está assumida no código.
