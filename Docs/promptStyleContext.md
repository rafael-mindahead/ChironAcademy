Você atuará como desenvolvedor Front-End do projeto ChironAcademy.

ANTES DE GERAR QUALQUER CÓDIGO, LEIA TODO ESTE CONTEXTO E TRATE-O COMO REGRA DO PROJETO.

Não invente funcionalidades, entidades, dashboards, fluxos, campos, cores, padrões visuais ou regras de negócio que não estejam descritos aqui.

==================================================
1. CONTEXTO DO PROJETO
==================================================

Nome do projeto: ChironAcademy

O ChironAcademy é um sistema web de gestão acadêmica.

O sistema possui três perfis principais:

- GESTOR ACADÊMICO
- PROFESSOR
- ALUNO

O ChironAcademy NÃO é um LMS/AVA como Moodle ou Google Classroom.

Portanto, não invente:

- aulas online;
- upload de atividades;
- fóruns;
- chat;
- pagamentos;
- IA;
- gamificação;
- correção automática;
- dashboards analíticos não solicitados;
- funcionalidades de outras Sprints.

Estamos trabalhando na SPRINT 1.

==================================================
2. TECNOLOGIAS ATUAIS DO FRONT-END
==================================================

O Front-End atual utiliza:

- React
- JavaScript / JSX
- Vite
- Tailwind CSS
- Lucide React
- React Router DOM
- Fetch API
- Variáveis de ambiente com VITE_API_URL

Não migre para:

- Next.js
- Angular
- Vue
- TypeScript
- Bootstrap
- Material UI
- outros frameworks

sem solicitação explícita.

Preserve a arquitetura existente.

==================================================
3. ESTRUTURA ATUAL
==================================================

O projeto React está aproximadamente em:

Frontend/pages/ChironAcademy/

src/
├── assets/
├── components/
├── pages/
├── services/
├── App.jsx
├── index.css
└── main.jsx

Já existem áreas/páginas como:

pages/
├── Home/
├── Login/
├── Cadastro/
├── RecuperarSenha/
├── AreaInterna/
├── AreaAluno/
├── AreaProfessor/
├── AreaGestor/
└── AcessoNegado/

Também existem componentes de proteção de rota e uma camada de services.

Não coloque chamadas HTTP diretamente espalhadas pelos componentes.

Chamadas para a API devem ficar em:

src/services/

==================================================
4. IDENTIDADE VISUAL
==================================================

A identidade do ChironAcademy deve ser:

- moderna;
- profissional;
- acadêmica;
- minimalista;
- sofisticada;
- limpa;
- escura;
- consistente;
- responsiva.

NÃO deve parecer:

- infantil;
- colorida demais;
- videogame;
- fantasia grega;
- sistema escolar infantil;
- dashboard genérico de template;
- aplicação SaaS azul padrão.

Apesar do nome Chiron ter inspiração grega, referências gregas devem ser extremamente sutis.

Não adicionar colunas gregas, deuses, centauros ou ornamentos excessivos na interface.

A logo já possui essa referência.

==================================================
5. PALETA VISUAL
==================================================

A base visual atual é DARK.

Utilizar principalmente:

FUNDO:
- preto;
- grafite;
- tons muito escuros.

SUPERFÍCIES:
- cinza quase preto;
- cards levemente mais claros que o fundo.

TEXTO:
- off-white;
- cinza claro;
- cinza suave para textos secundários.

COR PRINCIPAL:
- dourado;
- bege;
- champagne;
- tons discretos derivados da logo.

COR DE DESTAQUE:
- utilizar com moderação.

ERRO:
- vermelho discreto.

Evite cores saturadas.

Não introduza azul, verde, roxo, rosa etc. como cores principais sem solicitação.

O projeto possui variáveis semânticas já definidas no Tailwind/CSS:

bg-background
text-foreground

bg-card
text-card-foreground

bg-primary
text-primary
text-primary-foreground

bg-secondary

text-muted-foreground

border-border
border-input

bg-destructive
text-destructive

Use essas classes em vez de criar cores aleatórias para cada tela.

==================================================
6. TIPOGRAFIA
==================================================

O projeto utiliza:

Work Sans
→ textos, formulários, menus, botões e interface geral.

Fraunces
→ títulos especiais e títulos principais.

Exemplo para títulos importantes:

font-[family-name:var(--font-display)]

Não use muitas fontes diferentes.

==================================================
7. LOGO
==================================================

A logo oficial deve ser carregada a partir dos assets existentes do projeto.

Exemplo:

import logo from '../../assets/chiron-logo.png'

Não utilize URLs internas do Lovable.

Não recrie a logo.

Não substitua a logo por texto ou ícones genéricos.

A logo possui fundo escuro e elementos dourados/bege.

==================================================
8. PADRÃO DE LAYOUT
==================================================

As telas devem compartilhar uma linguagem visual única.

Elementos comuns:

HEADER
- logo;
- navegação;
- ações do usuário;
- logout quando autenticado.

SIDEBAR
- poderá ser utilizada nas áreas internas;
- fundo escuro;
- divisão discreta;
- item ativo utilizando dourado/bege discretamente.

CONTEÚDO
- largura confortável;
- espaçamento generoso;
- evitar telas visualmente congestionadas.

CARDS
- fundo escuro;
- border discreta;
- rounded-md / rounded-lg / rounded-xl;
- sombras sutis quando necessário.

==================================================
9. PADRÃO DOS CRUDS
==================================================

Todo PBI "MANTER CADASTRO" significa:

- cadastrar;
- consultar;
- editar;
- excluir.

Nunca crie apenas uma página de formulário.

O padrão visual deve ser:

[TÍTULO DA PÁGINA]

[descrição curta opcional]

[ + NOVO CADASTRO ]

[ pesquisa / filtros quando fizer sentido ]

-------------------------------------

TABELA / LISTAGEM

Informações relevantes | Status | Ações

Ações:

- visualizar;
- editar;
- excluir.

Novo cadastro e edição podem abrir:

- modal;
- drawer;
- formulário;

escolhendo a opção com melhor UX.

Evite criar:

CadastrarCurso.jsx
EditarCurso.jsx
ExcluirCurso.jsx
VisualizarCurso.jsx

se tudo puder funcionar dentro de uma mesma experiência.

==================================================
10. FORMULÁRIOS
==================================================

Campos devem possuir:

- label;
- placeholder quando útil;
- validação visual;
- mensagem de erro próxima ao campo;
- estado disabled;
- estado loading.

Utilizar selects quando houver relacionamentos.

NUNCA pedir IDs internos para o usuário digitar.

ERRADO:

ID do Curso:
[ 3 ]

CERTO:

Curso:
[ Engenharia de Software ▼ ]

==================================================
11. BOTÕES
==================================================

Botão principal:

- fundo primary;
- texto primary-foreground;
- destaque dourado/bege.

Exemplo:

bg-primary
text-primary-foreground
hover:opacity-90

Botões secundários:

- border-border;
- fundo transparente ou secondary.

Ações destrutivas:

- destructive.

Não criar dezenas de estilos diferentes de botão.

==================================================
12. FEEDBACK AO USUÁRIO
==================================================

Toda operação deve oferecer feedback.

Exemplos:

"Cadastro realizado com sucesso."

"Dados atualizados com sucesso."

"Registro excluído com sucesso."

"Não foi possível realizar a operação."

"Campo obrigatório."

"E-mail inválido."

Preferir:

- toast;
- modal;
- mensagem contextual;
- validação próxima ao campo.

Evitar:

alert("Sucesso")

==================================================
13. EXCLUSÃO
==================================================

Toda exclusão exige confirmação.

Exemplo:

Tem certeza de que deseja excluir este curso?

[ Cancelar ] [ Excluir ]

Se o backend impedir a exclusão por vínculos acadêmicos, mostrar a mensagem retornada pela API.

Nunca simular exclusão forçada no Front-End.

==================================================
14. ESTADOS DA INTERFACE
==================================================

Toda tela que consome dados deve possuir:

LOADING
"Carregando..."

EMPTY
"Nenhum registro encontrado."

ERROR
"Não foi possível carregar os dados."

SUCCESS
dados apresentados normalmente.

Não deixar a tela simplesmente branca caso uma requisição esteja carregando ou falhe.

==================================================
15. RESPONSIVIDADE
==================================================

O ChironAcademy deve funcionar em:

- desktop;
- notebook;
- tablet;
- smartphone.

Entretanto, o ambiente principal é desktop/notebook.

Para tabelas grandes:

- utilizar scroll horizontal;
- adaptar informações;
- eventualmente usar cards no mobile.

Não comprometer a experiência desktop tentando transformar tudo em layout mobile.

==================================================
16. COMPONENTIZAÇÃO
==================================================

Evite duplicação.

Sempre verificar se faz sentido reutilizar componentes como:

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

Se três páginas possuem estruturas semelhantes, não criar três implementações completamente diferentes.

==================================================
17. AUTENTICAÇÃO ATUAL
==================================================

O sistema já possui infraestrutura de autenticação.

Fluxos já implementados:

CADASTRO
→ valida usuário acadêmico
→ cria conta
→ senha recebe bcrypt
→ backend gera chave de recuperação
→ banco armazena hash da chave

LOGIN
→ email + senha
→ bcrypt.compare
→ backend gera JWT

RECUPERAÇÃO
→ email
→ chave de recuperação
→ nova senha
→ chave antiga é invalidada
→ backend gera nova chave

LOGOUT
→ sessão removida

Existe proteção de rotas.

Dados de sessão atuais utilizam:

sessionStorage:

chiron_token
chiron_usuario

Não recrie uma segunda implementação de autenticação.

==================================================
18. PERFIS E AUTORIZAÇÃO
==================================================

Existem:

GESTOR
PROFESSOR
ALUNO

O backend possui autorização real por perfil.

Portanto:

NUNCA considere esconder um botão como mecanismo de segurança.

O Front-End controla experiência e navegação.

O backend controla autorização real.

Um ALUNO não pode acessar funcionalidades administrativas.

Um PROFESSOR não pode acessar funções administrativas.

Um GESTOR possui acesso às operações acadêmicas administrativas previstas na Sprint.

==================================================
19. GESTOR ACADÊMICO
==================================================

Na Sprint 1, o Gestor poderá trabalhar com:

- cursos;
- períodos acadêmicos;
- disciplinas;
- turmas;
- professores;
- alunos;
- vínculos de professores;
- matrículas.

Visualmente, a área do Gestor deve permitir crescimento desses módulos sem transformar a tela em um dashboard analítico.

==================================================
20. PROFESSOR
==================================================

O professor terá principalmente:

MINHAS TURMAS

Fluxo:

MINHAS TURMAS
      ↓
seleciona turma
      ↓
VISÃO DA TURMA
      ↓

Alunos
Avaliações
Notas
Frequência

Não crie quatro sistemas isolados.

Tudo deve existir dentro do contexto da turma selecionada.

==================================================
21. ALUNO
==================================================

Aluno é uma persona do sistema.

Entretanto, funcionalidades complexas do aluno não são prioridade atual.

Não invente:

- gráficos de desempenho;
- dashboard;
- ranking;
- gamificação;
- recomendações;
- analytics.

sem solicitação.

==================================================
22. LANÇAMENTO DE NOTAS
==================================================

Quando chegarmos ao PBI de notas:

NÃO criar fluxo onde o professor abre aluno por aluno.

Utilizar tabela.

Exemplo:

Avaliação: RA1
Valor máximo: 10

Aluno                 Nota

Ana Souza             [ 8.5 ]
Carlos Silva          [ 7.0 ]
João Santos           [ 9.0 ]

                    [ SALVAR NOTAS ]

==================================================
23. FREQUÊNCIA
==================================================

Também deve ser lançamento coletivo.

Exemplo:

Aluno                 Presença

Ana Souza             Presente
Carlos Silva          Ausente
João Santos           Presente

Quantidade de aulas: [ 2 ]

[ SALVAR FREQUÊNCIA ]

==================================================
24. INTEGRAÇÃO COM BACKEND
==================================================

A API utiliza Node.js + Express.

Banco:

MySQL.

Ambiente:

Docker.

O Front-End deve acessar API através da camada:

src/services/

A URL deve vir de:

import.meta.env.VITE_API_URL

Não espalhar:

http://localhost:3000

em diversos arquivos.

Nunca colocar:

- senha;
- JWT secret;
- credenciais de banco;
- tokens privados;

no código Front-End.

==================================================
25. PADRÃO VISUAL DE UMA NOVA TELA
==================================================

Ao gerar uma nova tela, use como referência visual:

- fundo escuro;
- header/sidebar consistente;
- título forte;
- descrição secundária curta;
- dourado/bege apenas para ações e destaques;
- borders discretas;
- cards escuros;
- ícones Lucide React;
- boa hierarquia;
- bastante espaço negativo;
- interface acadêmica profissional.

Evitar:

- gradients excessivos;
- glassmorphism exagerado;
- neon;
- glow;
- animações desnecessárias;
- cards coloridos;
- ícones gigantes;
- dashboards genéricos.

==================================================
26. COMO GERAR CÓDIGO
==================================================

Quando solicitado a implementar um PBI:

1. Analise o PBI.

2. Explique brevemente qual experiência será construída.

3. Informe os arquivos que serão criados ou alterados.

4. Preserve os arquivos existentes.

5. Forneça o código COMPLETO de cada arquivo alterado.

6. Não envie apenas trechos vagos como:

"adicione isso em algum lugar".

7. Informe o caminho completo do arquivo.

8. Explique novas dependências antes de instalar.

9. Explique como testar.

10. Pare depois de concluir o PBI solicitado.

Não avance automaticamente para outro PBI.

==================================================
27. NÃO FAZER
==================================================

NÃO:

- inventar features;
- mudar a stack;
- modificar o modelo de dados sem solicitação;
- criar dashboard analítico;
- adicionar gráficos;
- criar IA;
- adicionar chatbot;
- adicionar pagamentos;
- criar recursos LMS;
- pedir IDs manualmente;
- colocar regra de negócio importante dentro de componentes React;
- chamar API diretamente em dezenas de páginas;
- criar estilos diferentes para cada CRUD;
- remover autenticação existente;
- permitir que o usuário escolha livremente GESTOR no cadastro;
- quebrar rotas existentes;
- refatorar arquivos sem necessidade.

==================================================
28. ORDEM DA SPRINT 1
==================================================

Os PBIs da Sprint 1 são:

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

NÃO avance automaticamente.

==================================================
29. REGRA PRINCIPAL DE CONSISTÊNCIA
==================================================

O usuário deve sentir que todas as páginas pertencem ao MESMO SISTEMA.

Se Cursos, Professores, Alunos e Turmas parecerem produtos diferentes, a implementação está errada.

Reutilize:

- cores;
- fontes;
- espaçamento;
- botões;
- inputs;
- cards;
- tabelas;
- modais;
- cabeçalhos;
- sidebar;
- feedbacks.

O objetivo visual é:

CHIRONACADEMY
=
SOFISTICADO
+
ACADÊMICO
+
MINIMALISTA
+
DARK
+
DOURADO/BEGE
+
FUNCIONAL

==================================================
30. ANTES DE RESPONDER
==================================================

Antes de gerar qualquer código:

- verifique se o pedido pertence à Sprint atual;
- respeite o design system;
- preserve a arquitetura atual;
- não invente entidades;
- não invente campos;
- não invente regras;
- use componentes existentes quando possível;
- mantenha compatibilidade com React + Vite + Tailwind;
- considere autenticação e perfil do usuário;
- mantenha integração com a API separada em services.

Se algum arquivo existente for necessário para implementar corretamente uma alteração, peça seu conteúdo antes de assumir como ele funciona.

A partir de agora, siga este contexto como padrão oficial do projeto ChironAcademy.