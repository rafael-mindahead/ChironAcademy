import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCheck,
  Save,
  Trash2,
  UsersRound
} from 'lucide-react'

import {
  excluirFrequencia,
  listarFrequencias,
  registrarFrequencia
} from '../../services/professorServices/frequenciaProfessorService.js'


const nomesStatus = {
  PRESENTE: 'Presente',
  FALTA: 'Falta',
  JUSTIFICADA: 'Justificada'
}


function ChamadaFrequenciaPage() {

  const {
    idProfessorTurma,
    idAula
  } =
    useParams()


  const navigate =
    useNavigate()


  const [
    professor,
    setProfessor
  ] =
    useState(null)


  const [
    turma,
    setTurma
  ] =
    useState(null)


  const [
    aula,
    setAula
  ] =
    useState(null)


  const [
    alunos,
    setAlunos
  ] =
    useState([])


  const [
    formularios,
    setFormularios
  ] =
    useState({})


  const [
    estado,
    setEstado
  ] =
    useState('carregando')


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


  const [
    salvandoId,
    setSalvandoId
  ] =
    useState(null)


  const [
    salvandoTodos,
    setSalvandoTodos
  ] =
    useState(false)


  // ====================================================
  // CARREGAR
  // ====================================================

  useEffect(
    () => {

      carregar()

    },
    [
      idProfessorTurma,
      idAula
    ]
  )


  async function carregar(
    mostrarLoading = true
  ) {

    try {

      if (
        mostrarLoading
      ) {

        setEstado(
          'carregando'
        )

      }


      setErro('')


      const dados =
        await listarFrequencias(
          idProfessorTurma,
          idAula
        )


      setProfessor(
        dados.professor
      )


      setTurma(
        dados.turma
      )


      setAula(
        dados.aula
      )


      const lista =
        dados.alunos ||
        []


      setAlunos(
        lista
      )


      const novosFormularios = {}


      lista.forEach(
        aluno => {

          novosFormularios[
            aluno.idMatricula
          ] = {

            statusFrequencia:
              aluno.statusFrequencia ||
              'PRESENTE',

            observacao:
              aluno.observacao ||
              ''

          }

        }
      )


      setFormularios(
        novosFormularios
      )


      setEstado(
        'sucesso'
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar a chamada.'
      )


      setEstado(
        'erro'
      )

    }

  }


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

  function alterarCampo(
    idMatricula,
    campo,
    valor
  ) {

    setFormularios(
      atual => ({

        ...atual,

        [idMatricula]: {

          ...atual[
            idMatricula
          ],

          [campo]:
            valor

        }

      })
    )

  }


  // ====================================================
  // MARCAR TODOS PRESENTES
  // ====================================================

  function marcarTodosPresentes() {

    const novos =
      { ...formularios }


    alunos.forEach(
      aluno => {

        novos[
          aluno.idMatricula
        ] = {

          ...novos[
            aluno.idMatricula
          ],

          statusFrequencia:
            'PRESENTE'

        }

      }
    )


    setFormularios(
      novos
    )

  }


  // ====================================================
  // SALVAR INDIVIDUAL
  // ====================================================

  async function salvarAluno(
    aluno
  ) {

    const formulario =
      formularios[
        aluno.idMatricula
      ]


    if (
      !formulario
        ?.statusFrequencia
    ) {

      setErro(
        `Selecione a frequência de ${aluno.nome}.`
      )

      return

    }


    try {

      setSalvandoId(
        aluno.idMatricula
      )

      setErro('')


      await registrarFrequencia(
        idProfessorTurma,
        idAula,
        aluno.idMatricula,
        {
          statusFrequencia:
            formulario.statusFrequencia,

          observacao:
            formulario.observacao
        }
      )


      toast(
        `Frequência de ${aluno.nome} salva.`
      )


      await carregar(
        false
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível registrar a frequência.'
      )


    } finally {

      setSalvandoId(
        null
      )

    }

  }


  // ====================================================
  // SALVAR CHAMADA INTEIRA
  // ====================================================

  async function salvarTodos() {

    if (
      alunos.length === 0
    ) {

      return

    }


    try {

      setSalvandoTodos(
        true
      )

      setErro('')


      await Promise.all(
        alunos.map(
          aluno => {

            const formulario =
              formularios[
                aluno.idMatricula
              ]


            return registrarFrequencia(
              idProfessorTurma,
              idAula,
              aluno.idMatricula,
              {
                statusFrequencia:
                  formulario
                    ?.statusFrequencia ||
                  'PRESENTE',

                observacao:
                  formulario
                    ?.observacao ||
                  ''
              }
            )

          }
        )
      )


      toast(
        'Chamada salva com sucesso.'
      )


      await carregar(
        false
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível salvar a chamada.'
      )


    } finally {

      setSalvandoTodos(
        false
      )

    }

  }


  // ====================================================
  // REMOVER
  // ====================================================

  async function removerFrequencia(
    aluno
  ) {

    const confirmar =
      window.confirm(
        `Remover a frequência registrada de ${aluno.nome}?`
      )


    if (
      !confirmar
    ) {

      return

    }


    try {

      setSalvandoId(
        aluno.idMatricula
      )

      setErro('')


      await excluirFrequencia(
        idProfessorTurma,
        idAula,
        aluno.idMatricula
      )


      toast(
        `Frequência de ${aluno.nome} removida.`
      )


      await carregar(
        false
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível remover a frequência.'
      )


    } finally {

      setSalvandoId(
        null
      )

    }

  }


  // ====================================================
  // DATA
  // ====================================================

  function formatarData(
    data
  ) {

    if (
      !data
    ) {

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


    return (
      `${dia}/${mes}/${ano}`
    )

  }


  // ====================================================
  // LOADING
  // ====================================================

  if (
    estado ===
    'carregando'
  ) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          text-sm
          text-muted-foreground
        "
      >
        Carregando chamada...
      </div>

    )

  }


  // ====================================================
  // ERRO GERAL
  // ====================================================

  if (
    estado ===
    'erro'
  ) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          px-6
          text-center
        "
      >

        <div>

          <p
            className="
              text-destructive
            "
          >
            {erro}
          </p>


          <button
            type="button"

            onClick={() =>
              navigate(
                `/sistema/professor/turmas/${idProfessorTurma}/frequencia`
              )
            }

            className="
              botao-principal
              mt-5
            "
          >
            Voltar
          </button>

        </div>

      </div>

    )

  }


  // ====================================================
  // CONTADORES
  // ====================================================

  const presentes =
    Object
      .values(
        formularios
      )
      .filter(
        item =>
          item.statusFrequencia ===
          'PRESENTE'
      )
      .length


  const faltas =
    Object
      .values(
        formularios
      )
      .filter(
        item =>
          item.statusFrequencia ===
          'FALTA'
      )
      .length


  const justificadas =
    Object
      .values(
        formularios
      )
      .filter(
        item =>
          item.statusFrequencia ===
          'JUSTIFICADA'
      )
      .length


  return (

    <div
      className="
        min-h-screen
        bg-background
        px-6
        py-10
        text-foreground
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
            VOLTAR
        ============================================== */}

        <button
          type="button"

          onClick={() =>
            navigate(
              `/sistema/professor/turmas/${idProfessorTurma}/frequencia`
            )
          }

          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
            hover:text-foreground
          "
        >

          <ArrowLeft
            className="
              size-4
            "
          />

          Voltar para aulas

        </button>


        {/* ==============================================
            CABEÇALHO
        ============================================== */}

        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div
            className="
              flex
              flex-col
              justify-between
              gap-6
              lg:flex-row
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-primary
                "
              >
                Registro de frequência
              </p>


              <h1
                className="
                  mt-2
                  font-[family-name:var(--font-display)]
                  text-3xl
                "
              >
                Chamada
              </h1>


              <p
                className="
                  mt-2
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  turma?.nomeDisciplina
                }

                {' • '}

                {
                  turma?.nomeCurso
                }
              </p>


              {
                aula?.conteudo && (

                  <p
                    className="
                      mt-4
                      max-w-2xl
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    {
                      aula.conteudo
                    }
                  </p>

                )
              }

            </div>


            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <Info
                icon={
                  <CalendarDays />
                }

                titulo="Data"

                valor={
                  formatarData(
                    aula?.dataAula
                  )
                }
              />


              <Info
                icon={
                  <UsersRound />
                }

                titulo="Alunos"

                valor={
                  alunos.length
                }
              />

            </div>

          </div>


          <div
            className="
              mt-6
              border-t
              border-border
              pt-5
              text-sm
              text-muted-foreground
            "
          >

            Professor responsável:

            {' '}

            <span
              className="
                font-medium
                text-foreground
              "
            >
              {
                professor?.nome
              }
            </span>

          </div>

        </section>


        {/* ==============================================
            RESUMO
        ============================================== */}

        <section
          className="
            mt-6
            grid
            gap-4
            sm:grid-cols-3
          "
        >

          <Resumo
            titulo="Presentes"
            valor={
              presentes
            }
          />


          <Resumo
            titulo="Faltas"
            valor={
              faltas
            }
          />


          <Resumo
            titulo="Justificadas"
            valor={
              justificadas
            }
          />

        </section>


        {/* ==============================================
            AÇÕES
        ============================================== */}

        <div
          className="
            mt-8
            flex
            flex-col
            justify-between
            gap-3
            sm:flex-row
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Alunos
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Registre a presença de cada aluno.
            </p>

          </div>


          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >

            <button
              type="button"

              onClick={
                marcarTodosPresentes
              }

              className="
                flex
                items-center
                gap-2
                rounded-md
                border
                border-border
                px-4
                py-2
                text-sm
                hover:bg-secondary
              "
            >

              <CheckCheck
                className="
                  size-4
                "
              />

              Todos presentes

            </button>


            <button
              type="button"

              onClick={
                salvarTodos
              }

              disabled={
                salvandoTodos ||
                alunos.length === 0
              }

              className="
                botao-principal
                flex
                items-center
                gap-2
              "
            >

              <Save
                className="
                  size-4
                "
              />

              {
                salvandoTodos
                  ? 'Salvando...'
                  : 'Salvar chamada'
              }

            </button>

          </div>

        </div>


        {/* ==============================================
            ERRO
        ============================================== */}

        {
          erro && (

            <div
              className="
                mt-5
                rounded-md
                border
                border-destructive/30
                bg-destructive/10
                p-4
                text-sm
                text-destructive
              "
            >
              {erro}
            </div>

          )
        }


        {/* ==============================================
            LISTA
        ============================================== */}

        <section
          className="
            mt-5
          "
        >

          {
            alunos.length === 0
              ? (

                <div
                  className="
                    flex
                    min-h-56
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-border
                    bg-card
                    text-sm
                    text-muted-foreground
                  "
                >
                  Nenhum aluno matriculado nesta turma.
                </div>

              )
              : (

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
                        min-w-[1050px]
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
                            Frequência
                          </th>

                          <th className="px-5 py-4">
                            Observação
                          </th>

                          <th className="px-5 py-4">
                            Registro
                          </th>

                          <th className="px-5 py-4 text-right">
                            Ações
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {
                          alunos.map(
                            aluno => {

                              const formulario =
                                formularios[
                                  aluno.idMatricula
                                ] || {
                                  statusFrequencia:
                                    'PRESENTE',

                                  observacao:
                                    ''
                                }


                              const possuiRegistro =
                                aluno.idFrequencia !==
                                  null &&
                                aluno.idFrequencia !==
                                  undefined


                              const salvando =
                                salvandoId ===
                                aluno.idMatricula


                              return (

                                <tr
                                  key={
                                    aluno.idMatricula
                                  }

                                  className="
                                    border-b
                                    border-border/70
                                    last:border-0
                                  "
                                >

                                  {/* ALUNO */}

                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    <p
                                      className="
                                        font-medium
                                      "
                                    >
                                      {
                                        aluno.nome
                                      }
                                    </p>


                                    <p
                                      className="
                                        mt-1
                                        text-xs
                                        text-muted-foreground
                                      "
                                    >
                                      {
                                        aluno.email
                                      }
                                    </p>

                                  </td>


                                  {/* MATRÍCULA */}

                                  <td
                                    className="
                                      px-5
                                      py-4
                                      text-sm
                                      text-muted-foreground
                                    "
                                  >
                                    {
                                      aluno.numeroMatricula
                                    }
                                  </td>


                                  {/* STATUS */}

                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    <select
                                      value={
                                        formulario.statusFrequencia
                                      }

                                      onChange={
                                        event =>
                                          alterarCampo(
                                            aluno.idMatricula,
                                            'statusFrequencia',
                                            event.target.value
                                          )
                                      }

                                      className="
                                        campo
                                        min-w-[150px]
                                      "
                                    >

                                      <option value="PRESENTE">
                                        Presente
                                      </option>

                                      <option value="FALTA">
                                        Falta
                                      </option>

                                      <option value="JUSTIFICADA">
                                        Justificada
                                      </option>

                                    </select>

                                  </td>


                                  {/* OBSERVAÇÃO */}

                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    <input
                                      value={
                                        formulario.observacao
                                      }

                                      onChange={
                                        event =>
                                          alterarCampo(
                                            aluno.idMatricula,
                                            'observacao',
                                            event.target.value
                                          )
                                      }

                                      maxLength={
                                        500
                                      }

                                      className="
                                        campo
                                        min-w-[250px]
                                      "

                                      placeholder="Opcional"
                                    />

                                  </td>


                                  {/* REGISTRO */}

                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    {
                                      possuiRegistro
                                        ? (

                                          <span
                                            className="
                                              inline-flex
                                              items-center
                                              gap-1
                                              rounded-full
                                              border
                                              border-primary/30
                                              bg-primary/10
                                              px-3
                                              py-1
                                              text-xs
                                              text-primary
                                            "
                                          >

                                            <Check
                                              className="
                                                size-3
                                              "
                                            />

                                            {
                                              nomesStatus[
                                                aluno.statusFrequencia
                                              ] ||
                                              'Registrada'
                                            }

                                          </span>

                                        )
                                        : (

                                          <span
                                            className="
                                              rounded-full
                                              border
                                              border-border
                                              bg-secondary
                                              px-3
                                              py-1
                                              text-xs
                                              text-muted-foreground
                                            "
                                          >
                                            Pendente
                                          </span>

                                        )
                                    }

                                  </td>


                                  {/* AÇÕES */}

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
                                          salvarAluno(
                                            aluno
                                          )
                                        }

                                        disabled={
                                          salvando
                                        }

                                        className="
                                          flex
                                          items-center
                                          gap-2
                                          rounded-md
                                          border
                                          border-primary/30
                                          px-3
                                          py-2
                                          text-sm
                                          text-primary
                                          hover:bg-primary/10
                                        "
                                      >

                                        <Save
                                          className="
                                            size-4
                                          "
                                        />

                                        {
                                          salvando
                                            ? 'Salvando...'
                                            : possuiRegistro
                                              ? 'Atualizar'
                                              : 'Salvar'
                                        }

                                      </button>


                                      {
                                        possuiRegistro && (

                                          <button
                                            type="button"

                                            onClick={() =>
                                              removerFrequencia(
                                                aluno
                                              )
                                            }

                                            disabled={
                                              salvando
                                            }

                                            className="
                                              flex
                                              items-center
                                              gap-2
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

                                            <Trash2
                                              className="
                                                size-4
                                              "
                                            />

                                            Remover

                                          </button>

                                        )
                                      }

                                    </div>

                                  </td>

                                </tr>

                              )

                            }
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


function Info({
  icon,
  titulo,
  valor
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-border
        bg-background
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-primary
          [&>svg]:size-4
        "
      >

        {icon}


        <span
          className="
            text-xs
            text-muted-foreground
          "
        >
          {titulo}
        </span>

      </div>


      <p
        className="
          mt-2
          font-medium
        "
      >
        {valor}
      </p>

    </div>

  )

}


function Resumo({
  titulo,
  valor
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-border
        bg-card
        p-5
      "
    >

      <p
        className="
          text-2xl
          font-semibold
        "
      >
        {valor}
      </p>


      <p
        className="
          mt-1
          text-sm
          text-muted-foreground
        "
      >
        {titulo}
      </p>

    </div>

  )

}


export default ChamadaFrequenciaPage