import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  atualizarMatricula,
  criarMatricula,
  excluirMatricula,
  listarMatriculas,
  listarOpcoesMatricula
} from '../../services/gestorServices/matriculaFormService.js'


const formularioVazio = {

  idAluno:
    '',

  idTurma:
    '',

  codDisciplina:
    '',

  statusMatricula:
    'CURSANDO'

}


const nomesStatus = {

  CURSANDO:
    'Cursando',

  APROVADO:
    'Aprovado',

  REPROVADO:
    'Reprovado',

  TRANCADO:
    'Trancado',

  JUSTIFICADO:
    'Justificado'

}


const nomesTurno = {

  MANHA:
    'Manhã',

  TARDE:
    'Tarde',

  NOITE:
    'Noite'

}


function MatriculasFormPage() {

  const navigate =
    useNavigate()


  const [
    matriculas,
    setMatriculas
  ] =
    useState([])


  const [
    alunos,
    setAlunos
  ] =
    useState([])


  const [
    turmas,
    setTurmas
  ] =
    useState([])


  const [
    disciplinas,
    setDisciplinas
  ] =
    useState([])


  const [
    statusDisponiveis,
    setStatusDisponiveis
  ] =
    useState([])


  const [
    formulario,
    setFormulario
  ] =
    useState(
      formularioVazio
    )


  const [
    matriculaEmEdicao,
    setMatriculaEmEdicao
  ] =
    useState(null)


  const [
    matriculaParaExcluir,
    setMatriculaParaExcluir
  ] =
    useState(null)


  const [
    carregando,
    setCarregando
  ] =
    useState(true)


  const [
    salvando,
    setSalvando
  ] =
    useState(false)


  const [
    erro,
    setErro
  ] =
    useState('')


  const [
    mensagem,
    setMensagem
  ] =
    useState('')


  // ====================================================
  // CARREGAMENTO
  // ====================================================

  useEffect(() => {

    carregar()

  }, [])


  async function carregar() {

    try {

      setCarregando(true)

      setErro('')


      const [
        lista,
        opcoes
      ] =
        await Promise.all([

          listarMatriculas(),

          listarOpcoesMatricula()

        ])


      setMatriculas(
        lista
      )


      setAlunos(
        opcoes.alunos ||
        []
      )


      setTurmas(
        opcoes.turmas ||
        []
      )


      setDisciplinas(
        opcoes.disciplinas ||
        []
      )


      setStatusDisponiveis(
        opcoes.status ||
        []
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar as matrículas.'
      )


    } finally {

      setCarregando(false)

    }

  }


  // ====================================================
  // ALUNO SELECIONADO
  // ====================================================

  const alunoSelecionado =
    useMemo(
      () =>
        alunos.find(
          aluno =>
            Number(
              aluno.idAluno
            ) ===
            Number(
              formulario.idAluno
            )
        ),

      [
        alunos,
        formulario.idAluno
      ]
    )


  // ====================================================
  // FILTRAGEM POR CURSO
  // ====================================================

  const turmasFiltradas =
    useMemo(
      () => {

        if (
          !alunoSelecionado
        ) {

          return turmas

        }


        return turmas.filter(
          turma =>
            Number(
              turma.idCurso
            ) ===
            Number(
              alunoSelecionado.idCurso
            )
        )

      },

      [
        turmas,
        alunoSelecionado
      ]
    )


  const disciplinasFiltradas =
    useMemo(
      () => {

        if (
          !alunoSelecionado
        ) {

          return disciplinas

        }


        return disciplinas.filter(
          disciplina =>
            Number(
              disciplina.idCurso
            ) ===
            Number(
              alunoSelecionado.idCurso
            )
        )

      },

      [
        disciplinas,
        alunoSelecionado
      ]
    )


  // ====================================================
  // TOAST
  // ====================================================

  function toast(
    texto
  ) {

    setMensagem(
      texto
    )


    window.setTimeout(
      () =>
        setMensagem(''),

      3500
    )

  }


  // ====================================================
  // ALTERAR CAMPO
  // ====================================================

  function campo(
    nome,
    valor
  ) {

    setFormulario(
      atual => ({

        ...atual,

        [nome]:
          valor

      })
    )

  }


  // ====================================================
  // ALTERAR ALUNO
  // ====================================================

  function selecionarAluno(
    valor
  ) {

    setFormulario(
      atual => ({

        ...atual,

        idAluno:
          valor,

        idTurma:
          '',

        codDisciplina:
          ''

      })
    )

  }


  // ====================================================
  // LIMPAR
  // ====================================================

  function limparFormulario() {

    setFormulario(
      formularioVazio
    )

    setMatriculaEmEdicao(
      null
    )

    setErro('')

  }


  // ====================================================
  // EDITAR
  // ====================================================

  function editar(
    matricula
  ) {

    setMatriculaEmEdicao(
      matricula
    )


    setFormulario({

      idAluno:
        String(
          matricula.idAluno
        ),

      idTurma:
        String(
          matricula.idTurma
        ),

      codDisciplina:
        matricula.codDisciplina,

      statusMatricula:
        matricula.statusMatricula

    })


    setErro('')


    window.scrollTo({

      top:
        0,

      behavior:
        'smooth'

    })

  }


  // ====================================================
  // SALVAR
  // ====================================================

  async function salvar(
    event
  ) {

    event.preventDefault()


    setErro('')


    if (
      !formulario.idAluno ||
      !formulario.idTurma ||
      !formulario.codDisciplina
    ) {

      setErro(
        'Aluno, turma e disciplina são obrigatórios.'
      )

      return

    }


    const dados = {

      idAluno:
        Number(
          formulario.idAluno
        ),

      idTurma:
        Number(
          formulario.idTurma
        ),

      codDisciplina:
        formulario.codDisciplina,

      statusMatricula:
        formulario.statusMatricula

    }


    try {

      setSalvando(true)


      if (
        matriculaEmEdicao
      ) {

        await atualizarMatricula(
          matriculaEmEdicao.idMatricula,
          dados
        )


        toast(
          'Matrícula atualizada com sucesso.'
        )


      } else {

        await criarMatricula(
          dados
        )


        toast(
          'Aluno matriculado com sucesso.'
        )

      }


      limparFormulario()


      await carregar()


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível salvar a matrícula.'
      )


    } finally {

      setSalvando(false)

    }

  }


  // ====================================================
  // EXCLUIR
  // ====================================================

  async function confirmarExclusao() {

    if (
      !matriculaParaExcluir
    ) {

      return

    }


    try {

      setSalvando(true)

      setErro('')


      await excluirMatricula(
        matriculaParaExcluir.idMatricula
      )


      setMatriculaParaExcluir(
        null
      )


      toast(
        'Matrícula excluída com sucesso.'
      )


      await carregar()


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível excluir a matrícula.'
      )


    } finally {

      setSalvando(false)

    }

  }


  // ====================================================
  // DATA
  // ====================================================

  function formatarData(
    data
  ) {

    if (!data) {
      return '-'
    }


    const valor =
      String(data)
        .slice(
          0,
          10
        )


    const [
      ano,
      mes,
      dia
    ] =
      valor.split('-')


    if (
      !ano ||
      !mes ||
      !dia
    ) {

      return valor

    }


    return (
      `${dia}/${mes}/${ano}`
    )

  }


  return (

    <div
      className="
        min-h-screen
        bg-background
        px-6
        py-10
        lg:px-10
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* ==============================================
            HEADER
        ============================================== */}

        <div
          className="
            mb-8
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                font-[family-name:var(--font-display)]
                text-4xl
              "
            >
              Matrículas
            </h1>


            <p
              className="
                mt-3
                text-sm
                text-muted-foreground
              "
            >
              Matricule alunos em turmas e disciplinas.
            </p>

          </div>


          <button
            type="button"

            onClick={() =>
              navigate(
                '/sistema/gestor'
              )
            }

            className="
              rounded-md
              border
              border-border
              px-4
              py-2
              text-sm
              text-muted-foreground
              hover:bg-secondary
              hover:text-foreground
            "
          >
            ← Voltar ao menu
          </button>

        </div>


        {/* ==============================================
            FORMULÁRIO
        ============================================== */}

        <section
          className="
            mb-10
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
          "
        >

          <div
            className="
              mb-6
            "
          >

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              {
                matriculaEmEdicao
                  ? 'Editar matrícula'
                  : 'Nova matrícula'
              }
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {
                matriculaEmEdicao
                  ? 'Atualize os dados acadêmicos da matrícula.'
                  : 'Selecione o aluno e os vínculos acadêmicos.'
              }
            </p>

          </div>


          <form
            onSubmit={
              salvar
            }

            className="
              space-y-6
            "
          >

            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

              {/* ALUNO */}

              <Campo
                titulo="Aluno"
              >

                <select
                  required

                  value={
                    formulario.idAluno
                  }

                  onChange={
                    event =>
                      selecionarAluno(
                        event.target.value
                      )
                  }

                  className="campo"
                >

                  <option value="">
                    Selecione um aluno
                  </option>


                  {
                    alunos.map(
                      aluno => (

                        <option
                          key={
                            aluno.idAluno
                          }

                          value={
                            aluno.idAluno
                          }
                        >

                          {
                            aluno.nome
                          }

                          {' — '}

                          {
                            aluno.numeroMatricula
                          }

                        </option>

                      )
                    )
                  }

                </select>

              </Campo>


              {/* CURSO */}

              <Campo
                titulo="Curso"
                obrigatorio={false}
              >

                <input
                  readOnly

                  value={
                    alunoSelecionado
                      ?.nomeCurso ||
                    ''
                  }

                  placeholder="Definido pelo aluno"

                  className="
                    campo
                    cursor-not-allowed
                    opacity-70
                  "
                />

              </Campo>


              {/* TURMA */}

              <Campo
                titulo="Turma"
              >

                <select
                  required

                  disabled={
                    !formulario.idAluno
                  }

                  value={
                    formulario.idTurma
                  }

                  onChange={
                    event =>
                      campo(
                        'idTurma',
                        event.target.value
                      )
                  }

                  className="campo"
                >

                  <option value="">
                    Selecione uma turma
                  </option>


                  {
                    turmasFiltradas.map(
                      turma => (

                        <option
                          key={
                            turma.idTurma
                          }

                          value={
                            turma.idTurma
                          }
                        >

                          {
                            turma.localTurma
                          }

                          {' — '}

                          {
                            nomesTurno[
                              turma.turnoTurma
                            ] ||
                            turma.turnoTurma
                          }

                        </option>

                      )
                    )
                  }

                </select>

              </Campo>


              {/* DISCIPLINA */}

              <Campo
                titulo="Disciplina"
              >

                <select
                  required

                  disabled={
                    !formulario.idAluno
                  }

                  value={
                    formulario.codDisciplina
                  }

                  onChange={
                    event =>
                      campo(
                        'codDisciplina',
                        event.target.value
                      )
                  }

                  className="campo"
                >

                  <option value="">
                    Selecione uma disciplina
                  </option>


                  {
                    disciplinasFiltradas.map(
                      disciplina => (

                        <option
                          key={
                            disciplina.codDisciplina
                          }

                          value={
                            disciplina.codDisciplina
                          }
                        >

                          {
                            disciplina.codDisciplina
                          }

                          {' — '}

                          {
                            disciplina.nomeDisciplina
                          }

                        </option>

                      )
                    )
                  }

                </select>

              </Campo>


              {/* STATUS */}

              <Campo
                titulo="Status"
              >

                <select
                  required

                  value={
                    formulario.statusMatricula
                  }

                  onChange={
                    event =>
                      campo(
                        'statusMatricula',
                        event.target.value
                      )
                  }

                  className="campo"
                >

                  {
                    statusDisponiveis.map(
                      status => (

                        <option
                          key={
                            status
                          }

                          value={
                            status
                          }
                        >
                          {
                            nomesStatus[
                              status
                            ] ||
                            status
                          }
                        </option>

                      )
                    )
                  }

                </select>

              </Campo>

            </div>


            {
              erro && (

                <p
                  className="
                    rounded-md
                    border
                    border-destructive/30
                    bg-destructive/10
                    p-3
                    text-sm
                    text-destructive
                  "
                >
                  {erro}
                </p>

              )
            }


            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-border
                pt-5
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"

                onClick={
                  limparFormulario
                }

                className="
                  botao-secundario
                "
              >
                Redefinir
              </button>


              {
                matriculaEmEdicao && (

                  <button
                    type="button"

                    onClick={
                      limparFormulario
                    }

                    className="
                      botao-secundario
                    "
                  >
                    Cancelar edição
                  </button>

                )
              }


              <button
                type="submit"

                disabled={
                  salvando
                }

                className="
                  botao-principal
                "
              >

                {
                  salvando
                    ? 'Salvando...'
                    : matriculaEmEdicao
                      ? 'Atualizar matrícula'
                      : 'Matricular aluno'
                }

              </button>

            </div>

          </form>

        </section>


        {/* ==============================================
            LISTAGEM
        ============================================== */}

        <section>

          <div
            className="
              mb-4
            "
          >

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Matrículas cadastradas
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {
                matriculas.length
              } registro(s) encontrado(s)
            </p>

          </div>


          {
            carregando && (

              <Estado
                texto="Carregando matrículas..."
              />

            )
          }


          {
            !carregando &&
            matriculas.length === 0 && (

              <Estado
                texto="Nenhuma matrícula encontrada."
              />

            )
          }


          {
            !carregando &&
            matriculas.length > 0 && (

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  shadow-sm
                "
              >

                <div
                  className="
                    overflow-x-auto
                  "
                >

                  <table
                    className="
                      w-full
                      min-w-[1000px]
                      text-left
                    "
                  >

                    <thead>

                      <tr
                        className="
                          border-b
                          border-border
                          bg-secondary/40
                          text-xs
                          uppercase
                          text-muted-foreground
                        "
                      >

                        <th className="px-5 py-4">
                          Aluno
                        </th>

                        <th className="px-5 py-4">
                          Matrícula
                        </th>

                        <th className="px-5 py-4">
                          Disciplina
                        </th>

                        <th className="px-5 py-4">
                          Turma
                        </th>

                        <th className="px-5 py-4">
                          Data
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right">
                          Ações
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {
                        matriculas.map(
                          matricula => (

                            <tr
                              key={
                                matricula.idMatricula
                              }

                              className="
                                border-b
                                border-border/70
                                last:border-0
                                hover:bg-secondary/20
                              "
                            >

                              <td
                                className="
                                  px-5
                                  py-4
                                  font-medium
                                "
                              >
                                {
                                  matricula.nomeAluno
                                }
                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                  text-sm
                                  text-muted-foreground
                                "
                              >
                                {
                                  matricula.numeroMatricula
                                }
                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                  text-sm
                                "
                              >

                                <div>

                                  {
                                    matricula.nomeDisciplina
                                  }

                                </div>


                                <div
                                  className="
                                    mt-1
                                    text-xs
                                    text-muted-foreground
                                  "
                                >
                                  {
                                    matricula.codDisciplina
                                  }
                                </div>

                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                  text-sm
                                  text-muted-foreground
                                "
                              >

                                {
                                  matricula.localTurma
                                }

                                {' — '}

                                {
                                  nomesTurno[
                                    matricula.turnoTurma
                                  ] ||
                                  matricula.turnoTurma
                                }

                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                  text-sm
                                  text-muted-foreground
                                "
                              >
                                {
                                  formatarData(
                                    matricula.dataMatricula
                                  )
                                }
                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                "
                              >

                                <span
                                  className="
                                    inline-flex
                                    rounded-full
                                    border
                                    border-border
                                    bg-secondary
                                    px-3
                                    py-1
                                    text-xs
                                  "
                                >
                                  {
                                    nomesStatus[
                                      matricula.statusMatricula
                                    ] ||
                                    matricula.statusMatricula
                                  }
                                </span>

                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                "
                              >

                                <div
                                  className="
                                    flex
                                    justify-end
                                    gap-2
                                  "
                                >

                                  <button
                                    type="button"

                                    onClick={() =>
                                      editar(
                                        matricula
                                      )
                                    }

                                    className="
                                      rounded-md
                                      border
                                      border-border
                                      px-3
                                      py-2
                                      text-sm
                                      hover:bg-secondary
                                    "
                                  >
                                    Editar
                                  </button>


                                  <button
                                    type="button"

                                    onClick={() => {

                                      setMatriculaParaExcluir(
                                        matricula
                                      )

                                      setErro('')

                                    }}

                                    className="
                                      rounded-md
                                      border
                                      border-destructive/30
                                      px-3
                                      py-2
                                      text-sm
                                      text-destructive
                                      hover:bg-destructive/10
                                    "
                                  >
                                    Excluir
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )
                      }

                    </tbody>

                  </table>

                </div>

              </div>

            )
          }

        </section>

      </div>


      {/* ==============================================
          MODAL EXCLUSÃO
      ============================================== */}

      {
        matriculaParaExcluir && (

          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/70
              p-4
            "
          >

            <div
              className="
                w-full
                max-w-md
                rounded-xl
                border
                border-border
                bg-card
                p-6
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Excluir matrícula?
              </h2>


              <p
                className="
                  mt-3
                  text-sm
                  text-muted-foreground
                "
              >

                Remover a matrícula de

                {' '}

                <strong
                  className="
                    text-foreground
                  "
                >
                  {
                    matriculaParaExcluir.nomeAluno
                  }
                </strong>

                {' '}

                na disciplina

                {' '}

                <strong
                  className="
                    text-foreground
                  "
                >
                  {
                    matriculaParaExcluir.nomeDisciplina
                  }
                </strong>

                ?

              </p>


              {
                erro && (

                  <p
                    className="
                      mt-4
                      rounded-md
                      border
                      border-destructive/30
                      bg-destructive/10
                      p-3
                      text-sm
                      text-destructive
                    "
                  >
                    {erro}
                  </p>

                )
              }


              <div
                className="
                  mt-6
                  flex
                  justify-end
                  gap-3
                "
              >

                <button
                  type="button"

                  onClick={() => {

                    setMatriculaParaExcluir(
                      null
                    )

                    setErro('')

                  }}

                  className="
                    botao-secundario
                  "
                >
                  Cancelar
                </button>


                <button
                  type="button"

                  onClick={
                    confirmarExclusao
                  }

                  disabled={
                    salvando
                  }

                  className="
                    botao-perigo
                  "
                >
                  {
                    salvando
                      ? 'Excluindo...'
                      : 'Excluir'
                  }
                </button>

              </div>

            </div>

          </div>

        )
      }


      {/* ==============================================
          TOAST
      ============================================== */}

      {
        mensagem && (

          <div
            className="
              fixed
              bottom-5
              right-5
              z-50
              rounded-md
              border
              border-primary/30
              bg-card
              px-4
              py-3
              text-sm
              shadow-xl
            "

            style={{
              borderLeftWidth:
                '4px',

              borderLeftColor:
                'var(--color-primary)'
            }}
          >
            {mensagem}
          </div>

        )
      }

    </div>

  )

}


function Campo({
  titulo,
  children,
  obrigatorio = true
}) {

  return (

    <label
      className="
        block
      "
    >

      <span
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >

        {titulo}

        {
          obrigatorio &&
          ' *'
        }

      </span>


      {children}

    </label>

  )

}


function Estado({
  texto
}) {

  return (

    <div
      className="
        flex
        min-h-56
        items-center
        justify-center
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        text-center
        text-sm
        text-muted-foreground
      "
    >
      {texto}
    </div>

  )

}


export default MatriculasFormPage