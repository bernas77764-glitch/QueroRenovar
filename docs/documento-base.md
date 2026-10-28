# Quer Renovar — Documento base da plataforma

Versão: 0.1 — base para discussão, desenho e desenvolvimento  
Data: 28 de outubro de 2026  
Marca de trabalho: **Quer Renovar**  
Domínio pretendido: **querrenovar.pt**, sujeito a confirmação de disponibilidade

## 1. O que queremos criar

O Quer Renovar é uma plataforma que liga pessoas que querem remodelar a sua casa a profissionais capazes de executar os trabalhos.

O cliente descreve o que pretende renovar através de um percurso simples, divisão a divisão. A plataforma transforma essas escolhas num resumo organizado dos trabalhos, apresenta uma estimativa indicativa de custo e identifica os profissionais ou empresas adequados ao projeto.

O ponto de partida é uma necessidade concreta: “Tenho uma casa de banho antiga e quero fazer uma nova.” O cliente não precisa de saber preparar um mapa de trabalhos, identificar todas as especialidades ou explicar tecnicamente uma obra.

**Proposta de valor:** ajudar o cliente a perceber o que quer fazer, quanto poderá custar e quem o pode executar.

## 2. Estado deste documento

Este documento organiza a ideia inicial. Não representa uma especificação fechada nem pressupõe que as funcionalidades já existem.

### Definido pela equipa nesta fase

- A marca de trabalho é Quer Renovar.
- O foco é a remodelação de espaços existentes, desde uma divisão até uma casa inteira.
- A plataforma liga clientes a profissionais de remodelações.
- O cliente escolhe os tipos de divisão e a quantidade de cada tipo.
- Cada divisão é configurada individualmente, começando pela área em intervalos.
- Os trabalhos apresentados dependem do tipo de divisão.
- O resultado inclui uma estimativa e a identificação das especialidades necessárias.
- A recolha de contactos acontece depois da configuração e da apresentação da estimativa.

### Propostas deste documento, ainda ajustáveis

As listas de divisões e trabalhos, os limites de área, as perguntas complementares, o processo de seleção de profissionais, as áreas internas e as prioridades de lançamento são propostas de arranque. Devem ser afinadas pela equipa antes da implementação.

Não estão definidos preços de mercado, comissões, modelo de receita, parceiros, cobertura geográfica ou compromissos de prazo de resposta.

## 3. O problema que resolvemos

Quem quer fazer uma remodelação encontra frequentemente dificuldades em:

- Definir os trabalhos necessários e explicar o resultado que pretende.
- Perceber a ordem de grandeza do investimento.
- Saber se precisa de uma empresa de remodelações ou de vários profissionais.
- Encontrar profissionais que trabalhem na sua zona e executem aquele tipo de projeto.
- Comparar propostas que descrevem trabalhos diferentes.
- Repetir a mesma explicação a vários contactos.

A plataforma deve tornar o pedido claro e reutilizável. O cliente preenche uma vez e obtém uma base comum para falar com os profissionais.

## 4. Público e foco inicial

### Cliente

Particular que pretende renovar uma ou mais divisões de uma habitação existente e precisa de orientação para definir os trabalhos, estimar custos e encontrar quem execute.

### Profissional ou empresa

Empresa de remodelações, empreiteiro ou profissional de uma especialidade que pretende receber pedidos compatíveis com os seus serviços e zona de atuação.

### Foco proposto para a primeira versão

Começar por remodelações interiores: cozinhas, casas de banho e restantes divisões da casa. Permitir configurar uma casa inteira através das suas divisões e de trabalhos comuns ao imóvel.

Jardins, exteriores, construção de raiz, obras estruturais e gestão integral da execução ficam para avaliação posterior. Pedidos que envolvam intervenções técnicas não cobertas pelo estimador devem poder seguir para avaliação profissional, com essa limitação visível.

## 5. Princípios da experiência

1. **Perguntas simples.** Usar linguagem que o cliente reconheça: “Trocar o chão”, “Substituir a bancada”, “Mudar a banheira por um duche”.
2. **Uma decisão de cada vez.** Mostrar apenas as perguntas relevantes para a divisão e os trabalhos escolhidos.
3. **Sem escolhas presumidas.** Não iniciar com divisões, quantidades ou trabalhos selecionados.
4. **Permitir dúvidas.** Incluir “Ainda não sei” quando a resposta possa exigir medição ou aconselhamento.
5. **Resultado antes dos contactos.** Mostrar a estimativa disponível e o resumo antes de pedir nome, email ou telefone.
6. **Controlo do cliente.** Permitir voltar atrás, alterar escolhas e rever o pedido antes do envio.
7. **Transparência.** Distinguir sempre estimativa da plataforma, informação em falta e orçamento apresentado por um profissional.
8. **Prioridade ao telemóvel.** O percurso deve ser confortável num ecrã pequeno, com botões claros e progresso visível.

## 6. Percurso principal do cliente

```text
Entrada na plataforma
  → Escolher divisões e quantidades
  → Configurar cada divisão: área, trabalhos e detalhes relevantes
  → Rever o projeto e indicar a zona da obra
  → Consultar estimativa e especialidades necessárias
  → Preencher contactos e confirmar o pedido
  → Encaminhar para profissionais compatíveis
  → Receber confirmação e indicação do próximo passo
```

As “janelas” correspondem a ecrãs ou etapas do mesmo percurso. O formato visual será definido no desenho da experiência; não exige abrir novas janelas do navegador.

### Etapa 1 — O que quer renovar?

Apresentar os tipos de divisão com controlo de quantidade, inicialmente a zero:

| Tipo de divisão proposto | Exemplos de quantidade |
|---|---|
| Cozinha | 0, 1, 2… |
| Casa de banho | 0, 1, 2… |
| Quarto | 0, 1, 2… |
| Sala | 0, 1, 2… |
| Hall ou corredor | 0, 1, 2… |
| Arrecadação | 0, 1, 2… |
| Lavandaria | 0, 1, 2… |
| Outro espaço interior | 0, 1, 2… |

O cliente pode escolher “Uma casa inteira” como atalho, mas deve confirmar as divisões e quantidades. Essa opção não cria um pacote de trabalhos nem assume que tudo será substituído.

**Exemplo:** uma cozinha, duas casas de banho e uma arrecadação geram quatro divisões independentes: Cozinha 1, Casa de banho 1, Casa de banho 2 e Arrecadação 1.

Permitir atribuir nomes opcionais, como “Casa de banho da suite”. O cliente só avança depois de selecionar pelo menos uma divisão.

### Etapa 2 — Configurar cada divisão

Apresentar uma divisão de cada vez, com indicação como “Divisão 2 de 4 — Casa de banho 1”. Dentro de cada divisão, seguir esta ordem:

1. Área aproximada.
2. Trabalhos pretendidos.
3. Detalhes necessários para os trabalhos selecionados.
4. Revisão breve e passagem à divisão seguinte.

Permitir navegar entre divisões sem perder respostas. Cada divisão mantém as suas próprias escolhas, mesmo quando existem várias do mesmo tipo.

#### Área aproximada

Usar intervalos adaptados ao tipo de divisão. Os valores seguintes servem apenas para desenhar o primeiro protótipo:

| Divisão | Intervalos propostos |
|---|---|
| Casa de banho | Até 4 m²; mais de 4 até 7 m²; mais de 7 até 10 m²; mais de 10 m² |
| Cozinha | Até 8 m²; mais de 8 até 12 m²; mais de 12 até 20 m²; mais de 20 m² |
| Restantes divisões | Até 10 m²; mais de 10 até 20 m²; mais de 20 até 30 m²; mais de 30 m² |

Os intervalos não podem sobrepor-se. Permitir indicar uma área exata, se o cliente a souber, ou escolher “Não sei a área”. Não obrigar a medir para continuar a descrever o projeto.

Uma categoria aberta, como “mais de 20 m²”, não permite assumir uma área máxima. Quando o cálculo depender dessa medida, pedir uma aproximação adicional ou indicar que essa parte precisa de avaliação.

#### Trabalhos por divisão

Permitir selecionar vários trabalhos. Os nomes devem explicar o resultado pretendido; o detalhe técnico pode aparecer como ajuda.

| Divisão | Trabalhos propostos para o catálogo inicial |
|---|---|
| Cozinha | Trocar pavimento; renovar revestimentos de parede; pintar; substituir móveis; substituir bancada; trocar lava-loiça e torneira; alterar canalização; alterar tomadas e iluminação; instalar eletrodomésticos; renovar teto |
| Casa de banho | Trocar pavimento; trocar revestimentos de parede; substituir sanita, lavatório ou bidé; substituir móvel; trocar banheira por duche; substituir base e resguardo; trocar torneiras; renovar canalização; renovar eletricidade e iluminação; melhorar ventilação; impermeabilizar; renovar teto ou pintura |
| Quarto ou sala | Trocar pavimento; pintar paredes e tetos; reparar superfícies; colocar teto falso; alterar iluminação e tomadas; substituir portas e rodapés; instalar ou renovar roupeiro ou móvel fixo |
| Hall ou corredor | Trocar pavimento; pintar; renovar iluminação; substituir portas e rodapés; instalar arrumação |
| Arrecadação | Renovar pavimento; reparar ou pintar paredes e teto; melhorar iluminação e tomadas; instalar arrumação; avaliar humidade ou ventilação |
| Lavandaria | Renovar pavimento e paredes; instalar móveis e bancada; alterar pontos de água e esgoto; alterar tomadas; melhorar ventilação |
| Outro espaço interior | Descrever o espaço e escolher trabalhos comuns; permitir observações para avaliação |

Acrescentar “Outro trabalho” e “Preciso de ajuda a decidir”. Um trabalho sem regra de cálculo deve ficar identificado como sujeito a avaliação, sem ser tratado como gratuito.

#### Perguntas complementares

Mostrar apenas o que afeta o trabalho escolhido. Exemplos:

- Pavimento: pretende substituir tudo ou apenas parte? É necessário remover o existente?
- Móveis de cozinha: pretende conservar, renovar frentes ou substituir os móveis? Sabe o comprimento aproximado?
- Bancada: sabe o comprimento aproximado? Que tipo de material pretende, ou ainda não decidiu?
- Casa de banho: pretende manter as peças no mesmo sítio ou mudar a disposição?
- Pintura: inclui paredes, teto ou ambos? Existem superfícies degradadas?
- Eletricidade: são alterações pontuais ou uma renovação mais abrangente? Ainda não sabe?
- Materiais e equipamentos: pretende fornecimento e instalação ou já tem alguns materiais?

Fotografias e observações são opcionais. Não pedir informação de todos os trabalhos quando o cliente selecionou apenas um.

Uma intenção como “mudar a banheira por um duche” pode implicar remoção, canalização, impermeabilização e revestimentos. A plataforma deve explicitar essas dependências e tratá-las uma única vez no cálculo.

### Etapa 3 — Rever o projeto

Mostrar todas as divisões, áreas, trabalhos e dúvidas pendentes num resumo editável.

Recolher nesta etapa apenas o contexto necessário para estimar e procurar profissionais:

- Localidade ou código postal da obra, sem exigir a morada completa.
- Tipo de imóvel e se está habitado, quando isso afetar a estimativa.
- Prazo pretendido, incluindo “Ainda estou a explorar”.
- Condições de acesso relevantes, se forem usadas no cálculo ou no encaminhamento.

Permitir registar trabalhos comuns à casa, como a renovação global da instalação elétrica. Esses trabalhos devem ter âmbito próprio para não serem contados novamente em cada divisão.

### Etapa 4 — Estimativa e profissionais necessários

Apresentar:

- Intervalo estimado para o projeto, quando os dados e a tabela de preços o permitirem.
- Desagregação por divisão e principais grupos de trabalhos.
- Trabalhos incluídos, exclusões e elementos por confirmar.
- Indicação explícita de custos com ou sem IVA e de eventuais parcelas ainda não calculadas.
- Especialidades necessárias e motivo de cada uma.
- Ações “Alterar o projeto” e “Quero receber propostas”.

Se existirem parcelas relevantes por avaliar, identificar o valor como **estimativa parcial**, junto do resultado. Se não houver base suficiente, apresentar “Precisamos de mais informação para estimar este projeto”.

**Texto proposto:** “Esta estimativa baseia-se nas escolhas que fez. O valor final depende das medidas, dos materiais, do estado do espaço e da avaliação dos profissionais.”

Mostrar as especialidades necessárias antes de exigir os contactos. Mostrar empresas concretas depende de existirem parceiros reais e compatíveis; não apresentar perfis ou disponibilidade fictícios.

### Etapa 5 — Contactos e pedido de propostas

Depois de consultar o resultado, o cliente pode avançar para a ligação a profissionais.

Campos propostos: nome, email, telefone e preferência de contacto. A obrigatoriedade de email e telefone deve ser definida pela operação, recolhendo apenas o necessário.

Antes de confirmar, explicar o que será enviado, a quem ou a que tipo de destinatários, para que finalidade e qual o próximo passo. Qualquer opção de marketing deve ser separada do pedido de propostas.

O envio só acontece após uma ação explícita, como **“Enviar pedido a profissionais”**. Consultar a estimativa não envia o projeto nem partilha contactos.

Na primeira versão, o encaminhamento pode ser feito pela equipa, com apoio da plataforma. O cliente deve receber uma confirmação com referência do pedido e um prazo de resposta apenas se a operação o puder cumprir.

## 7. Regras da estimativa

### Base do cálculo

O motor de estimativa deve usar um catálogo editável de trabalhos, quantidades e intervalos de preços. A tabela de preços precisa de validação com profissionais antes de apresentar valores comerciais ao público.

Cada trabalho deve indicar:

- Unidade de cálculo: m², metro linear, unidade, conjunto ou avaliação individual.
- Dados necessários e origem da quantidade: resposta do cliente, medição ou hipótese explícita.
- Intervalo de custo e componentes incluídos: materiais, mão de obra, remoção, transporte ou outros.
- Dependências, incompatibilidades e âmbito: divisão ou projeto inteiro.
- Data, fonte de validação e versão da regra de preço.

**Lógica proposta:** estimativa do projeto = soma dos trabalhos por divisão + trabalhos comuns + custos gerais aplicáveis, sem repetir componentes já incluídos.

### Cuidados essenciais

- A área do chão não equivale à área das paredes, ao comprimento da bancada ou à extensão dos móveis. Usar medidas próprias ou hipóteses visíveis para cada caso.
- Uma área por intervalo deve gerar uma faixa coerente de custo, sem transformar silenciosamente o intervalo numa medida exata.
- Respostas “Não sei” não podem ser convertidas em zero nem em escolhas de materiais assumidas.
- Trabalhos sem preço ou sem quantidade suficiente ficam pendentes de avaliação; nunca entram a zero num total apresentado como completo.
- Demolição, preparação, entulho e deslocação devem ser tratados explicitamente, quando aplicáveis, e sem duplicação entre trabalhos.
- Se existirem níveis de materiais ou acabamentos, pedir a escolha ou mostrar claramente a hipótese usada.
- Apresentar eventuais reservas para imprevistos separadamente, com uma regra definida pela equipa.
- Definir o tratamento do IVA antes do lançamento e mostrar a base usada. Não inferir taxas a partir de respostas insuficientes.
- Guardar a versão da estimativa associada ao pedido. Alterações futuras à tabela não devem reescrever o resultado que o cliente recebeu.

Não são fixados valores monetários neste documento. Nos protótipos, quaisquer preços de demonstração devem estar identificados como tal.

## 8. Identificação e ligação aos profissionais

### Mapeamento inicial proposto

| Trabalho | Especialidades potencialmente necessárias |
|---|---|
| Remodelação de várias divisões com várias especialidades | Empresa de remodelações ou empreiteiro com capacidade de coordenação |
| Móveis, roupeiros ou portas | Carpinteiro ou empresa de mobiliário |
| Bancadas | Fornecedor ou instalador de bancadas, conforme o material |
| Água, esgotos, torneiras e peças sanitárias | Canalizador |
| Tomadas, circuitos e iluminação | Eletricista |
| Pavimentos e revestimentos | Aplicador de pavimentos ou revestimentos |
| Pintura e preparação de superfícies | Pintor |
| Tetos falsos e divisórias | Aplicador de gesso cartonado |
| Impermeabilização | Profissional ou empresa com essa competência |
| Ventilação e extração | Profissional de ventilação, podendo exigir articulação com outras especialidades |

O mapeamento é configurável. Um trabalho pode exigir várias competências e uma empresa pode cobrir várias delas. A lista final deve agrupar especialidades repetidas e explicar a sua relação com os trabalhos selecionados.

Para projetos com várias especialidades, propor duas vias a validar:

1. Uma empresa que apresente proposta para o conjunto e assegure a coordenação contratada.
2. Profissionais por especialidade, esclarecendo quem coordena os trabalhos.

Não sugerir que o cliente tem de contratar separadamente todos os profissionais listados. Também não assumir que o Quer Renovar coordena a execução: esse serviço ainda não foi definido.

### Critérios de compatibilidade

- Serviços e especialidades prestados.
- Zona de atuação.
- Dimensão e tipo de projeto aceites.
- Disponibilidade confirmada, quando conhecida.
- Critérios de admissão e verificação definidos pela equipa.

Apenas usar expressões como “verificado”, avaliações ou garantias quando existir um processo real que as sustente. O número de profissionais por pedido e a forma de partilha dos contactos ficam por definir.

Sem profissionais compatíveis, explicar a situação e permitir deixar o pedido para análise, sem prometer propostas ou prazos inexistentes.

## 9. Informação enviada ao profissional

O pedido deve conter uma versão organizada e consistente do projeto:

- Referência do pedido, data e versão do resumo.
- Zona da obra e contexto relevante do imóvel.
- Divisões, quantidades, áreas e trabalhos escolhidos.
- Materiais, equipamentos, fotografias e observações fornecidos.
- Dúvidas e medições por confirmar.
- Prazo pretendido.
- Contactos disponibilizados pelo cliente para esse pedido.

**Proposta a decidir:** partilhar também a estimativa da plataforma, identificada como indicativa, ou usá-la apenas como orientação para o cliente. Essa decisão deve ser explícita antes de desenhar a receção de propostas.

## 10. Primeira versão a desenvolver

### Essencial para lançar

- Página inicial com explicação simples e botão para começar.
- Seleção de tipos e quantidades de divisões.
- Configuração individual de área e trabalhos.
- Perguntas condicionais para os trabalhos selecionados.
- Resumo editável do projeto.
- Localização aproximada e contexto mínimo da obra.
- Estimativa transparente, com indicação de parcelas pendentes.
- Lista de especialidades necessárias.
- Recolha de contactos depois do resultado.
- Confirmação explícita do envio e registo efetivo do pedido.
- Área interna mínima para a equipa consultar e encaminhar pedidos.
- Catálogo de trabalhos e preços atualizável pela equipa.

Proposta operacional: começar com encaminhamento acompanhado pela equipa. Não é necessário construir logo uma área autónoma completa para cada profissional.

### Evolução posterior

- Contas de cliente e profissional, com recuperação de projetos entre dispositivos.
- Propostas estruturadas para comparação de trabalhos e exclusões.
- Mensagens, visitas e disponibilidade dentro da plataforma.
- Avaliações associadas a trabalhos efetivos.
- Acompanhamento da obra, documentação e pagamentos, se fizerem parte do modelo futuro.
- Novas categorias, como exteriores e jardins.

O modelo de receita, as comissões e os serviços de coordenação exigem decisão própria e não devem ser assumidos no primeiro desenho.

## 11. Área interna da equipa

Prever, no mínimo:

- Consulta dos pedidos, contactos e resumo enviado.
- Estados simples: recebido, em análise, à procura de profissionais, encaminhado, concluído ou encerrado sem correspondência.
- Registo dos profissionais associados e do encaminhamento efetuado, evitando envios duplicados.
- Gestão de especialidades, zonas de atuação e informação confirmada dos parceiros.
- Edição do catálogo, regras e versões de preços.
- Notas internas com acesso restrito à equipa.

“Concluído” deve identificar o encerramento do acompanhamento do pedido. Não deve ser interpretado automaticamente como obra executada.

## 12. Organização dos dados

Esta estrutura serve de referência para quem desenhar e desenvolver a plataforma; não impõe uma tecnologia.

| Elemento | Informação principal |
|---|---|
| Projeto | Identificador, localização, contexto do imóvel, prazo, estado e datas |
| Divisão | Identificador próprio, projeto, tipo, nome, intervalo ou área exata |
| Trabalho selecionado | Divisão ou projeto, tipo, respostas, quantidade e dependências |
| Estimativa | Versão, hipóteses, parcelas, intervalo, exclusões e estado de completude |
| Cliente | Contactos e preferências fornecidos no pedido |
| Profissional | Serviços, cobertura, capacidade e informação verificada |
| Encaminhamento | Pedido, destinatário, data, estado e registo da ação |

Cada divisão precisa de identificador próprio: duas casas de banho são dois espaços independentes. Os contactos só se associam ao projeto quando o cliente decide avançar.

## 13. Requisitos de funcionamento

- Alterar uma divisão não pode apagar as respostas das restantes.
- Adicionar uma divisão cria uma configuração vazia; remover uma divisão preenchida pede confirmação e atualiza o resumo.
- Ao retirar um trabalho, os seus detalhes e custos deixam de influenciar o projeto.
- O progresso deve ser preservado durante a navegação. A recuperação após fechar o navegador e entre dispositivos deve ser definida antes de ser prometida na interface.
- Os passos devem funcionar com teclado, ter campos identificados e não depender apenas de cor.
- O projeto deve poder ser enviado mesmo quando algumas parcelas precisam de avaliação, com essa condição visível.
- Submeter novamente por falha de ligação não pode criar pedidos ou encaminhamentos duplicados.
- Só mostrar sucesso quando o pedido tiver sido guardado. Em caso de falha, preservar os dados e permitir tentar novamente.
- Tratar dados de contacto, fotografias e acessos internos de acordo com uma política de privacidade e retenção a definir antes do lançamento.

## 14. Exemplo completo de utilização

### Pedido

O cliente escolhe uma cozinha, duas casas de banho e uma arrecadação.

| Divisão | Área escolhida | Trabalhos pretendidos |
|---|---|---|
| Cozinha 1 | Mais de 8 até 12 m² | Substituir móveis e bancada; trocar pavimento; alterar iluminação |
| Casa de banho 1 | Mais de 4 até 7 m² | Trocar banheira por duche; renovar revestimentos; substituir móvel |
| Casa de banho 2 | Até 4 m² | Substituir sanita e lavatório; pintar teto |
| Arrecadação 1 | Não sabe | Pintar paredes; melhorar iluminação |

### Resultado esperado

A plataforma apresenta as quatro divisões separadamente e pede apenas os detalhes necessários. Sinaliza a falta de área da arrecadação e eventuais medidas em falta para móveis e bancada.

O resumo identifica as competências de remodelação, carpintaria, bancadas, canalização, eletricidade, revestimentos, impermeabilização e pintura que efetivamente resultem das escolhas e dependências. Pode propor uma empresa que cubra várias dessas competências.

A estimativa mostra os intervalos disponíveis e as parcelas por avaliar, sem inventar valores para as dúvidas. O cliente revê o projeto, consulta o resultado e decide se quer fornecer os contactos e pedir propostas.

## 15. Critérios para considerar a primeira versão pronta

1. Um cliente consegue criar o exemplo anterior sem conhecimentos técnicos e sem fornecer contactos antecipadamente.
2. As duas casas de banho mantêm áreas e trabalhos independentes.
3. As opções e perguntas mudam conforme o tipo de divisão e os trabalhos selecionados.
4. Os limites dos intervalos de área são inequívocos e as áreas desconhecidas ou abertas não originam medidas fictícias.
5. O resumo corresponde às escolhas e atualiza-se quando o cliente as altera.
6. Custos partilhados, trabalhos comuns e dependências não são contados duas vezes.
7. A estimativa identifica hipóteses, inclusões, exclusões, tratamento do IVA e parcelas pendentes.
8. A lista de especialidades não repete profissionais desnecessariamente e permite reconhecer empresas com várias competências.
9. Nenhum pedido é enviado antes da confirmação explícita do cliente.
10. O pedido recebido pela equipa preserva o resumo e a versão da estimativa apresentados ao cliente.
11. A ausência de parceiros e as falhas de envio têm uma resposta clara, sem falsas confirmações.
12. O percurso funciona no telemóvel e é navegável com teclado.

## 16. Como avaliar o produto depois de lançar

Medir a proporção de pessoas que começa e termina a configuração, onde desiste, quantas respostas ficam em “Não sei”, quantas estimativas ficam parciais e quantos clientes avançam para um pedido.

Na operação, acompanhar o tempo até ao encaminhamento, a proporção de pedidos com profissionais compatíveis e a receção de propostas. Quando houver propostas comparáveis, avaliar a diferença face à estimativa para o mesmo conjunto de trabalhos, excluindo alterações de âmbito.

Os objetivos numéricos serão definidos após os primeiros testes. Não presumir taxas de conversão ou precisão sem dados reais.

## 17. Decisões a fechar com a equipa

| Decisão | Proposta de partida |
|---|---|
| Marca e domínio | Usar Quer Renovar; confirmar domínio e eventuais marcas semelhantes |
| Cobertura inicial | Escolher zonas onde seja possível construir uma rede de profissionais |
| Divisões do lançamento | Priorizar cozinha e casa de banho, com trabalhos comuns para restantes interiores |
| Intervalos de área | Testar os intervalos propostos com clientes e profissionais |
| Catálogo e perguntas | Validar unidades, dependências e informação mínima por trabalho |
| Preços e tratamento fiscal | Validar tabela, inclusões, atualização e apresentação antes do lançamento |
| Modelo de encaminhamento | Começar com análise da equipa; definir destinatários e quantidade por pedido |
| Coordenação da obra | Esclarecer quem a assegura em cada modalidade de contratação |
| Partilha da estimativa | Decidir se os profissionais a recebem juntamente com o pedido |
| Contactos e dados | Definir campos obrigatórios, partilha, retenção e recuperação do progresso |
| Receita | Avaliar alternativas sem assumir já comissões ou cobranças |

Estas decisões não impedem o desenho do percurso e dos primeiros ecrãs. As que afetam custos, dados e encaminhamento devem estar resolvidas antes de ativar essas funções para clientes reais.

## 18. Orientação para desenho e desenvolvimento

Usar este documento como referência inicial do produto. Começar pelo percurso do cliente e pelo exemplo de quatro divisões, testando a clareza das perguntas antes de alargar o catálogo.

Separar o catálogo de divisões e trabalhos, as regras de estimativa e os critérios de profissionais da apresentação dos ecrãs. A equipa deve conseguir afinar essas regras sem redesenhar todo o percurso.

Qualquer protótipo com preços, perfis ou envios simulados deve identificar essa condição. No produto público, só apresentar funcionalidades e informação que estejam efetivamente operacionais.

**Resultado que queremos alcançar:** o cliente chega com uma ideia de remodelação e sai com um pedido organizado, uma indicação transparente do investimento e um caminho claro para encontrar quem execute.
