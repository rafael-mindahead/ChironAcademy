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
  BookOpen,
  CalendarDays,
  Check,
  Save,
  Trash2,
  UsersRound
} from 'lucide-react'

import {
  excluirNota,
  listarNotas,
  registrarNota
} from '../../services/professorServices/notaProfessorService.js'


function NotasProfessorPage() {

  const {
    idProfessorTurma,
    idAvaliacao
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
    avaliacao,
    setAvaliacao
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


  // ====================================================
  // CARREGAR
  // ====================================================

  useEffect(
    () => {

      carregar()

    },
    [
      idProfessorTurma,
      idAvaliacao
    ]
  )


  async function carregar(
    mostrarLoading = true
  ) {

    try {

      if (mostrarLoading) {

        setEstado(
          'carregando'
        )

      }


      setErro('')


      const dados =
        await listarNotas(
          idProfessorTurma,
          idAvaliacao
        )


      setProfessor(
        dados.professor
      )


      setTurma(
        dados.turma
      )


      setAvaliacao(
        dados.avaliacao
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

            valor:
              aluno.valor === null ||
              aluno.valor === undefined
                ? ''
                : String(
                    aluno.valor
                  ),

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
        'Não foi possível carregar as notas.'
      )


      setEstado(
        'erro'
      )

    }

  }


  // ====================================================
  // CAMPO
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
  // SALVAR NOTA
  // ====================================================

  async function salvarNota(
    aluno
  ) {

    const formulario =
      formularios[
        aluno.idMatricula
      ]


    if (
      !formulario ||
      formulario.valor === ''
    ) {

      setErro(
        `Informe a nota de ${aluno.nome}.`
      )

      return

    }


    const valor =
      Number(
        formulario.valor
      )


    const valorMaximo =
      Number(
        avaliacao.valorMaximo
      )


    if (
      !Number.isFinite(
        valor
      ) ||
      valor < 0
    ) {

      setErro(
        'A nota deve ser maior ou igual a zero.'
      )

      return

    }


    if (
      valor >
      valorMaximo
    ) {

      setErro(
        `A nota não pode ultrapassar ${valorMaximo}.`
      )

      return

    }


    try {

      setSalvandoId(
        aluno.idMatricula
      )


      setErro('')


      await registrarNota(
        idProfessorTurma,
        idAvaliacao,
        aluno.idMatricula,
        {
          valor,

          observacao:
            formulario.observacao
        }
      )


      toast(
        `Nota de ${aluno.nome} salva com sucesso.`
      )


      await carregar(
        false
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível registrar a nota.'
      )


    } finally {

      setSalvandoId(
        null
      )

    }

  }


  // ====================================================
  // REMOVER NOTA
  // ====================================================

  async function removerNota(
    aluno
  ) {

    const confirmar =
      window.confirm(
        `Remover a nota de ${aluno.nome}?`
      )


    if (!confirmar) {
      return
    }


    try {

      setSalvandoId(
        aluno.idMatricula
      )


      setErro('')


      await excluirNota(
        idProfessorTurma,
        idAvaliacao,
        aluno.idMatricula
      )


      toast(
        `Nota de ${aluno.nome} removida.`
      )


      await carregar(
        false
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível remover a nota.'
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
        Carregando diário de notas...
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
                `/sistema/professor/turmas/${idProfessorTurma}`
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

        {/* VOLTAR */}

        <button
          type="button"

          onClick={() =>
            navigate(
              `/sistema/professor/turmas/${idProfessorTurma}`
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

          Voltar para turma

        </button>


        {/* CABEÇALHO */}

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
                Diário de notas
              </p>


              <h1
                className="
                  mt-2
                  font-[family-name:var(--font-display)]
                  text-3xl
                "
              >
                {
                  avaliacao?.titulo
                }
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
                avaliacao?.descricao && (

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
                      avaliacao.descricao
                    }
                  </p>

                )
              }

            </div>


            <div
              className="
                grid
                gap-3
                sm:grid-cols-3
                lg:min-w-[440px]
              "
            >

              <Info
                icon={
                  <CalendarDays />
                }

                titulo="Data"

                valor={
                  formatarData(
                    avaliacao?.dataAvaliacao
                  )
                }
              />


              <Info
                icon={
                  <BookOpen />
                }

                titulo="Valor"

                valor={
                  `${avaliacao?.valorMaximo} pts`
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


        {/* ERRO */}

        {
          erro && (

            <div
              className="
                mt-6
                rounded-lg
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


        {/* TABELA */}

        <section
          className="
            mt-8
          "
        >

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
              Notas dos alunos
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Preencha ou altere a nota individualmente.
            </p>

          </div>


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
                            Nota
                          </th>

                          <th className="px-5 py-4">
                            Observação
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
                          alunos.map(
                            aluno => {

                              const formulario =
                                formularios[
                                  aluno.idMatricula
                                ] || {
                                  valor: '',
                                  observacao: ''
                                }


                              const possuiNota =
                                aluno.idNota !== null &&
                                aluno.idNota !== undefined


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


                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    <div
                                      className="
                                        flex
                                        items-center
                                        gap-2
                                      "
                                    >

                                      <input
                                        type="number"

                                        min="0"

                                        max={
                                          avaliacao?.valorMaximo
                                        }

                                        step="0.01"

                                        value={
                                          formulario.valor
                                        }

                                        onChange={
                                          event =>
                                            alterarCampo(
                                              aluno.idMatricula,
                                              'valor',
                                              event.target.value
                                            )
                                        }

                                        className="
                                          campo
                                          w-28
                                        "

                                        placeholder="0.00"
                                      />


                                      <span
                                        className="
                                          text-xs
                                          text-muted-foreground
                                        "
                                      >
                                        / {
                                          avaliacao?.valorMaximo
                                        }
                                      </span>

                                    </div>

                                  </td>


                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    <input
                                      maxLength={
                                        500
                                      }

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

                                      className="
                                        campo
                                        min-w-[240px]
                                      "

                                      placeholder="Opcional"
                                    />

                                  </td>


                                  <td
                                    className="
                                      px-5
                                      py-4
                                    "
                                  >

                                    {
                                      possuiNota
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

                                            Lançada

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
                                          salvarNota(
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
                                          disabled:opacity-50
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
                                            : possuiNota
                                              ? 'Atualizar'
                                              : 'Salvar'
                                        }

                                      </button>


                                      {
                                        possuiNota && (

                                          <button
                                            type="button"

                                            onClick={() =>
                                              removerNota(
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


export default NotasProfessorPage