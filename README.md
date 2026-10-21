# Meta na Rota

PROMPT MESTRE — DESENVOLVIMENTO COMPLETO DO APP DE METAS PARA MOTORISTAS UBER MOTO E 99POP

1. INSTRUÇÃO PRINCIPAL

Atue como um engenheiro de software sênior, arquiteto de sistemas, especialista em UX/UI mobile-first, desenvolvimento PWA, TypeScript, Next.js, Supabase, OCR e sistemas financeiros.

Desenvolva um aplicativo completo, funcional, seguro e profissional para motoristas de Uber Moto e 99POP, com foco no controle de metas por hora, registro de corridas por prints, cálculo de combustível, gerenciamento de custos fixos e acompanhamento de resultados financeiros.

O aplicativo será utilizado principalmente em um iPhone.

Não desenvolva apenas um protótipo visual. Implemente funcionalidades reais, banco de dados, persistência, cálculos, validações, tratamento de erros, relatórios e testes automatizados.

Antes de escrever código, inspecione o repositório existente, identifique as tecnologias e preserve os arquivos e funcionalidades que já estiverem funcionando. Se o repositório estiver vazio, inicialize o projeto com a arquitetura recomendada neste documento.

Trabalhe de forma incremental, mas avance até implementar o máximo possível do sistema funcional. Não interrompa o desenvolvimento apenas para apresentar um planejamento. Só solicite informações quando houver uma dependência essencial que realmente impeça a implementação.

⸻

2. OBJETIVO DO APLICATIVO

Criar um painel financeiro pessoal para que o motorista possa:

* Iniciar, pausar, retomar e encerrar sua jornada.
* Registrar corridas da Uber Moto e da 99POP.
* Importar prints de corridas concluídas.
* Utilizar OCR para tentar identificar automaticamente os dados visíveis nas imagens.
* Corrigir manualmente os dados reconhecidos.
* Acompanhar o faturamento bruto.
* Calcular o gasto estimado de combustível.
* Calcular o ganho após combustível.
* Acompanhar uma meta de R$ 30 por hora após combustível.
* Aproveitar excedentes de ganhos no cálculo da meta acumulada.
* Cadastrar quantos custos fixos desejar, informando nome, valor, frequência e vigência.
* Visualizar o resultado após combustível e todos os custos registrados.
* Consultar históricos diários e semanais.
* Comparar o desempenho da Uber com o da 99POP.
* Alterar os parâmetros operacionais e financeiros dentro do próprio aplicativo.

O sistema não deve depender de integração oficial com as plataformas de transporte. O registro de corridas será realizado por importação de imagens ou preenchimento manual.

O aplicativo não deverá monitorar a tela de outros aplicativos nem prometer leitura automática das ofertas da Uber ou da 99 em segundo plano.

⸻

3. TECNOLOGIAS E ARQUITETURA

Utilize preferencialmente:

* Next.js com App Router.
* React.
* TypeScript em modo strict.
* Tailwind CSS.
* Supabase Auth para autenticação.
* Supabase PostgreSQL para persistência.
* Supabase Storage privado para imagens, somente quando necessário.
* Zod para validação.
* React Hook Form para formulários.
* Recharts para gráficos.
* Vitest para testes unitários.
* Playwright para testes de interface e fluxos essenciais.
* Uma solução de OCR compatível com imagens selecionadas pelo usuário no iPhone.

Utilize versões estáveis e compatíveis das dependências.

Organize o código em módulos bem definidos:

* Componentes visuais.
* Páginas e layouts.
* Serviços de OCR.
* Serviços financeiros.
* Serviços de custos fixos.
* Serviços de jornada.
* Repositórios de dados.
* Esquemas de validação.
* Tipos TypeScript.
* Hooks reutilizáveis.
* Testes.
* Migrations do banco de dados.
* Documentação.

Não concentre toda a lógica em um único arquivo.

Não exponha chaves secretas no navegador. Utilize variáveis de ambiente e valide as operações sensíveis no servidor.

O aplicativo deve funcionar como PWA instalável, ser responsivo e ter prioridade de design para o Safari do iPhone.

⸻

4. PARÂMETROS INICIAIS

O sistema deverá iniciar com os seguintes valores:

* Meta após combustível por hora: R$ 30,00.
* Consumo da motocicleta: 50 km/L.
* Preço da gasolina: R$ 6,70/L.
* Custo inicial estimado de combustível: R$ 0,134/km.
* Plataformas: Uber Moto e 99POP.
* Moeda: Real brasileiro (BRL).
* Idioma: português brasileiro.
* Semana dos relatórios: segunda-feira a domingo.
* Faturamento bruto: indicador financeiro principal.
* Custos fixos: cadastrados individualmente.
* Jornada: tempo ativo, incluindo espera por chamadas.
* Pausas: não contam como tempo trabalhado.
* Meta: calculada após combustível, sem descontar os custos fixos nessa métrica.
* Resultado financeiro: calculado após combustível e custos fixos apropriados ao período.

Esses valores são padrões iniciais, não constantes fixas no código.

Todos os parâmetros deverão ser editáveis dentro do aplicativo.

O usuário deverá poder alterar metas, consumo, preço do combustível, parâmetros de exibição e demais configurações operacionais sem precisar solicitar alterações no código.

As alterações deverão ser validadas, persistidas e aplicadas conforme as regras de vigência definidas neste documento.

⸻

5. IDENTIDADE VISUAL E EXPERIÊNCIA DO USUÁRIO

Crie uma interface premium, moderna, organizada e minimalista, inspirada em dashboards financeiros profissionais.

Diretrizes de design

* Mobile-first.
* Compatível com iPhone e desktop.
* Fundo escuro como tema inicial, com opção de tema claro.
* Tipografia moderna, legível e consistente.
* Valores financeiros com boa hierarquia visual.
* Cards com cantos arredondados.
* Espaçamento consistente.
* Navegação intuitiva.
* Botões adequados para interação com uma mão.
* Contraste acessível.
* Estados de carregamento, sucesso, erro e ausência de dados.
* Animações discretas e funcionais.
* Formulários claros e curtos.
* Sem excesso de informações na tela inicial.

Use verde para resultados positivos, vermelho ou laranja para alertas e tons neutros para informações auxiliares, sem depender apenas das cores para transmitir significado.

Respeite as áreas seguras do iPhone e evite que botões importantes fiquem encobertos por elementos do sistema.

Crie uma experiência que permita ao motorista registrar uma corrida rapidamente.

Não utilize dados fictícios como se fossem dados reais do usuário.

⸻

6. NAVEGAÇÃO PRINCIPAL

Implemente as seguintes seções:

1. Painel.
2. Registrar corrida.
3. Jornada.
4. Histórico.
5. Relatórios.
6. Custos fixos.
7. Configurações.

No celular, utilize navegação inferior para as áreas mais importantes e acesso organizado às configurações.

A navegação deverá refletir o estado atual da jornada e facilitar o registro de uma nova corrida.

⸻

7. PAINEL FINANCEIRO PRINCIPAL

O dashboard deve apresentar os resultados consolidados da jornada atual e do período selecionado.

Indicadores obrigatórios

1. Faturamento bruto.
2. Combustível estimado.
3. Ganho após combustível.
4. Custos fixos apropriados ao período.
5. Resultado após os custos registrados.
6. Tempo ativo de trabalho.
7. Meta acumulada.
8. Saldo da meta.
9. Quantidade de corridas.
10. Quilometragem total.
11. Ganho médio após combustível por hora ativa.
12. Faturamento por plataforma.
13. Combustível por plataforma, quando os dados permitirem.
14. Total de custos fixos ativos.
15. Situação da jornada.

O faturamento bruto deve ser o indicador principal, com destaque visual.

O dashboard deverá apresentar separadamente:

Saldo da meta: resultado após combustível comparado com a meta acumulada.

Resultado após os custos registrados: faturamento bruto menos combustível e custos fixos apropriados.

Esses indicadores não podem ser confundidos.

Ações rápidas

* Iniciar jornada.
* Pausar jornada.
* Retomar jornada.
* Registrar corrida por print.
* Registrar corrida manualmente.
* Consultar histórico.
* Encerrar jornada.

Se ainda não existir uma jornada, apresente um botão para iniciá-la.

Se houver uma jornada pausada, ofereça a opção de retomá-la.

Se a jornada estiver encerrada, permita consultar seus resultados e iniciar uma nova.

⸻

8. REGISTRO DE CORRIDAS

Implemente duas formas de registrar corridas:

1. Importação de print com OCR.
2. Cadastro manual.

O cadastro manual deverá continuar funcionando mesmo quando o OCR ou a internet estiverem indisponíveis.

Fluxo de importação de print

1. O usuário seleciona Uber Moto ou 99POP.
2. Importa uma imagem da galeria ou dos arquivos do iPhone.
3. O sistema processa a imagem.
4. O OCR tenta identificar os dados disponíveis.
5. O formulário é preenchido com os resultados reconhecidos.
6. O usuário revisa e corrige os campos.
7. O aplicativo solicita os dados obrigatórios que faltarem.
8. O sistema apresenta uma prévia dos cálculos.
9. O usuário confirma o registro.
10. O painel, os totais e o histórico são atualizados.

Se o navegador e o dispositivo oferecerem suporte ao compartilhamento de imagens para a PWA, implemente essa possibilidade como recurso adicional. A importação pelo seletor de imagens deverá continuar sendo o fluxo principal.

Não dependa de uma extensão especial ou de uma integração não disponível no iOS.

Campos de cada corrida

* Identificador.
* Plataforma.
* Valor bruto recebido.
* Distância até o passageiro.
* Distância percorrida com passageiro.
* Distância total calculada.
* Horário de início, quando conhecido.
* Horário de conclusão.
* Duração da corrida, quando conhecida.
* Data da corrida.
* Observações opcionais.
* Imagem de origem opcional.
* Estado de revisão do OCR.
* Estado de validação dos dados.

Todos os campos reconhecidos pelo OCR deverão ser editáveis antes da confirmação.

Dados incompletos

Se o print não mostrar a distância até o passageiro, solicite ao usuário que a informe manualmente.

Se não houver distância com passageiro, não invente esse dado.

Se não houver tempo da corrida, permita informar a duração ou os horários manualmente.

Se a distância total for desconhecida, não calcule um custo de combustível completo como se ela fosse conhecida.

Identifique claramente registros incompletos e ofereça uma ação para completá-los.

⸻

9. RECONHECIMENTO DE TEXTO POR IMAGEM — OCR

Crie um serviço independente para OCR.

Exponha funções bem definidas, como:

* extractRideDataFromImage(image)
* normalizeExtractedRideData(result)
* validateExtractedRideData(result)
* getOcrConfidence(result)

A solução poderá usar uma biblioteca de OCR compatível com o navegador ou um serviço externo no servidor, desde que a implementação seja real e documentada.

O OCR deverá tentar identificar:

* Valores monetários.
* Distâncias.
* Durações.
* Datas e horários.
* Textos que ajudem a reconhecer o tipo de tela.
* Plataforma, quando for possível identificar com segurança.

Implemente normalização de números brasileiros, como:

* R$ 12,50.
* 12,50.
* R$ 8,00.
* 3,2 km.
* 12 min.

Não confunda valores de corridas com números de distância, horários ou outros dados da tela.

Se a confiança for baixa, solicite confirmação.

Se o OCR falhar, ofereça o preenchimento manual sem bloquear o usuário.

Não invente informações ausentes.

Não apresente o OCR como infalível.

Não armazene imagens permanentemente sem necessidade. Se forem armazenadas, use acesso privado e permita sua exclusão.

Documente eventuais dependências de serviços externos e configure suas chaves exclusivamente no servidor.

⸻

10. CÁLCULOS FINANCEIROS DAS CORRIDAS

Centralize a lógica financeira em funções puras e testáveis.

Fórmulas

Custo por quilômetro:

costPerKm = fuelPricePerLiter / kilometersPerLiter

Distância total:

totalDistanceKm = pickupDistanceKm + passengerDistanceKm

Combustível estimado:

estimatedFuelCost = totalDistanceKm * costPerKm

Ganho após combustível:

earningsAfterFuel = grossFare - estimatedFuelCost

Meta acumulada:

targetAmount = targetPerHour * activeSeconds / 3600

Saldo da meta:

targetBalance = cumulativeEarningsAfterFuel - targetAmount

Resultado financeiro:

financialResult = grossRevenue - fuelExpense - fixedCostsForPeriod

Use dinheiro em centavos inteiros ou outra estratégia decimal segura para evitar erros de arredondamento.

Arredonde os resultados monetários de forma consistente.

Valide valores negativos, dados inválidos, distâncias impossíveis e horários inconsistentes.

Exemplo de teste

* Valor bruto: R$ 15,00.
* Distância até o passageiro: 2 km.
* Distância com passageiro: 8 km.
* Distância total: 10 km.
* Consumo: 50 km/L.
* Gasolina: R$ 6,70/L.

Resultado esperado:

* Custo por km: R$ 0,134.
* Combustível estimado: R$ 1,34.
* Ganho após combustível: R$ 13,66.

O faturamento bruto deverá continuar sendo R$ 15,00.

Não desconte combustível duas vezes.

Não desconte custos fixos do ganho utilizado para a meta principal por hora.

⸻

11. SISTEMA DE METAS POR HORA

A meta padrão será de R$ 30,00 após combustível por hora ativa.

A meta deve ser calculada continuamente com base no tempo efetivamente trabalhado.

Não arredonde o tempo para horas inteiras.

Exemplos:

* 30 minutos ativos: meta de R$ 15,00.
* 60 minutos ativos: meta de R$ 30,00.
* 90 minutos ativos: meta de R$ 45,00.
* 120 minutos ativos: meta de R$ 60,00.

O sistema deverá comparar o ganho acumulado após combustível com a meta acumulada.

Exemplo de excedente

Primeira hora:

* Ganho após combustível: R$ 38,00.
* Meta acumulada: R$ 30,00.
* Saldo: +R$ 8,00.

Segunda hora:

* Ganho acumulado após combustível: R$ 63,00.
* Meta acumulada: R$ 60,00.
* Saldo: +R$ 3,00.

O excedente não deverá ser adicionado novamente ao ganho acumulado. Ele já está refletido na diferença entre o ganho acumulado e a meta acumulada.

Se houver déficit, o sistema mostrará quanto falta para atingir a meta acumulada.

O sistema também deverá exibir a média de ganho após combustível por hora ativa.

Metas e custos fixos

A meta de R$ 30,00 por hora será avaliada após combustível.

Os custos fixos deverão ser considerados separadamente no resultado financeiro.

O aplicativo poderá mostrar adicionalmente uma meta financeira ajustada para cobrir custos fixos, mas somente se esse recurso for implementado de forma claramente identificada, com cálculo separado e opcional.

Não substitua a meta original por uma meta que desconte custos fixos sem autorização do usuário.

⸻

12. JORNADA DE TRABALHO E TIMER

Implemente os seguintes estados:

* Não iniciada.
* Em andamento.
* Pausada.
* Encerrada.

Ações

* Iniciar jornada.
* Pausar.
* Retomar.
* Encerrar.

Ao iniciar a jornada, registre o horário de início.

Ao pausar, registre o instante da pausa e finalize o segmento ativo.

Ao retomar, inicie um novo segmento ativo.

Ao encerrar, registre o término definitivo.

O tempo de espera por chamadas conta como tempo de trabalho ativo.

Somente períodos explicitamente pausados ficam fora do tempo ativo.

Persistência do timer

O timer deverá continuar correto quando o usuário:

* Bloquear a tela do iPhone.
* Fechar o Safari.
* Reabrir a PWA.
* Atualizar a página.
* Perder a conexão temporariamente.
* Retornar ao aplicativo após vários minutos.

Não dependa exclusivamente de setInterval para determinar o tempo total.

Salve os timestamps e os segmentos da jornada e reconstrua o tempo ativo a partir dos registros persistidos.

O contador visual pode atualizar periodicamente enquanto a tela estiver aberta, mas o cálculo oficial deve vir dos timestamps persistidos.

Não permita duas jornadas simultâneas para o mesmo usuário.

Não conte o tempo pausado.

Não carregue excedentes ou déficits de um dia para o dia seguinte.

Ao iniciar uma nova jornada, crie um novo registro.

Se uma jornada permanecer aberta por muito tempo sem atividade confirmada, solicite confirmação ao usuário quando ele retornar. Não encerre ou modifique silenciosamente seus registros.

⸻

13. CUSTOS FIXOS PERSONALIZADOS

Crie um módulo completo chamado “Custos Fixos”.

O usuário poderá cadastrar quantos custos fixos precisar.

Não imponha um limite artificial de despesas.

Cada custo deverá ter:

* Nome da despesa.
* Valor monetário.
* Frequência.
* Data de início.
* Data final opcional.
* Estado ativo ou inativo.
* Regra de cobrança.
* Observação opcional.
* Data de criação.
* Data de atualização.

Frequências mínimas:

* Diária.
* Semanal.
* Mensal.

Exemplos:

* Aluguel da moto.
* Internet.
* Plano de celular.
* Taxas fixas.
* Outras despesas cadastradas pelo usuário.

Valor inicial do aluguel

Cadastre como exemplo inicial:

* Nome: Aluguel da moto.
* Valor: R$ 27,50.
* Frequência: diária.
* Estado: ativo.

O usuário deverá poder alterar esse valor, o nome e a frequência, ou excluir o registro.

Regras adicionais de custos

Para custos diários, permita escolher entre:

* Cobrar por dia corrido dentro da vigência.
* Cobrar somente por dia de operação.

Essa escolha será especialmente importante para o aluguel da moto.

Para custos semanais e mensais, calcule a apropriação diária usando uma regra consistente e documentada.

Para relatórios diários, semanais e mensais, considere a vigência de cada custo.

Não duplique despesas.

Não some o custo semanal integral em cada dia da semana.

Não desconte automaticamente uma despesa futura antes do início de sua vigência.

Quando o usuário alterar um custo, preserve o histórico das configurações anteriores.

Quando o usuário desativar um custo, interrompa as apropriações futuras, preservando os registros anteriores.

Gerenciamento

Implemente:

* Adicionar custo.
* Editar custo.
* Ativar ou desativar.
* Excluir com confirmação.
* Visualizar custos ativos.
* Visualizar custos inativos.
* Pesquisar despesas.
* Filtrar por frequência.
* Consultar total diário equivalente.
* Consultar total semanal.
* Consultar total mensal.
* Consultar vigência.
* Visualizar o impacto financeiro.

Os formulários deverão validar valores, nomes e datas.

⸻

14. RESULTADO FINANCEIRO COM CUSTOS FIXOS

Apresente duas métricas separadas.

A. Meta operacional

earningsAfterFuel = grossRevenue - fuelExpense

targetBalance = earningsAfterFuel - targetAmount

Essa métrica considera o combustível estimado, mas não desconta os custos fixos.

B. Resultado após custos registrados

financialResult = grossRevenue - fuelExpense - fixedCostsForPeriod

Esse resultado desconta o combustível e os custos fixos apropriados ao período.

Exemplo:

* Faturamento bruto: R$ 180,00.
* Combustível: R$ 20,10.
* Aluguel da moto: R$ 27,50.
* Outros custos fixos: R$ 5,00.

Resultado:

* Faturamento bruto: R$ 180,00.
* Ganho após combustível: R$ 159,90.
* Custos fixos: R$ 32,50.
* Resultado após os custos registrados: R$ 127,40.

Todos os valores deverão ser calculados a partir dos dados efetivamente cadastrados.

Use o rótulo “Resultado após os custos registrados”. Não afirme que esse número é lucro contábil definitivo, porque podem existir despesas não cadastradas.

⸻

15. CONFIGURAÇÕES GERAIS

Crie uma tela de configurações com os seguintes grupos.

Metas

* Meta por hora.
* Preferência de visualização da meta.
* Preferências de relatórios.
* Opções de projeção.

Veículo e combustível

* Consumo em km/L.
* Preço por litro.
* Custo por quilômetro calculado automaticamente.

Plataformas

* Ativar ou desativar Uber Moto.
* Ativar ou desativar 99POP.
* Visualizar resultados individuais e consolidados.

Custos

* Gerenciar custos fixos.
* Definir regras de cobrança.
* Consultar valores apropriados.
* Definir vigência.

Aparência

* Tema escuro.
* Tema claro.
* Preferências de apresentação.

Dados e privacidade

* Exportar histórico.
* Excluir imagens armazenadas.
* Consultar dados cadastrados.
* Encerrar sessão.
* Excluir conta e dados, quando o backend estiver configurado para suportar essa operação.

Todas as configurações devem ser persistidas.

Não mantenha parâmetros essenciais apenas em memória do navegador.

⸻

16. HISTÓRICO DE CORRIDAS

Crie uma tela de histórico com:

* Data.
* Horário.
* Plataforma.
* Valor bruto.
* Distância até o passageiro.
* Distância com passageiro.
* Distância total.
* Combustível estimado.
* Ganho após combustível.
* Estado do registro.
* Indicação de dados estimados ou incompletos.

Implemente filtros por:

* Data.
* Semana.
* Plataforma.
* Estado do registro.

Permita:

* Abrir detalhes.
* Editar corrida.
* Excluir com confirmação.
* Completar dados ausentes.
* Consultar a imagem de origem, quando armazenada.
* Identificar possíveis duplicidades.

A detecção de duplicidades deve sugerir uma revisão, nunca excluir automaticamente uma corrida.

Ao editar ou excluir um registro, recalcule os totais afetados.

Preserve os registros históricos das jornadas encerradas.

⸻

17. RELATÓRIOS DIÁRIOS E SEMANAIS

Implemente relatórios com:

* Faturamento bruto.
* Combustível estimado.
* Ganho após combustível.
* Custos fixos apropriados.
* Resultado após custos registrados.
* Tempo ativo.
* Meta acumulada.
* Saldo da meta.
* Número de corridas.
* Quilometragem.
* Ganho médio por hora ativa.
* Desempenho da Uber Moto.
* Desempenho da 99POP.
* Gráficos de faturamento.
* Gráficos de resultado após combustível.
* Gráficos de resultado após custos.
* Comparação entre meta e ganho.

Permita selecionar períodos personalizados.

A semana padrão será de segunda-feira a domingo.

Utilize corretamente o fuso horário configurado para o usuário, evitando que corridas próximas da meia-noite sejam atribuídas ao dia errado.

Os relatórios deverão distinguir:

* Dados registrados.
* Dados estimados.
* Dados incompletos.

Não inclua valores inválidos nos totais financeiros.

Não invente distância ou custo de combustível quando os dados necessários estiverem ausentes.

⸻

18. BANCO DE DADOS

Crie migrations SQL para todas as tabelas necessárias.

Utilize UUIDs, chaves estrangeiras, índices, timestamps e restrições apropriadas.

Modelo sugerido:

profiles

* id
* display_name
* created_at
* updated_at

user_settings

* user_id
* target_per_hour_cents
* kilometers_per_liter
* fuel_price_per_liter_cents
* theme
* timezone
* created_at
* updated_at

configuration_history

* id
* user_id
* target_per_hour_cents
* kilometers_per_liter
* fuel_price_per_liter_cents
* effective_at
* created_at

work_sessions

* id
* user_id
* started_at
* ended_at
* status
* created_at
* updated_at

work_session_segments

* id
* session_id
* started_at
* ended_at
* created_at

rides

* id
* user_id
* session_id
* platform
* gross_fare_cents
* pickup_distance_meters
* passenger_distance_meters
* ride_started_at
* ride_completed_at
* duration_seconds
* ocr_status
* ocr_confidence
* source_image_path
* notes
* created_at
* updated_at

fixed_costs

* id
* user_id
* name
* amount_cents
* frequency
* daily_charge_rule
* start_date
* end_date
* is_active
* notes
* created_at
* updated_at

fixed_cost_versions

Crie uma tabela de versões ou mecanismo equivalente para preservar:

* Identificador do custo.
* Valor anterior.
* Frequência anterior.
* Regra de cobrança anterior.
* Vigência.
* Data da alteração.

fixed_cost_allocations

Se necessário para preservar relatórios estáveis, armazene:

* Identificador da apropriação.
* Identificador do custo.
* Usuário.
* Data ou período.
* Valor apropriado em centavos.
* Versão do custo utilizada.
* Data de criação.

Evite gerar apropriações duplicadas ao atualizar páginas ou sincronizar dados.

Segurança

Configure Row Level Security em todas as tabelas que contenham dados pessoais ou financeiros.

Cada usuário deverá acessar exclusivamente seus próprios dados.

Não exponha a chave de serviço do Supabase no cliente.

Configure índices para consultas por usuário, data e jornada.

Implemente políticas seguras de leitura, inserção, edição e exclusão.

⸻

19. PWA, IPHONE E FUNCIONAMENTO OFFLINE

Configure:

* Manifest da PWA.
* Ícones.
* Nome e descrição.
* Instalação na tela inicial.
* Layout adaptado ao iPhone.
* Tratamento das áreas seguras.
* Estados de conexão.
* Cache apropriado dos arquivos estáticos.

A PWA deve tolerar desconexões temporárias.

Quando possível, permita salvar formulários localmente como pendentes de sincronização.

Implemente sincronização segura, sem duplicar registros.

Informe claramente se os dados ainda estão no dispositivo ou se já foram sincronizados com o servidor.

O timer deverá ser reconstruído pelos timestamps persistidos.

Não prometa que o navegador continuará executando código em segundo plano indefinidamente.

Não tente capturar ou monitorar outros aplicativos.

⸻

20. PRIVACIDADE E SEGURANÇA

* Solicite apenas as permissões necessárias.
* Não acesse contatos ou localização sem necessidade.
* Não monitore telas da Uber ou da 99.
* Utilize apenas prints selecionados explicitamente pelo usuário.
* Proteja imagens e registros financeiros.
* Não exponha dados privados por URLs públicas.
* Não registre senhas, tokens ou chaves em logs.
* Valide dados no cliente e no servidor.
* Implemente controle de acesso.
* Permita excluir imagens e registros.
* Documente a política de armazenamento.
* Proteja operações de exportação.
* Não exponha dados de um usuário a outro.

⸻

21. TESTES AUTOMATIZADOS OBRIGATÓRIOS

Crie testes unitários para os cálculos financeiros:

1. R$ 6,70 / 50 km/L = R$ 0,134 por km.
2. Uma corrida de 10 km custa R$ 1,34 em combustível estimado.
3. Uma corrida de R$ 15,00 e combustível de R$ 1,34 gera R$ 13,66 após combustível.
4. Meta de 30 minutos = R$ 15,00.
5. Meta de 60 minutos = R$ 30,00.
6. Meta de 90 minutos = R$ 45,00.
7. R$ 38,00 após uma hora resulta em saldo de +R$ 8,00.
8. R$ 63,00 após duas horas resulta em saldo de +R$ 3,00.
9. Períodos pausados não aumentam a meta.
10. Retomar uma jornada preserva o tempo anterior.
11. Reabrir o navegador reconstrói o timer corretamente.
12. Encerrar a jornada interrompe o tempo ativo.
13. Nova jornada não herda saldo do dia anterior.
14. Corrida sem distância não recebe um custo total de combustível inventado.
15. OCR sem confiança exige revisão.
16. Duplicidades não são excluídas automaticamente.
17. Editar uma corrida atualiza os totais.
18. Excluir uma corrida atualiza os totais.

Crie testes para custos fixos:

19. Cadastro de múltiplas despesas.
20. Alteração de nome, valor e frequência.
21. Ativação e desativação de despesas.
22. Cálculo de despesas diárias.
23. Conversão de despesas semanais e mensais.
24. Aplicação correta das vigências.
25. Ausência de duplicação de apropriações.
26. Histórico preservado após alterações.
27. Resultado após custos registrados calculado corretamente.
28. Custos fixos não alteram indevidamente a meta operacional.
29. Regras de cobrança do aluguel por dia corrido ou dia de operação.

Crie testes de segurança:

30. Usuários não acessam dados de outros usuários.
31. Imagens privadas não são acessíveis publicamente.
32. Operações inválidas são rejeitadas.

Crie testes de interface para:

* Iniciar jornada.
* Pausar e retomar.
* Importar print.
* Revisar OCR.
* Registrar corrida manualmente.
* Salvar uma corrida.
* Adicionar custos fixos.
* Editar custos fixos.
* Consultar histórico.
* Abrir relatórios.
* Alterar parâmetros.
* Encerrar jornada.

⸻

22. DOCUMENTAÇÃO E ENTREGA

Crie um README completo com:

* Descrição do aplicativo.
* Tecnologias.
* Requisitos.
* Instalação.
* Variáveis de ambiente.
* Configuração do Supabase.
* Aplicação das migrations.
* Configuração do OCR.
* Execução local.
* Testes.
* Build de produção.
* Implantação.
* Instalação da PWA no iPhone.
* Limitações conhecidas.
* Política de armazenamento de imagens.
* Regras financeiras.
* Regras de apropriação dos custos fixos.

Crie um arquivo .env.example sem credenciais reais.

Não invente chaves, tokens ou configurações secretas.

Não afirme que o projeto foi implantado ou testado se isso não ocorreu.

⸻

23. CRITÉRIOS FINAIS DE ACEITAÇÃO

O projeto deverá ser considerado funcional quando:

* O usuário conseguir iniciar, pausar, retomar e encerrar a jornada.
* O timer permanecer correto depois de fechar e reabrir o navegador.
* O usuário conseguir registrar corridas manualmente.
* O usuário conseguir importar um print pelo iPhone.
* O OCR realizar uma tentativa real de extração de dados.
* Os dados extraídos puderem ser revisados antes do salvamento.
* O combustível for calculado corretamente.
* A meta de R$ 30 por hora for editável.
* O excedente for contabilizado sem duplicação.
* Os custos fixos puderem ser adicionados sem limite artificial.
* Cada custo possuir nome, valor, frequência e vigência.
* O aluguel da moto puder ser configurado como custo diário de R$ 27,50.
* O usuário puder escolher se o custo diário incide por dia corrido ou dia de operação.
* Os custos aparecerem no painel.
* O resultado após custos registrados for calculado corretamente.
* O resultado da meta e o resultado financeiro forem apresentados separadamente.
* Uber Moto e 99POP tiverem resultados individuais e consolidados.
* O histórico for editável e persistente.
* Os relatórios diários e semanais funcionarem.
* Todos os parâmetros principais forem editáveis dentro do aplicativo.
* A segurança do banco estiver configurada.
* Os testes principais passarem.
* A documentação estiver atualizada.

24. ORDEM DE EXECUÇÃO

Execute o trabalho nesta ordem, preservando o que já estiver implementado:

1. Inspecionar o repositório e preparar a estrutura.
2. Implementar banco de dados, autenticação e segurança.
3. Implementar parâmetros configuráveis e histórico de configurações.
4. Implementar funções financeiras e testes.
5. Implementar jornada e timer persistente.
6. Implementar custos fixos e apropriação por período.
7. Implementar cadastro manual de corridas.
8. Implementar importação de imagens e OCR.
9. Implementar painel principal.
10. Implementar histórico e relatórios.
11. Implementar configurações e exportação.
12. Implementar PWA e experiência para iPhone.
13. Executar testes, corrigir problemas e documentar.

Não entregue apenas o planejamento. Implemente os recursos progressivamente, execute os testes disponíveis e corrija os erros encontrados.

Quando uma integração depender de credenciais externas indisponíveis, deixe a configuração documentada e implemente o restante do sistema funcional.

Vamos começar apenas pela parte visual, depois será feito o banco de dados e faça as etapas de implantação.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1a2ec3a-7870-4a3c-b228-04e13f0a72c7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
