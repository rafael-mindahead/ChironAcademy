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
  Clock,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UsersRound
} from 'lucide-react'

import {
  buscarMinhaTurma
} from '../../services/professorServices/turmasProfessorService.js'

import {
  atualizarAvaliacao,
  criarAvaliacao,
  excluirAvaliacao,
  listarAvaliacoes
} from '../../services/professorServices/avaliacaoProfessorService.js'


const nomesTurno = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite'
}


const nomesStatus = {
  CURSANDO: 'Cursando',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  TRANCADO: 'Trancado',
  JUSTIFICADO: 'Justificado'
}


const formularioVazio = {
  titulo: '',
  descricao: '',
  dataAvaliacao: '',
  valorMaximo: '10'
}


function TurmaProfessorPage() {

  const {
    idProfessorTurma
  } =
    useParams()


  const navigate =
    useNavigate()


  const [
    turma,
    setTurma
  ] =
    useState(null)


  const [
    professor,
    setProfessor
  ] =
    useState(null)


  const [
    alunos,
    setAlunos
  ] =
    useState([])


  const [
    avaliacoes,
    setAvaliacoes
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
    avaliacaoEmEdicao,
    setAvaliacaoEmEdicao
  ] =
    useState(null)


  const [
    avaliacaoParaExcluir,
    setAvaliacaoParaExcluir
  ] =
    useState(null)


  const [
    estado,
    setEstado
  ] =
    useState('carregando')


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
  // CARREGAR
  // ====================================================

  useEffect(
    () => {

      carregar()

    },

    [
      idProfessorTurma
    ]
  )


  async function carregar() {

    try {

      setEstado(
        'carregando'
      )

      setErro('')


      const [
        dadosTurma,
        dadosAvaliacoes
      ] =
        await Promise.all([

          buscarMinhaTurma(
            idProfessorTurma
          ),

          listarAvaliacoes(
            idProfessorTurma
          )

        ])


      setProfessor(
        dadosTurma.professor
      )


      setTurma(
        dadosTurma.turma
      )


      setAlunos(
        dadosTurma.alunos ||
        []
      )


      setAvaliacoes(
        dadosAvaliacoes
      )


      setEstado(
        'sucesso'
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar a turma.'
      )


      setEstado(
        'erro'
      )

    }

  }


  // ====================================================
  // TOAST
  // ====================================================

  function toast(texto) {

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
  // FORMULÁRIO
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


  function limparFormulario() {

    setFormulario(
      formularioVazio
    )


    setAvaliacaoEmEdicao(
      null
    )


    setErro('')

  }


  function editarAvaliacao(
    avaliacao
  ) {

    setAvaliacaoEmEdicao(
      avaliacao
    )


    setFormulario({

      titulo:
        avaliacao.titulo,

      descricao:
        avaliacao.descricao ||
        '',

      dataAvaliacao:
        formatarDataInput(
          avaliacao.dataAvaliacao
        ),

      valorMaximo:
        String(
          avaliacao.valorMaximo
        )

    })


    setErro('')


    document
      .getElementById(
        'form-avaliacao'
      )
      ?.scrollIntoView({
        behavior:
          'smooth'
      })

  }


  // ====================================================
  // SALVAR AVALIAÇÃO
  // ====================================================

  async function salvarAvaliacao(
    event
  ) {

    event.preventDefault()


    setErro('')


    if (
      !formulario.titulo ||
      !formulario.dataAvaliacao ||
      !formulario.valorMaximo
    ) {

      setErro(
        'Título, data e valor máximo são obrigatórios.'
      )

      return
    }


    const dados = {

      titulo:
        formulario.titulo,

      descricao:
        formulario.descricao,

      dataAvaliacao:
        formulario.dataAvaliacao,

      valorMaximo:
        Number(
          formulario.valorMaximo
        )

    }


    try {

      setSalvando(
        true
      )


      if (
        avaliacaoEmEdicao
      ) {

        await atualizarAvaliacao(
          idProfessorTurma,
          avaliacaoEmEdicao.idAvaliacao,
          dados
        )


        toast(
          'Avaliação atualizada com sucesso.'
        )


      } else {

        await criarAvaliacao(
          idProfessorTurma,
          dados
        )


        toast(
          'Avaliação criada com sucesso.'
        )

      }


      limparFormulario()


      const lista =
        await listarAvaliacoes(
          idProfessorTurma
        )


      setAvaliacoes(
        lista
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível salvar a avaliação.'
      )


    } finally {

      setSalvando(
        false
      )

    }

  }


  // ====================================================
  // EXCLUIR
  // ====================================================

  async function confirmarExclusao() {

    if (
      !avaliacaoParaExcluir
    ) {
      return
    }


    try {

      setSalvando(
        true
      )

      setErro('')


      await excluirAvaliacao(
        idProfessorTurma,
        avaliacaoParaExcluir.idAvaliacao
      )


      setAvaliacaoParaExcluir(
        null
      )


      toast(
        'Avaliação excluída com sucesso.'
      )


      const lista =
        await listarAvaliacoes(
          idProfessorTurma
        )


      setAvaliacoes(
        lista
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível excluir a avaliação.'
      )


    } finally {

      setSalvando(
        false
      )

    }

  }


  // ====================================================
  // FORMATAÇÕES
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


  function formatarDataInput(
    data
  ) {

    if (!data) {
      return ''
    }


    return String(data)
      .slice(
        0,
        10
      )

  }


  function formatarValor(
    valor
  ) {

    return Number(
      valor || 0
    )
      .toFixed(2)
      .replace(
        '.',
        ','
      )

  }


  // ====================================================
  // ESTADOS
  // ====================================================

  if (
    estado ===
    'carregando'
  ) {

    return (

      <EstadoCentral
        texto="Carregando turma..."
      />

    )

  }


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
              text-sm
              text-destructive
            "
          >
            {erro}
          </p>


          <button
            type="button"

            onClick={() =>
              navigate(
                '/sistema/professor'
              )
            }

            className="
              botao-principal
              mt-5
            "
          >
            Voltar para minhas turmas
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

        {/* ==============================================
            VOLTAR
        ============================================== */}

        <button
          type="button"

          onClick={() =>
            navigate(
              '/sistema/professor'
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

          Minhas turmas

        </button>


        {/* ==============================================
            DADOS DA TURMA
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
              md:flex-row
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-primary
                "
              >
                {
                  turma.nomeCurso
                }
              </p>


              <h1
                className="
                  mt-2
                  font-[family-name:var(--font-display)]
                  text-3xl
                "
              >
                {
                  turma.nomeDisciplina
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
                  turma.codDisciplina
                }

                {' • '}

                {
                  turma.nomePeriodo
                }
              </p>

            </div>


            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-5
                py-4
                text-sm
              "
            >

              <p
                className="
                  text-muted-foreground
                "
              >
                Professor responsável
              </p>


              <p
                className="
                  mt-1
                  font-medium
                "
              >
                {
                  professor?.nome
                }
              </p>

            </div>

          </div>


          <div
            className="
              mt-8
              grid
              gap-4
              border-t
              border-border
              pt-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            <Info
              icon={
                <MapPin />
              }

              titulo="Local"

              valor={
                turma.localTurma
              }
            />


            <Info
              icon={
                <Clock />
              }

              titulo="Turno"

              valor={
                nomesTurno[
                  turma.turnoTurma
                ] ||
                turma.turnoTurma
              }
            />


            <Info
              icon={
                <BookOpen />
              }

              titulo="Carga horária"

              valor={
                `${turma.cargaHoraria}h`
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

        </section>


        {/* ==============================================
            AVALIAÇÕES
        ============================================== */}

        <section
          id="form-avaliacao"
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
              Avaliações
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastre e gerencie as avaliações desta turma.
            </p>

          </div>


          {/* FORM */}

          <div
            className="
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
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-primary/10
                  text-primary
                "
              >

                {
                  avaliacaoEmEdicao
                    ? (
                      <Pencil
                        className="
                          size-5
                        "
                      />
                    )
                    : (
                      <Plus
                        className="
                          size-5
                        "
                      />
                    )
                }

              </div>


              <div>

                <h3
                  className="
                    font-semibold
                  "
                >
                  {
                    avaliacaoEmEdicao
                      ? 'Editar avaliação'
                      : 'Nova avaliação'
                  }
                </h3>


                <p
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  {
                    avaliacaoEmEdicao
                      ? 'Altere os dados e salve.'
                      : 'Cadastre uma nova atividade avaliativa.'
                  }
                </p>

              </div>

            </div>


            <form
              onSubmit={
                salvarAvaliacao
              }

              className="
                space-y-5
              "
            >

              <div
                className="
                  grid
                  gap-5
                  md:grid-cols-2
                "
              >

                <Campo
                  titulo="Título"
                >

                  <input
                    required

                    maxLength={
                      150
                    }

                    value={
                      formulario.titulo
                    }

                    onChange={
                      event =>
                        campo(
                          'titulo',
                          event.target.value
                        )
                    }

                    className="campo"

                    placeholder="Ex.: Prova 1"
                  />

                </Campo>


                <Campo
                  titulo="Data da avaliação"
                >

                  <input
                    required

                    type="date"

                    value={
                      formulario.dataAvaliacao
                    }

                    onChange={
                      event =>
                        campo(
                          'dataAvaliacao',
                          event.target.value
                        )
                    }

                    className="campo"
                  />

                </Campo>


                <Campo
                  titulo="Valor máximo"
                >

                  <input
                    required

                    type="number"

                    min="0.01"

                    max="999.99"

                    step="0.01"

                    value={
                      formulario.valorMaximo
                    }

                    onChange={
                      event =>
                        campo(
                          'valorMaximo',
                          event.target.value
                        )
                    }

                    className="campo"
                  />

                </Campo>


                <div
                  className="
                    md:col-span-2
                  "
                >

                  <Campo
                    titulo="Descrição"
                    obrigatorio={
                      false
                    }
                  >

                    <textarea
                      maxLength={
                        500
                      }

                      rows={
                        4
                      }

                      value={
                        formulario.descricao
                      }

                      onChange={
                        event =>
                          campo(
                            'descricao',
                            event.target.value
                          )
                      }

                      className="
                        campo
                        resize-none
                      "

                      placeholder="Ex.: Avaliação referente aos conteúdos das unidades 1 e 2."
                    />

                  </Campo>

                </div>

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
                  avaliacaoEmEdicao && (

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
                      : avaliacaoEmEdicao
                        ? 'Atualizar avaliação'
                        : 'Cadastrar avaliação'
                  }
                </button>

              </div>

            </form>

          </div>


          {/* LISTA */}

          <div
            className="
              mt-6
            "
          >

            <div
              className="
                mb-4
              "
            >

              <h3
                className="
                  font-semibold
                "
              >
                Avaliações cadastradas
              </h3>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  avaliacoes.length
                } registro(s)
              </p>

            </div>


            {
              avaliacoes.length === 0
                ? (

                  <div
                    className="
                      flex
                      min-h-48
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-dashed
                      border-border
                      bg-card
                      p-6
                      text-center
                    "
                  >

                    <CalendarDays
                      className="
                        mb-3
                        size-8
                        text-muted-foreground
                      "
                    />


                    <p
                      className="
                        text-sm
                        text-muted-foreground
                      "
                    >
                      Nenhuma avaliação cadastrada.
                    </p>

                  </div>

                )
                : (

                  <div
                    className="
                      grid
                      gap-4
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >

                    {
                      avaliacoes.map(
                        avaliacao => (

                          <article
                            key={
                              avaliacao.idAvaliacao
                            }

                            className="
                              rounded-2xl
                              border
                              border-border
                              bg-card
                              p-5
                              shadow-sm
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-primary
                                  "
                                >
                                  Avaliação
                                </p>


                                <h4
                                  className="
                                    mt-1
                                    text-lg
                                    font-semibold
                                  "
                                >
                                  {
                                    avaliacao.titulo
                                  }
                                </h4>

                              </div>


                              <span
                                className="
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
                                  formatarValor(
                                    avaliacao.valorMaximo
                                  )
                                } pts
                              </span>

                            </div>


                            <div
                              className="
                                mt-4
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-muted-foreground
                              "
                            >

                              <CalendarDays
                                className="
                                  size-4
                                "
                              />

                              {
                                formatarData(
                                  avaliacao.dataAvaliacao
                                )
                              }

                            </div>


                            {
                              avaliacao.descricao && (

                                <p
                                  className="
                                    mt-4
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


                            <div
                              className="
                                mt-5
                                flex
                                justify-end
                                gap-2
                                border-t
                                border-border
                                pt-4
                              "
                            >

                              <button
                                type="button"

                                onClick={() =>
                                  editarAvaliacao(
                                    avaliacao
                                  )
                                }

                                className="
                                  flex
                                  items-center
                                  gap-2
                                  rounded-md
                                  border
                                  border-border
                                  px-3
                                  py-2
                                  text-sm
                                  hover:bg-secondary
                                "
                              >

                                <Pencil
                                  className="
                                    size-4
                                  "
                                />

                                Editar

                              </button>


                              <button
                                type="button"

                                onClick={() => {

                                  setAvaliacaoParaExcluir(
                                    avaliacao
                                  )

                                  setErro('')

                                }}

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

                                Excluir

                              </button>

                            </div>

                          </article>

                        )
                      )
                    }

                  </div>

                )
            }

          </div>

        </section>


        {/* ==============================================
            ALUNOS
        ============================================== */}

        <section
          className="
            mt-10
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
              Alunos matriculados
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {
                alunos.length
              } registro(s) encontrado(s)
            </p>

          </div>


          {
            alunos.length === 0
              ? (

                <div
                  className="
                    flex
                    min-h-56
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-border
                    bg-card
                    p-6
                    text-center
                  "
                >

                  <GraduationCap
                    className="
                      mb-3
                      size-8
                      text-muted-foreground
                    "
                  />


                  <p
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Nenhum aluno matriculado nesta turma e disciplina.
                  </p>

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
                        min-w-[750px]
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
                            E-mail
                          </th>

                          <th className="px-5 py-4">
                            Status
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {
                          alunos.map(
                            aluno => (

                              <tr
                                key={
                                  aluno.idMatricula
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
                                    aluno.nome
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
                                    aluno.numeroMatricula
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
                                    aluno.email
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
                                        aluno.statusMatricula
                                      ] ||
                                      aluno.statusMatricula
                                    }
                                  </span>

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
          MODAL EXCLUIR
      ============================================== */}

      {
        avaliacaoParaExcluir && (

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
                Excluir avaliação?
              </h2>


              <p
                className="
                  mt-3
                  text-sm
                  text-muted-foreground
                "
              >
                Tem certeza de que deseja excluir

                {' '}

                <strong
                  className="
                    text-foreground
                  "
                >
                  {
                    avaliacaoParaExcluir.titulo
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

                    setAvaliacaoParaExcluir(
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


function Info({
  icon,
  titulo,
  valor
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <div
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-lg
          bg-primary/10
          text-primary
          [&>svg]:size-5
        "
      >
        {icon}
      </div>


      <div>

        <p
          className="
            text-xs
            text-muted-foreground
          "
        >
          {titulo}
        </p>


        <p
          className="
            mt-1
            text-sm
            font-medium
          "
        >
          {valor}
        </p>

      </div>

    </div>

  )

}


function EstadoCentral({
  texto
}) {

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
      {texto}
    </div>

  )

}


export default TurmaProfessorPage