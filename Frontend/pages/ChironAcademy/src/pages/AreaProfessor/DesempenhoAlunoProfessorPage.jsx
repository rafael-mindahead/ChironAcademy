import {
  useEffect,
  useState
} from 'react'

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  GraduationCap,
  UserRound,
  XCircle
} from 'lucide-react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  consultarDesempenhoAluno
} from '../../services/professorServices/desempenhoProfessorService.js'


function DesempenhoAlunoProfessorPage() {

  const {
    idProfessorTurma,
    idMatricula
  } =
    useParams()


  const navigate =
    useNavigate()


  const [
    dados,
    setDados
  ] =
    useState(null)


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


  useEffect(
    () => {

      carregar()

    },
    [
      idProfessorTurma,
      idMatricula
    ]
  )


  async function carregar() {

    try {

      setEstado(
        'carregando'
      )

      setErro('')


      const resposta =
        await consultarDesempenhoAluno(
          idProfessorTurma,
          idMatricula
        )


      setDados(
        resposta
      )


      setEstado(
        'sucesso'
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar o desempenho do aluno.'
      )


      setEstado(
        'erro'
      )

    }

  }


  function formatarData(
    data
  ) {

    if (!data) {

      return '—'

    }


    const [
      ano,
      mes,
      dia
    ] =
      String(data)
        .slice(
          0,
          10
        )
        .split('-')


    return (
      `${dia}/${mes}/${ano}`
    )

  }


  function nomeFrequencia(
    status
  ) {

    const nomes = {

      PRESENTE:
        'Presente',

      FALTA:
        'Falta',

      JUSTIFICADA:
        'Justificada'

    }


    return (
      nomes[status] ||
      status ||
      'Não registrada'
    )

  }


  if (
    estado ===
    'carregando'
  ) {

    return (

      <EstadoCentral
        texto="Carregando desempenho do aluno..."
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
            Não foi possível consultar o aluno
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

            onClick={
              () =>
                navigate(
                  `/sistema/professor/turmas/${idProfessorTurma}/desempenho`
                )
            }

            className="
              botao-secundario
              mt-6
            "
          >
            Voltar
          </button>

        </div>

      </div>

    )

  }


  const aluno =
    dados?.aluno


  const turma =
    dados?.turma


  const notas =
    dados
      ?.desempenho
      ?.notas ||
    []


  const frequencia =
    dados
      ?.desempenho
      ?.frequencia

  const rendimento =
    dados
      ?.desempenho
      ?.rendimento


  const notasRegistradas =
    notas.filter(
      nota =>
        nota.idNota !== null
    ).length


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
                `/sistema/professor/turmas/${idProfessorTurma}/desempenho`
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

          Voltar para desempenho da turma

        </button>


        {/* ===========================================
            ALUNO
        =========================================== */}

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
              flex-col
              justify-between
              gap-6
              md:flex-row
              md:items-center
            "
          >

            <div
              className="
                flex
                items-center
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

                <UserRound
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
                  Desempenho do aluno
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
                    aluno?.nome
                  }
                </h1>

                <p
                  className="
                    mt-2
                    text-sm
                    text-muted-foreground
                  "
                >
                  Matrícula {
                    aluno?.numeroMatricula
                  }
                </p>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-5
                py-4
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Disciplina
              </p>

              <p
                className="
                  mt-1
                  font-medium
                "
              >
                {
                  turma?.nomeDisciplina
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
                  turma?.codDisciplina
                }

                {' • '}

                {
                  turma?.nomePeriodo
                }
              </p>

            </div>

          </div>

        </section>


        {/* ===========================================
            RESUMO
        =========================================== */}

        <section
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          <ResumoCard
            titulo="Notas registradas"
            valor={
              notasRegistradas
            }
            icone={
              BookOpen
            }
          />

          <ResumoCard
            titulo="Presenças"
            valor={
              frequencia
                ?.presentes ||
              0
            }
            icone={
              CheckCircle2
            }
          />

          <ResumoCard
            titulo="Faltas"
            valor={
              frequencia
                ?.faltas ||
              0
            }
            icone={
              XCircle
            }
          />

          <ResumoCard
            titulo="Justificadas"
            valor={
              frequencia
                ?.justificadas ||
              0
            }
            icone={
              CircleAlert
            }
          />

          <ResumoCard
            titulo="Frequência considerada"
            valor={
              rendimento?.percentualFrequencia === null ||
              rendimento?.percentualFrequencia === undefined
                ? 'Indisponível'
                : `${rendimento.percentualFrequencia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
            }
            icone={
              TrendingUp
            }
          />

          <ResumoCard
            titulo="Média final ponderada"
            valor={
              rendimento?.notaFinalDisponivel
                ? rendimento.notaFinalPonderada.toLocaleString('pt-BR', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2
                  })
                : rendimento?.abaixoNota === true
                  ? `Máx. ${rendimento.notaMaximaPossivel.toLocaleString('pt-BR', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 2
                    })}`
                  : 'Indisponível'
            }
            icone={
              GraduationCap
            }
          />

        </section>

        {
          !rendimento?.pesosConfigurados
            ? (
                <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Média final indisponível: os pesos das avaliações devem estar configurados e totalizar 100% (total atual: {
                    Number(rendimento?.totalPesoAvaliacao || 0).toLocaleString('pt-BR', {
                      maximumFractionDigits: 2
                    })
                  }%).
                </p>
              )
            : rendimento.notasPendentes > 0
              ? (
                  <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Há {rendimento.notasPendentes} avaliação(ões) sem nota. A média final só é exibida quando todos os lançamentos necessários estiverem disponíveis.
                  </p>
                )
              : null
        }

        {
          rendimento?.baixoRendimento
            ? (
                <section className="mt-5 rounded-xl border border-destructive/40 bg-destructive/5 p-5">
                  <h2 className="font-semibold text-destructive">
                    Indicadores abaixo dos critérios
                  </h2>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                    {
                      rendimento.abaixoFrequencia === true &&
                      (
                        <li>
                          Frequência de {rendimento.percentualFrequencia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% — mínimo de 75%.
                        </li>
                      )
                    }
                    {
                      rendimento.abaixoNota === true &&
                      (
                        <li>
                          {
                            rendimento.notaFinalDisponivel
                              ? `Média final ponderada ${rendimento.notaFinalPonderada.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} — mínimo de 7.`
                              : `Mesmo com as avaliações pendentes na nota máxima, o resultado não alcança 7 (máximo possível: ${rendimento.notaMaximaPossivel.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}).`
                          }
                        </li>
                      )
                    }
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Frequência = presenças ÷ (presenças + faltas); registros justificados e aulas sem marcação são excluídos. A nota pondera cada avaliação por seu peso e normaliza a nota pelo valor máximo.
                  </p>
                </section>
              )
            : null
        }


        {/* ===========================================
            NOTAS
        =========================================== */}

        <section
          className="
            mt-10
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <BookOpen
              className="
                size-5
                text-primary
              "
            />

            <div>

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Notas
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Avaliações cadastradas para esta turma.
              </p>

            </div>

          </div>


          {
            notas.length === 0
              ? (

                  <EstadoVazio
                    texto="Ainda não existem avaliações cadastradas."
                  />

                )
              : (

                  <div
                    className="
                      mt-5
                      space-y-3
                    "
                  >

                    {
                      notas.map(
                        nota => (

                          <article
                            key={
                              nota.idAvaliacao
                            }
                            className="
                              rounded-xl
                              border
                              border-border
                              bg-card
                              p-5
                            "
                          >

                            <div
                              className="
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                              "
                            >

                              <div>

                                <h3
                                  className="
                                    font-semibold
                                  "
                                >
                                  {
                                    nota.titulo
                                  }
                                </h3>

                                <p
                                  className="
                                    mt-2
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-xs
                                    text-muted-foreground
                                  "
                                >

                                  <CalendarDays
                                    className="size-3"
                                  />

                                  {
                                    formatarData(
                                      nota.dataAvaliacao
                                    )
                                  }

                                  {' • '}
                                  Peso {
                                    nota.pesoAvaliacao === null ||
                                    nota.pesoAvaliacao === undefined
                                      ? 'pendente'
                                      : `${Number(nota.pesoAvaliacao).toLocaleString('pt-BR')}%`
                                  }

                                </p>

                                {
                                  nota.descricao && (

                                    <p
                                      className="
                                        mt-2
                                        text-sm
                                        text-muted-foreground
                                      "
                                    >
                                      {
                                        nota.descricao
                                      }
                                    </p>

                                  )
                                }

                              </div>


                              {
                                nota.idNota
                                  ? (

                                      <div
                                        className="
                                          text-left
                                          sm:text-right
                                        "
                                      >

                                        <p
                                          className="
                                            text-2xl
                                            font-semibold
                                            text-primary
                                          "
                                        >
                                          {
                                            Number(
                                              nota.valor
                                            ).toFixed(2)
                                          }
                                        </p>

                                        <p
                                          className="
                                            text-xs
                                            text-muted-foreground
                                          "
                                        >
                                          de {
                                            Number(
                                              nota.valorMaximo
                                            ).toFixed(2)
                                          }
                                        </p>
                                        {
                                          nota.pesoAvaliacao !== null &&
                                          nota.pesoAvaliacao !== undefined &&
                                          (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                              Contribuição: {
                                                (
                                                  Number(nota.valor) /
                                                  Number(nota.valorMaximo) *
                                                  Number(nota.pesoAvaliacao) /
                                                  10
                                                ).toLocaleString('pt-BR', {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2
                                                })
                                              } pontos
                                            </p>
                                          )
                                        }

                                      </div>

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
                                        Nota não registrada
                                      </span>

                                    )
                              }

                            </div>

                          </article>

                        )
                      )
                    }

                  </div>

                )
          }

        </section>


        {/* ===========================================
            FREQUÊNCIA
        =========================================== */}

        <section
          className="
            mt-10
            pb-10
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <ClipboardList
              className="
                size-5
                text-primary
              "
            />

            <div>

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Frequência
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Histórico de frequência nas aulas cadastradas.
              </p>

            </div>

          </div>


          {
            !frequencia
              ?.aulas
              ?.length
              ? (

                  <EstadoVazio
                    texto="Ainda não existem aulas cadastradas para esta turma."
                  />

                )
              : (

                  <div
                    className="
                      mt-5
                      overflow-hidden
                      rounded-xl
                      border
                      border-border
                      bg-card
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
                          min-w-[700px]
                        "
                      >

                        <thead
                          className="
                            border-b
                            border-border
                            bg-background
                          "
                        >

                          <tr>

                            <th
                              className="
                                px-5
                                py-4
                                text-left
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-muted-foreground
                              "
                            >
                              Data
                            </th>

                            <th
                              className="
                                px-5
                                py-4
                                text-left
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-muted-foreground
                              "
                            >
                              Conteúdo
                            </th>

                            <th
                              className="
                                px-5
                                py-4
                                text-left
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-muted-foreground
                              "
                            >
                              Situação
                            </th>

                          </tr>

                        </thead>


                        <tbody
                          className="
                            divide-y
                            divide-border
                          "
                        >

                          {
                            frequencia.aulas.map(
                              aula => (

                                <tr
                                  key={
                                    aula.idAula
                                  }
                                >

                                  <td
                                    className="
                                      px-5
                                      py-4
                                      text-sm
                                    "
                                  >
                                    {
                                      formatarData(
                                        aula.dataAula
                                      )
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
                                      aula.conteudo ||
                                      '—'
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
                                        nomeFrequencia(
                                          aula.statusFrequencia
                                        )
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

      </main>

    </div>

  )

}


function ResumoCard({
  titulo,
  valor,
  icone: Icone
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

      <Icone
        className="
          size-5
          text-primary
        "
      />

      <p
        className="
          mt-4
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


function EstadoVazio({
  texto
}) {

  return (

    <div
      className="
        mt-5
        rounded-xl
        border
        border-dashed
        border-border
        bg-card
        p-8
        text-center
        text-sm
        text-muted-foreground
      "
    >
      {texto}
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


export default DesempenhoAlunoProfessorPage