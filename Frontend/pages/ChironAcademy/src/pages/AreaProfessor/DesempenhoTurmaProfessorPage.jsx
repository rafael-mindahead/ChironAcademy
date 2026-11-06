import {
  useEffect,
  useState
} from 'react'

import {
  ArrowLeft,
  BadgeAlert,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  Percent,
  TrendingUp,
  UserRound,
  XCircle
} from 'lucide-react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  listarDesempenhoTurma
} from '../../services/professorServices/desempenhoProfessorService.js'


function DesempenhoTurmaProfessorPage() {

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
    alunos,
    setAlunos
  ] =
    useState([])


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


  const alunosBaixoRendimento =
    alunos.filter(
      aluno =>
        aluno.rendimento?.baixoRendimento
    )

  const alunosComIndicadores =
    alunos.filter(
      aluno =>
        (
          aluno.rendimento?.percentualFrequencia !== null &&
          aluno.rendimento?.percentualFrequencia !== undefined
        ) ||
        aluno.rendimento?.notaFinalDisponivel ||
        aluno.rendimento?.abaixoNota === true
    )

  const alunosComDadosPendentes =
    alunos.filter(
      aluno =>
        !aluno.rendimento?.pesosConfigurados ||
        aluno.rendimento?.notasPendentes > 0 ||
        aluno.rendimento?.percentualFrequencia === null ||
        aluno.rendimento?.percentualFrequencia === undefined
    )


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


      const resposta =
        await listarDesempenhoTurma(
          idProfessorTurma
        )


      setTurma(
        resposta.turma
      )


      setAlunos(
        resposta.alunos ||
        []
      )


      setEstado(
        'sucesso'
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar o desempenho da turma.'
      )


      setEstado(
        'erro'
      )

    }

  }


  if (
    estado ===
    'carregando'
  ) {

    return (

      <EstadoCentral
        texto="Carregando desempenho da turma..."
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
          text-foreground
        "
      >

        <div
          className="
            max-w-md
            rounded-xl
            border
            border-border
            ${
              aluno.rendimento?.baixoRendimento
                ? 'border-destructive/50'
                : ''
            }
            bg-card
            p-8
          "
        >

          <CircleAlert
            className="
              mx-auto
              size-8
              text-destructive
            "
          />

          <h1
            className="
              mt-4
              text-xl
              font-semibold
            "
          >
            Não foi possível consultar a turma
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            {erro}
          </p>

          <button
            type="button"
            className="
              botao-secundario
              mt-6
            "
            onClick={
              () =>
                navigate(
                  '/sistema/professor'
                )
            }
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
      "
    >

      <main
        className="
          mx-auto
          max-w-7xl
        "
      >

        <button
          type="button"
          onClick={
            () =>
              navigate(
                `/sistema/professor/turmas/${idProfessorTurma}`
              )
          }
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
            transition
            hover:text-foreground
          "
        >

          <ArrowLeft
            className="size-4"
          />

          Voltar para turma

        </button>


        <section
          className="
            mt-8
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            sm:p-8
          "
        >

          <div
            className="
              flex
              items-start
              gap-4
            "
          >

            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >

              <TrendingUp
                className="size-6"
              />

            </div>


            <div>

              <p
                className="
                  text-sm
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-primary
                "
              >
                Desempenho da turma
              </p>

              <h1
                className="
                  mt-2
                  font-[family-name:var(--font-display)]
                  text-3xl
                  font-semibold
                "
              >
                {
                  turma?.nomeDisciplina
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
                  turma?.codDisciplina
                }

                {' • '}

                {
                  turma?.nomePeriodo
                }

                {' • '}

                {
                  turma?.nomeCurso
                }
              </p>

            </div>

          </div>

        </section>

        <section
          className={`
            mt-8
            rounded-2xl
            border
            p-6
            sm:p-8
            ${
              alunosBaixoRendimento.length > 0
                ? 'border-destructive/40 bg-destructive/5'
                : 'border-border bg-card'
            }
          `}
          aria-labelledby="titulo-rendimento"
        >
          <div className="flex items-start gap-3">
            {
              alunosBaixoRendimento.length > 0
                ? (
                    <BadgeAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
                  )
                : (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  )
            }
            <div className="min-w-0 flex-1">
              <h2 id="titulo-rendimento" className="text-lg font-semibold">
                Acompanhamento de rendimento
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Critérios: frequência abaixo de 75% ou média final ponderada abaixo de 7. Justificadas e aulas sem marcação não entram no cálculo; notas parciais só geram alerta se nem a pontuação máxima restante alcançar 7.
              </p>

              {
                alunosBaixoRendimento.length > 0
                  ? (
                      <div className="mt-5 space-y-3">
                        <p className="text-sm font-medium text-destructive">
                          {alunosBaixoRendimento.length} aluno(s) abaixo de pelo menos um critério.
                        </p>
                        {
                          alunosBaixoRendimento.map(
                            aluno => (
                              <div
                                key={aluno.idMatricula}
                                className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="font-medium">
                                    {aluno.nome}
                                  </p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {
                                      [
                                        aluno.rendimento.abaixoFrequencia === true &&
                                          `Frequência ${aluno.rendimento.percentualFrequencia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`,
                                        aluno.rendimento.abaixoNota === true &&
                                          (
                                            aluno.rendimento.notaFinalDisponivel
                                              ? `Média ponderada ${aluno.rendimento.notaFinalPonderada.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`
                                              : `Máximo possível ${aluno.rendimento.notaMaximaPossivel.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`
                                          )
                                      ]
                                        .filter(Boolean)
                                        .join(' • ')
                                    }
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/sistema/professor/turmas/${idProfessorTurma}/alunos/${aluno.idMatricula}/desempenho`
                                    )
                                  }
                                  className="shrink-0 rounded-md border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                                >
                                  Ver indicadores
                                </button>
                              </div>
                            )
                          )
                        }
                      </div>
                    )
                  : alunos.length === 0
                    ? (
                        <p className="mt-5 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                          Não há alunos com matrícula ativa nesta turma para avaliar.
                        </p>
                      )
                    : alunosComIndicadores.length > 0
                    ? (
                        <p className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                          Não foram identificadas situações abaixo dos critérios nos indicadores disponíveis.
                          {
                            alunosComDadosPendentes.length > 0 &&
                            ` ${alunosComDadosPendentes.length} aluno(s) ainda têm indicadores incompletos.`
                          }
                        </p>
                      )
                    : (
                        <p className="mt-5 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                          Ainda não há dados suficientes de frequência ou avaliações ponderadas para classificar os alunos.
                        </p>
                      )
              }
            </div>
          </div>
        </section>

        <section
          className="
            mt-10
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  text-2xl
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
                } aluno(s) com matrícula ativa
              </p>

            </div>

          </div>


          {
            alunos.length === 0
              ? (

                  <div
                    className="
                      mt-6
                      rounded-xl
                      border
                      border-dashed
                      border-border
                      bg-card
                      p-10
                      text-center
                    "
                  >

                    <GraduationCap
                      className="
                        mx-auto
                        size-8
                        text-primary
                      "
                    />

                    <h3
                      className="
                        mt-4
                        font-semibold
                      "
                    >
                      Nenhum aluno matriculado
                    </h3>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-muted-foreground
                      "
                    >
                      Esta turma ainda não possui alunos com matrícula ativa.
                    </p>

                  </div>

                )
              : (

                  <div
                    className="
                      mt-6
                      grid
                      gap-4
                      lg:grid-cols-2
                    "
                  >

                    {
                      alunos.map(
                        aluno => (

                          <article
                            key={
                              aluno.idMatricula
                            }
                            className={`
                              rounded-xl
                              border
                              border-border
                              ${
                                aluno.rendimento?.baixoRendimento
                                  ? 'border-destructive/50'
                                  : ''
                              }
                              bg-card
                              p-5
                            `}
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

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
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-primary/10
                                    text-primary
                                  "
                                >

                                  <UserRound
                                    className="size-5"
                                  />

                                </div>


                                <div>

                                  <h3
                                    className="
                                      font-semibold
                                    "
                                  >
                                    {
                                      aluno.nome
                                    }
                                  </h3>

                                  <p
                                    className="
                                      mt-1
                                      text-xs
                                      text-muted-foreground
                                    "
                                  >
                                    Matrícula {
                                      aluno.numeroMatricula
                                    }
                                  </p>

                                </div>

                              </div>

                            </div>


                            <div
                              className="
                                mt-5
                                grid
                                grid-cols-2
                                gap-3
                                border-t
                                border-border
                                pt-5
                                sm:grid-cols-3
                                xl:grid-cols-6
                              "
                            >

                              <Indicador
                                titulo="Notas"
                                valor={
                                  aluno.totalNotas
                                }
                                icone={
                                  BookOpen
                                }
                              />

                              <Indicador
                                titulo="Presenças"
                                valor={
                                  aluno.presentes
                                }
                                icone={
                                  CheckCircle2
                                }
                              />

                              <Indicador
                                titulo="Faltas"
                                valor={
                                  aluno.faltas
                                }
                                icone={
                                  XCircle
                                }
                              />

                              <Indicador
                                titulo="Justificadas"
                                valor={
                                  aluno.justificadas
                                }
                                icone={
                                  CircleAlert
                                }
                              />

                              <Indicador
                                titulo="Frequência"
                                valor={
                                  aluno.rendimento?.percentualFrequencia === null
                                    ? '—'
                                    : `${aluno.rendimento?.percentualFrequencia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
                                }
                                icone={
                                  Percent
                                }
                              />

                              <Indicador
                                titulo="Média ponderada"
                                valor={
                                  aluno.rendimento?.notaFinalDisponivel
                                    ? aluno.rendimento.notaFinalPonderada.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2
                                      })
                                    : aluno.rendimento?.abaixoNota === true
                                      ? `Máx. ${aluno.rendimento.notaMaximaPossivel.toLocaleString('pt-BR', {
                                          minimumFractionDigits: 1,
                                          maximumFractionDigits: 2
                                        })}`
                                      : 'Pendente'
                                }
                                icone={
                                  TrendingUp
                                }
                              />

                            </div>

                            {
                              aluno.rendimento?.baixoRendimento &&
                              (
                                <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                                  Situação abaixo do critério institucional.
                                </p>
                              )
                            }


                            <button
                              type="button"
                              onClick={
                                () =>
                                  navigate(
                                    `/sistema/professor/turmas/${idProfessorTurma}/alunos/${aluno.idMatricula}/desempenho`
                                  )
                              }
                              className="
                                mt-5
                                w-full
                                rounded-md
                                border
                                border-primary/30
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-primary
                                transition
                                hover:bg-primary/10
                              "
                            >
                              Ver detalhamento
                            </button>

                          </article>

                        )
                      )
                    }

                  </div>

                )
          }

        </section>

      </main>

    </div>

  )

}


function Indicador({
  titulo,
  valor,
  icone: Icone
}) {

  return (

    <div
      className="
        rounded-lg
        bg-background
        p-3
      "
    >

      <Icone
        className="
          size-4
          text-primary
        "
      />

      <p
        className="
          mt-2
          text-lg
          font-semibold
        "
      >
        {valor ?? '—'}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-muted-foreground
        "
      >
        {titulo}
      </p>

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


export default DesempenhoTurmaProfessorPage