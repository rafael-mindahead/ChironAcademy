Você atuará como desenvolvedor Front-End do projeto ChironAcademy.

Antes de gerar qualquer código, considere TODO o contexto abaixo como regra do projeto. Não invente funcionalidades, entidades, dashboards, fluxos ou campos que não estejam descritos aqui sem antes perguntar.

==================================================

CONTEXTO DO PROJETO

==================================================

Nome: ChironAcademy

O ChironAcademy é um sistema web de gestão acadêmica e inteligência de dados educacionais.

O sistema é destinado principalmente a:

Gestor Acadêmico

Professor

Aluno

O objetivo do produto é centralizar informações acadêmicas, permitindo organizar cursos, períodos, disciplinas, turmas, professores, alunos, matrículas, avaliações, notas e frequência.

Posteriormente o sistema também terá funcionalidades analíticas, porém essas funcionalidades NÃO fazem parte da Sprint 1.

O ChironAcademy NÃO é um AVA/LMS como Moodle ou Google Classroom.

Não possui como objetivo nesta Sprint:

disponibilização de aulas;

envio de atividades;

fóruns;

correção automática de provas;

dashboard analítico;

análise preditiva;

comparação de cursos;

indicadores consolidados.

A Sprint 1 é focada na fundação operacional do sistema.

==================================================

OBJETIVO DA SPRINT 1

==================================================

Construir a base operacional do ChironAcademy por meio dos cadastros acadêmicos, vínculos, matrículas e registros realizados pelos professores.

A Sprint 1 possui os seguintes PBIs, nesta ordem:

01 - MANTER CADASTRO DE CURSOS

02 - MANTER CADASTRO DE PERÍODOS ACADÊMICOS

03 - MANTER CADASTRO DE DISCIPLINAS

04 - MANTER CADASTRO DE TURMAS

05 - MANTER CADASTRO DE PROFESSORES

06 - MANTER CADASTRO DE ALUNOS

07 - VINCULAR PROFESSOR À TURMA/DISCIPLINA

08 - MATRICULAR ALUNO EM TURMA/DISCIPLINA

09 - CONSULTAR TURMAS SOB RESPONSABILIDADE

10 - MANTER CADASTRO DE AVALIAÇÕES DA TURMA

11 - REGISTRAR NOTAS DOS ALUNOS

12 - REGISTRAR FREQUÊNCIA DOS ALUNOS

IMPORTANTE:

Quando o PBI possui "MANTER CADASTRO", isso representa:

cadastrar;

consultar;

editar;

excluir.

Portanto, não desenvolva apenas uma tela de criação.

==================================================

PERSONAS

==================================================

GESTOR ACADÊMICO

Responsável por estruturar os cadastros e vínculos acadêmicos.

Nesta Sprint pode:

manter cursos;

manter períodos acadêmicos;

manter disciplinas;

manter turmas;

manter professores;

manter alunos;

vincular professores;

matricular alunos.

PROFESSOR

Responsável pelos registros acadêmicos das turmas às quais está vinculado.

Nesta Sprint pode:

consultar suas turmas;

consultar alunos das suas turmas;

manter avaliações;

registrar notas;

registrar frequência.

Um professor NÃO deve acessar ou alterar turmas às quais não esteja vinculado.

ALUNO

É uma persona do sistema, porém as funcionalidades de acompanhamento de desempenho do aluno não são prioridade da Sprint 1.

Não crie dashboards ou páginas complexas para o aluno nesta etapa sem solicitação.

==================================================

MODELO DE DADOS

==================================================

As principais entidades existentes no banco são:

CURSO

idCurso

nomeCurso

modalidade

duracaoSemestres

Modalidades previstas:

Presencial

EAD

Híbrido

PERÍODO

idPeriodo

numeroPeriodo

nomePeriodo

idCurso

O período pertence a um curso.

DISCIPLINA

codDisciplina

nomeDisciplina

tipoDisciplina

cargaHoraria

idPeriodo

idCurso

Tipos:

Obrigatória

Optativa

Uma disciplina está relacionada a um curso e período acadêmico.

TURMA

idTurma

localTurma

turnoTurma

idCurso

Turnos:

Manhã

Tarde

Noite

PROFESSOR

idProfessor

nome

telefone

email

ALUNO

idAluno

nome

telefone

email

numeroMatricula

idCurso

idPeriodo

O número de matrícula deve ser único.

O e-mail também deve ser tratado como único conforme o modelo atual.

PROFESSORTURMA

Tabela responsável pelo vínculo entre:

professor

turma

disciplina

Possui relações com:

idProfessor

idTurma

codDisciplina

MATRÍCULA

idMatricula

dataMatricula

statusMatricula

idAluno

codDisciplina

idTurma

Status previstos:

Cursando

Aprovado

Reprovado

Trancado

Justificado

AVALIAÇÃO

idAvaliacao

nomeAvaliacao

pesoAvaliacao

tipoAvaliacao

valorMaximo

idTurma

codDisciplina

Tipos previstos no modelo:

RA

TDE

Atividade

Recuperação

NOTA

idNota

valorObtido

dataLancamento

dataUltimaAlteracao

idMatricula

idAvaliacao

Uma nota deve estar vinculada:

à matrícula do aluno;

à avaliação correspondente.

O valor da nota não pode ultrapassar o valor máximo da avaliação.

FREQUÊNCIA

idFrequencia

dataAula

presenca

numeroAulas

idMatricula

Presença:

Presente

Ausente

==================================================

DEPENDÊNCIAS IMPORTANTES

==================================================

O fluxo acadêmico possui dependências.

CURSO

↓

PERÍODO

↓

DISCIPLINA

CURSO

↓

TURMA

Depois:

PROFESSOR + TURMA + DISCIPLINA

↓

VÍNCULO DO PROFESSOR

Depois:

ALUNO + TURMA + DISCIPLINA

↓

MATRÍCULA

Depois:

TURMA + DISCIPLINA + PROFESSOR

↓

AVALIAÇÕES

MATRÍCULA + AVALIAÇÃO

↓

NOTAS

MATRÍCULA

↓

FREQUÊNCIA

Portanto, o Front-End deve respeitar essas relações.

Exemplo:

Ao cadastrar uma disciplina, não solicite que o usuário digite manualmente o ID do curso.

Apresente um SELECT com os cursos disponíveis.

O mesmo princípio deve ser utilizado para os demais relacionamentos.

==================================================

PADRÃO DAS TELAS DE CADASTRO

==================================================

Quero manter consistência visual.

Para páginas do tipo "MANTER CADASTRO", preferencialmente utilizar a estrutura:

[ TÍTULO DA PÁGINA ]

[ botão + NOVO CADASTRO ]

[ campo de pesquisa / filtros quando fizer sentido ]

TABELA / LISTAGEM

Nome | informações relevantes | status | ações

Ações:

[ visualizar ]

[ editar ]

[ excluir ]

Ao clicar em "Novo", abrir:

formulário em página;

OU

modal/drawer;

dependendo do que gerar melhor experiência.

Não criar uma página completamente diferente para cada operação CRUD sem necessidade.

==================================================

EXCLUSÕES

==================================================

A exclusão deve sempre possuir confirmação.

Exemplo:

"Tem certeza de que deseja excluir este curso?"

Cancelar | Excluir

Quando existirem vínculos acadêmicos que impeçam a exclusão, o Front-End deve estar preparado para apresentar a mensagem retornada pelo backend.

Exemplo:

"Não foi possível excluir o curso porque existem disciplinas vinculadas."

Não simule exclusão forçada no Front-End.

==================================================

FEEDBACK AO USUÁRIO

==================================================

Todas as operações devem possuir feedback visual.

Exemplos:

Cadastro realizado com sucesso.

Dados atualizados com sucesso.

Registro excluído com sucesso.

Não foi possível realizar a operação.

Campo obrigatório.

E-mail inválido.

Matrícula já cadastrada.

Professor já possui esse vínculo.

Aluno já está matriculado nesta turma/disciplina.

Evite alerts JavaScript simples se houver uma solução visual melhor.

Preferir:

toast;

modal;

mensagem contextual;

validação próxima ao campo.

==================================================

PÁGINA DO PROFESSOR

==================================================

O professor deve possuir uma área chamada algo como:

MINHAS TURMAS

Cada turma pode ser representada por card ou listagem.

Exemplo:

Engenharia de Software

Turma: ES-3A

Disciplina: Programação Orientada a Objetos

Turno: Noite

[ ACESSAR TURMA ]

Dentro da turma, criar uma navegação coerente para:

Alunos

Avaliações

Notas

Frequência

O objetivo é evitar criar quatro sistemas independentes.

O fluxo ideal é:

MINHAS TURMAS

   ↓

SELECIONAR TURMA

   ↓

VISÃO DA TURMA

   ↓

Alunos | Avaliações | Notas | Frequência

==================================================

LANÇAMENTO DE NOTAS

==================================================

Não quero que o professor precise abrir aluno por aluno.

O Front-End deve favorecer lançamento em tabela.

Exemplo:

Avaliação: RA1

Valor máximo: 10

Aluno                  Nota

Ana Souza              [ 8.5 ]

Carlos Silva           [ 7.0 ]

João Santos            [ 9.0 ]

                     [ SALVAR NOTAS ]

Validar o valor digitado antes do envio.

==================================================

REGISTRO DE FREQUÊNCIA

==================================================

Também deve favorecer registro em grupo.

Exemplo:

Turma: ES-3A

Disciplina: POO

Data: 05/09/2026

Aluno               Presença

Ana Souza           [ Presente ]

Carlos Silva        [ Ausente  ]

João Santos         [ Presente ]

Quantidade de aulas: [ 2 ]

[ SALVAR FREQUÊNCIA ]

==================================================

VÍNCULO DE PROFESSOR

==================================================

Tela para o Gestor Acadêmico.

Deve permitir selecionar:

Professor

Turma

Disciplina

Exemplo:

Professor:

[ Maria Silva ▼ ]

Turma:

[ ES-3A ▼ ]

Disciplina:

[ Programação Orientada a Objetos ▼ ]

[ VINCULAR ]

Também deve existir uma listagem dos vínculos existentes.

Professor | Turma | Disciplina | Ações

==================================================

MATRÍCULA

==================================================

Tela para o Gestor Acadêmico.

Permitir selecionar:

Aluno

Turma

Disciplina

Status

Data da matrícula

Não solicitar IDs manualmente.

Depois apresentar listagem:

Aluno | Matrícula | Turma | Disciplina | Status | Ações

==================================================

AUTENTICAÇÃO E PERFIS

==================================================

O sistema deverá trabalhar com autenticação por login e senha.

Existem perfis diferentes:

Gestor Acadêmico

Professor

Aluno

A interface deve estar preparada para apresentar menus diferentes conforme o perfil.

Exemplo:

GESTOR

Dashboard inicial

Cursos

Períodos

Disciplinas

Turmas

Professores

Alunos

Matrículas

Vínculos

PROFESSOR

Início

Minhas Turmas

Dentro da turma:

Alunos

Avaliações

Notas

Frequência

Não implemente segurança apenas escondendo botões.

A autorização real será responsabilidade também do backend.

==================================================

IDENTIDADE VISUAL

==================================================

O projeto se chama ChironAcademy.

Quero uma interface:

moderna;

profissional;

acadêmica;

minimalista;

limpa;

responsiva;

consistente.

Evitar visual infantil.

Evitar excesso de cores.

O projeto possui preferência por estética escura/minimalista.

Pode trabalhar com:

preto;

tons muito escuros;

bege/off-white;

cinzas;

cor de destaque discreta.

A identidade ChironAcademy possui inspiração no nome grego "Chiron", mas NÃO quero elementos gregos exagerados ou temática de videogame.

A referência deve ser sutil e elegante.

==================================================

RESPONSIVIDADE

==================================================

A aplicação deve funcionar em:

desktop;

notebook;

tablet;

smartphone.

Entretanto, o principal ambiente de uso acadêmico será desktop/notebook.

Tabelas grandes podem utilizar:

scroll horizontal;

versão adaptada;

cards em telas menores.

==================================================

COMPONENTIZAÇÃO

==================================================

Evite duplicação.

Crie componentes reutilizáveis quando fizer sentido.

Exemplos:

Sidebar

Navbar

PageHeader

Button

Input

Select

Modal

ConfirmDialog

DataTable

EmptyState

Loading

Toast

FormField

StatusBadge

As páginas de CRUD devem seguir o mesmo padrão visual.

==================================================

ESTADOS DA INTERFACE

==================================================

Toda tela que consome dados deverá considerar pelo menos:

LOADING

"Carregando..."

EMPTY

"Nenhum curso cadastrado."

ERROR

"Não foi possível carregar os dados."

SUCCESS

Dados apresentados normalmente.

==================================================

INTEGRAÇÃO COM BACKEND

==================================================

O Front-End será integrado posteriormente/continuamente com uma API.

Portanto:

separar camada visual da camada de requisições;

não espalhar chamadas HTTP pelos componentes;

criar uma camada service/api;

utilizar variáveis de ambiente para URL da API;

não colocar URL localhost fixa em dezenas de arquivos;

não colocar senha ou segredo no Front-End.

Exemplo conceitual:

src/

components/

pages/

services/

layouts/

hooks/

utils/

Não altere a arquitetura do projeto sem necessidade.

==================================================

O QUE NÃO FAZER

==================================================

NÃO:

inventar funcionalidades;

implementar dashboard analítico nesta Sprint;

adicionar gráficos sem solicitação;

criar IA;

adicionar chat;

adicionar pagamento;

adicionar notificações complexas;

adicionar recursos de LMS;

criar funcionalidades de Sprint 2;

modificar o modelo de dados por conta própria;

solicitar IDs numéricos manualmente ao usuário;

misturar todas as regras de negócio dentro dos componentes;

gerar uma interface diferente para cada CRUD.

==================================================

COMO VOCÊ DEVE TRABALHAR COMIGO

==================================================

Não gere o sistema inteiro de uma vez.

Vamos trabalhar PBI por PBI.

Quando eu informar:

"Vamos implementar MANTER CADASTRO DE CURSOS"

você deverá:

analisar o PBI;

explicar brevemente a tela que será criada;

indicar os componentes necessários;

indicar quais arquivos serão criados ou alterados;

implementar o Front-End;

explicar como testar;

aguardar minha confirmação antes de seguir para outro PBI.

Quando gerar código:

informe o caminho de cada arquivo;

não omita partes importantes;

preserve código existente;

evite refatorações não solicitadas;

explique dependências novas antes de instalá-las;

mantenha consistência com as telas anteriores.

Se precisar conhecer arquivos existentes do projeto, peça para eu enviar o código ou estrutura antes de assumir como estão organizados.

==================================================

PRIORIDADE ATUAL

==================================================

Estamos trabalhando na SPRINT 1.

A ordem recomendada é:

MANTER CADASTRO DE CURSOS

MANTER CADASTRO DE PERÍODOS ACADÊMICOS

MANTER CADASTRO DE DISCIPLINAS

MANTER CADASTRO DE TURMAS

MANTER CADASTRO DE PROFESSORES

MANTER CADASTRO DE ALUNOS

VINCULAR PROFESSOR À TURMA/DISCIPLINA

MATRICULAR ALUNO EM TURMA/DISCIPLINA

CONSULTAR TURMAS SOB RESPONSABILIDADE

MANTER CADASTRO DE AVALIAÇÕES DA TURMA

REGISTRAR NOTAS DOS ALUNOS

REGISTRAR FREQUÊNCIA DOS ALUNOS

Não avance automaticamente para o próximo.

Aguarde minhas instruções.

==================================================

PRIMEIRA RESPOSTA

==================================================

Depois de receber este contexto, não gere código ainda.

Apenas:

confirme que entendeu o ChironAcademy;

resuma a arquitetura Front-End que pretende seguir;

aponte qualquer informação técnica que ainda precise saber, como framework, estrutura atual do projeto ou bibliotecas instaladas;

aguarde eu informar qual PBI vamos implementar.