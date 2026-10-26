# ChironAcademy — Guia para Prova de Autoria

Este guia foi criado para ajudar na revisão do frontend do ChironAcademy antes da Prova de Autoria.

A ideia não é decorar soluções. O objetivo é saber localizar rapidamente a parte correta do projeto, entender o fluxo da tela e realizar pequenas alterações com segurança.

---

## 1. Como pensar durante a prova

Antes de alterar qualquer código:

1. Leia exatamente o que foi pedido.
2. Descubra em qual tela a alteração aparece.
3. Localize o componente JSX correspondente.
4. Procure o estado, botão, lista ou função relacionada.
5. Faça a menor alteração possível.
6. Salve o arquivo.
7. Teste a tela no navegador.
8. Verifique se não quebrou outra funcionalidade.

Evite alterar backend, banco ou services se a tarefa for exclusivamente visual ou de comportamento de frontend.

---

## 2. Mapa principal do frontend

O frontend está em:

```text
Frontend/pages/ChironAcademy/
```

Estrutura principal:

```text
src/
├── App.jsx
├── components/
├── pages/
│   ├── AreaGestor/
│   ├── AreaProfessor/
│   ├── AreaAluno/
│   ├── Login/
│   ├── Cadastro/
│   └── RecuperarSenha/
└── services/
    ├── gestorServices/
    └── professorServices/
```

---

## 3. Onde alterar cada funcionalidade

### Gestor

```text
Cursos
→ src/pages/AreaGestor/CursosFormPage.jsx

Períodos
→ src/pages/AreaGestor/PeriodosFormPage.jsx

Disciplinas
→ src/pages/AreaGestor/DisciplinasFormPage.jsx

Turmas
→ src/pages/AreaGestor/TurmasFormPage.jsx

Professores
→ src/pages/AreaGestor/ProfessoresFormPage.jsx

Alunos
→ src/pages/AreaGestor/AlunosFormPage.jsx

Vínculos Professor → Turma → Disciplina
→ src/pages/AreaGestor/VinculosFormPage.jsx

Matrículas
→ src/pages/AreaGestor/MatriculasFormPage.jsx

Tela inicial do gestor
→ src/pages/AreaGestor/AreaGestor.jsx
```

### Professor

```text
Tela inicial do professor
→ src/pages/AreaProfessor/AreaProfessor.jsx

Detalhes da turma / avaliações
→ src/pages/AreaProfessor/TurmaProfessorPage.jsx

Notas
→ src/pages/AreaProfessor/NotasProfessorPage.jsx

Aulas / frequência
→ src/pages/AreaProfessor/FrequenciaProfessorPage.jsx

Chamada
→ src/pages/AreaProfessor/ChamadaFrequenciaPage.jsx
```

### Rotas

```text
src/App.jsx
```

É onde estão as rotas como:

```text
/sistema/gestor
/sistema/gestor/matriculas
/sistema/professor
/sistema/professor/turmas/:idProfessorTurma
```

### Comunicação com o backend

```text
src/services/
```

Exemplos:

```text
gestorServices/matriculaFormService.js

professorServices/turmasProfessorService.js
professorServices/avaliacaoProfessorService.js
professorServices/notaProfessorService.js
professorServices/frequenciaProfessorService.js
```

Se o pedido for apenas visual, provavelmente não será necessário alterar esses arquivos.

---

## 4. React que mais importa para a prova

### useState

Usado para armazenar informação que muda na tela.

```jsx
const [mostrar, setMostrar] = useState(false)
```

Alterando:

```jsx
setMostrar(true)
```

Alternando:

```jsx
setMostrar(!mostrar)
```

---

## 5. Alterar comportamento de um botão

Procure por:

```jsx
onClick={...}
```

Exemplo:

```jsx
<button
  onClick={() => setMostrar(true)}
>
  Mostrar
</button>
```

Para alternar entre mostrar e esconder:

```jsx
<button
  onClick={() =>
    setMostrar(!mostrar)
  }
>
  {mostrar
    ? 'Ocultar'
    : 'Mostrar'}
</button>
```

---

## 6. Mostrar ou ocultar informação

Renderização condicional simples:

```jsx
{mostrar && (
  <div>
    Conteúdo
  </div>
)}
```

Com duas possibilidades:

```jsx
{mostrar ? (
  <p>Visível</p>
) : (
  <p>Oculto</p>
)}
```

---

## 7. Criar mensagem quando não houver resultados

Exemplo com avaliações:

```jsx
{avaliacoes.length === 0 ? (
  <p>
    Nenhuma avaliação encontrada.
  </p>
) : (
  avaliacoes.map((avaliacao) => (
    <div key={avaliacao.idAvaliacao}>
      {avaliacao.titulo}
    </div>
  ))
)}
```

O mesmo padrão pode ser usado para:

- alunos;
- turmas;
- notas;
- matrículas;
- aulas;
- professores;
- disciplinas.

---

## 8. Como funciona o map

O `.map()` transforma cada item de uma lista em conteúdo JSX.

```jsx
alunos.map((aluno) => (
  <div key={aluno.idAluno}>
    {aluno.nome}
  </div>
))
```

Se precisar alterar o que aparece em cada card, normalmente é dentro desse bloco.

---

## 9. Criar um filtro

Estado:

```jsx
const [busca, setBusca] =
  useState('')
```

Input:

```jsx
<input
  value={busca}
  onChange={(event) =>
    setBusca(event.target.value)
  }
/>
```

Filtro:

```jsx
const alunosFiltrados =
  alunos.filter((aluno) =>
    aluno.nome
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )
  )
```

Renderização:

```jsx
alunosFiltrados.map((aluno) => (
  <div key={aluno.idAluno}>
    {aluno.nome}
  </div>
))
```

---

## 10. Destacar um item selecionado

Estado:

```jsx
const [selecionado, setSelecionado] =
  useState(null)
```

Seleção:

```jsx
<button
  onClick={() =>
    setSelecionado(aluno.idAluno)
  }
>
  {aluno.nome}
</button>
```

Classe condicional:

```jsx
className={
  selecionado === aluno.idAluno
    ? 'item selecionado'
    : 'item'
}
```

Também pode ser feito diretamente com Tailwind:

```jsx
className={
  selecionado === aluno.idAluno
    ? 'border border-amber-400'
    : 'border border-zinc-800'
}
```

---

## 11. Campos de formulário

O padrão mais comum é:

```jsx
<input
  value={nome}
  onChange={(event) =>
    setNome(event.target.value)
  }
/>
```

O `value` representa o estado atual.

O `onChange` atualiza o estado conforme o usuário digita.

---

## 12. Validação visual simples

Exemplo:

```jsx
const [erro, setErro] =
  useState('')
```

Validando:

```jsx
if (!nome.trim()) {
  setErro(
    'Informe o nome.'
  )

  return
}
```

Mostrando:

```jsx
{erro && (
  <p>
    {erro}
  </p>
)}
```

---

## 13. Desabilitar um botão

```jsx
<button
  disabled={!nome.trim()}
>
  Salvar
</button>
```

Com aparência diferente:

```jsx
<button
  disabled={!nome.trim()}
  className={
    !nome.trim()
      ? 'opacity-50 cursor-not-allowed'
      : ''
  }
>
  Salvar
</button>
```

---

## 14. Navegação

O projeto utiliza React Router.

Normalmente:

```jsx
import {
  useNavigate
} from 'react-router-dom'
```

Depois:

```jsx
const navigate =
  useNavigate()
```

E:

```jsx
navigate(
  '/sistema/professor'
)
```

Rotas gerais ficam em:

```text
src/App.jsx
```

---

## 15. Parâmetros da URL

Nas telas do professor existem rotas com IDs.

Exemplo:

```text
/sistema/professor/turmas/:idProfessorTurma
```

No componente pode aparecer:

```jsx
const {
  idProfessorTurma
} = useParams()
```

Isso permite descobrir qual turma está sendo exibida.

---

## 16. Carregamento de dados

O padrão comum é usar `useEffect`.

```jsx
useEffect(() => {

  carregarDados()

}, [])
```

Quando existe uma dependência:

```jsx
useEffect(() => {

  carregarDados()

}, [idProfessorTurma])
```

Não altere as dependências sem entender o motivo, porque isso pode provocar chamadas repetidas.

---

## 17. Alterar texto exibido

Se o pedido for apenas:

> Troque o texto do botão "Salvar" para "Confirmar".

Normalmente basta alterar:

```jsx
<button>
  Salvar
</button>
```

para:

```jsx
<button>
  Confirmar
</button>
```

Não altere funções ou APIs se o comportamento não precisa mudar.

---

## 18. Alterar uma informação exibida

Exemplo:

```jsx
<p>
  {aluno.nome}
</p>
```

Para incluir matrícula:

```jsx
<p>
  {aluno.nome}
  {' - '}
  {aluno.numeroMatricula}
</p>
```

Antes de usar uma propriedade, confirme que ela já existe no objeto retornado.

---

## 19. Contadores

Exemplo:

```jsx
<p>
  Total: {alunos.length}
</p>
```

Com filtro:

```jsx
<p>
  Encontrados:
  {' '}
  {alunosFiltrados.length}
</p>
```

---

## 20. Filtrar por status

Exemplo para matrículas:

```jsx
const cursando =
  matriculas.filter(
    (matricula) =>
      matricula.statusMatricula ===
      'CURSANDO'
  )
```

Depois:

```jsx
<p>
  Cursando: {cursando.length}
</p>
```

---

## 21. Alterar estado visual

Uma tarefa pode pedir algo como:

> Destaque alunos presentes.

Exemplo:

```jsx
className={
  aluno.statusFrequencia ===
  'PRESENTE'
    ? 'font-semibold'
    : ''
}
```

O princípio é:

```text
condição
    ↓
className diferente
    ↓
aparência diferente
```

---

## 22. Frequência

Arquivos principais:

```text
FrequenciaProfessorPage.jsx
ChamadaFrequenciaPage.jsx
```

Status utilizados:

```text
PRESENTE
FALTA
JUSTIFICADA
```

Se for uma alteração na chamada, comece por:

```text
ChamadaFrequenciaPage.jsx
```

Se for alteração na lista de aulas:

```text
FrequenciaProfessorPage.jsx
```

---

## 23. Notas

Arquivo:

```text
NotasProfessorPage.jsx
```

A API já controla regras como nota não ultrapassar o valor máximo da avaliação.

Se a tarefa for apenas visual, não replique regra complexa do backend sem necessidade.

---

## 24. Avaliações

As avaliações aparecem principalmente em:

```text
TurmaProfessorPage.jsx
```

Se pedirem:

- alterar card da avaliação;
- mostrar uma informação;
- trocar botão;
- colocar mensagem quando não houver avaliações;

comece por esse arquivo.

---

## 25. Matrículas

Arquivo:

```text
MatriculasFormPage.jsx
```

Pode envolver:

- filtro;
- status;
- aluno;
- disciplina;
- turma;
- mensagens;
- seleção;
- formulário.

---

## 26. Entendendo o fluxo frontend → backend

Exemplo simplificado:

```text
MatriculasFormPage.jsx
        ↓
matriculaFormService.js
        ↓
HTTP /api/matriculas
        ↓
Backend
        ↓
MySQL
```

No professor:

```text
NotasProfessorPage.jsx
        ↓
notaProfessorService.js
        ↓
/api/professor/turmas/.../notas
```

Se a informação já chega corretamente da API, uma pequena alteração visual deve ficar no frontend.

---

## 27. ProtectedRoute

As áreas estão protegidas por perfil.

Exemplo conceitual:

```jsx
<ProtectedRoute
  perfisPermitidos={[
    'PROFESSOR'
  ]}
>
  <AreaProfessor />
</ProtectedRoute>
```

Perfis usados:

```text
GESTOR
PROFESSOR
ALUNO
```

Essas regras também são verificadas no backend.

---

## 28. Checklist de 10 minutos

Quando receber a atividade:

```text
[ ] Entendi exatamente o pedido?
[ ] Sei em qual tela acontece?
[ ] Encontrei o arquivo JSX?
[ ] Encontrei o trecho responsável?
[ ] É apenas frontend?
[ ] Consigo fazer a menor alteração possível?
[ ] Salvei?
[ ] O Vite recompilou?
[ ] Testei no navegador?
[ ] O comportamento antigo continua funcionando?
```

---

## 29. Atalhos úteis no VS Code

Buscar no arquivo:

```text
Command + F
```

Buscar no projeto inteiro:

```text
Command + Shift + F
```

Formatar documento:

```text
Shift + Option + F
```

Termos úteis para pesquisar no projeto:

```text
onClick
onChange
useState
useEffect
map(
filter(
navigate(
idProfessorTurma
avaliacoes
alunos
matriculas
frequencias
```

---

## 30. Regra principal

Durante uma alteração pequena:

> altere o mínimo necessário.

Se o pedido é trocar o comportamento de um botão, não reorganize o componente inteiro.

Se o pedido é criar um filtro, não altere o backend se os dados já estão disponíveis.

Se o pedido é mostrar uma mensagem, não altere banco ou API.

Primeiro encontre o trecho responsável pelo comportamento atual. Depois faça uma alteração pequena, teste e explique o que mudou.

---

## Resumo mental

```text
useState
→ guarda estado

setEstado(...)
→ altera estado

onClick
→ clique

onChange
→ alteração de input

map
→ exibe uma lista

filter
→ filtra uma lista

condicao && (...)
→ mostra ou esconde

condicao ? A : B
→ escolhe entre duas interfaces

useEffect
→ executa lógica ao carregar ou quando algo muda

navigate
→ muda de página

useParams
→ lê IDs da rota

services/
→ comunicação com backend

App.jsx
→ rotas
```

O principal para a Prova de Autoria é conseguir explicar:

1. onde está a funcionalidade;
2. como ela funciona hoje;
3. qual trecho será alterado;
4. por que a alteração resolve o pedido;
5. como você confirmou que continuou funcionando.


---

## 31. Critérios de aceite e onde localizar

Nos controllers principais existe um comentário curto no formato `PBI XX | Aceite:`. Ele marca a regra central de cada item sem poluir o código.

| PBI | Aceite resumido | Backend | Frontend |
| --- | --- | --- | --- |
| 01 | Manter cursos: criar, consultar, editar e excluir | `cursoFormController.js` | `CursosFormPage.jsx` |
| 02 | Manter períodos vinculados a um curso | `periodoFormController.js` | `PeriodosFormPage.jsx` |
| 03 | Manter disciplinas ligadas ao curso e período corretos | `disciplinaFormController.js` | `DisciplinasFormPage.jsx` |
| 04 | Manter turmas ligadas a um curso | `turmaFormController.js` | `TurmasFormPage.jsx` |
| 05 | Manter cadastro de professores | `professorFormController.js` | `ProfessoresFormPage.jsx` |
| 06 | Manter alunos com curso/período e matrícula/e-mail únicos | `alunoFormController.js` | `AlunosFormPage.jsx` |
| 07 | Vincular professor + turma + disciplina sem duplicidade | `vinculosFormController.js` | `VinculosFormPage.jsx` |
| 08 | Matricular aluno em turma/disciplina compatíveis e controlar status | `matriculaFormController.js` | `MatriculasFormPage.jsx` |
| 09 | Professor consulta somente suas turmas e seus alunos | `turmasProfessorController.js` | `AreaProfessor.jsx` e `TurmaProfessorPage.jsx` |
| 10 | Professor mantém avaliações das próprias turmas | `avaliacaoProfessorController.js` | `TurmaProfessorPage.jsx` |
| 11 | Professor registra notas dos matriculados respeitando o valor máximo | `notaProfessorController.js` | `NotasProfessorPage.jsx` |
| 12 | Professor registra frequência dos matriculados nas próprias turmas | `frequenciaProfessorController.js` | `FrequenciaProfessorPage.jsx` e `ChamadaFrequenciaPage.jsx` |

### Atalho

No VS Code, use `Command + Shift + F` e procure por:

```text
PBI 01 | Aceite
PBI 02 | Aceite
PBI 03 | Aceite
...
PBI 12 | Aceite
```

Assim você cai direto no controller principal do PBI. Para alterações visuais, use a coluna de frontend da tabela.
