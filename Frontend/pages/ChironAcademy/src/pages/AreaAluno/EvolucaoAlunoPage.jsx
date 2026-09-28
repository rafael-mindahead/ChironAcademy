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
  TrendingUp,
  XCircle
} from 'lucide-react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  consultarEvolucaoPeriodo
} from '../../services/alunoServices/evolucaoAlunoService.js'


function EvolucaoAlunoPage() {

  const navigate =
    useNavigate()


  const {
    idPeriodo
  } =
    useParams()


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


  useEffect(() => {

    carregar()

  }, [idPeriodo])


  async function carregar() {

    try {

      setEstado(
        'carregando'
      )

      setErro('')


      const resposta =
        await consultarEvolucaoPeriodo(
          idPeriodo
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
        'Não foi possível carregar sua evolução acadêmica.'
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
      data
        .slice(0, 10)
        .split('-')


    return `${dia}/${mes}/${ano}`

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
      status
    )

  }


  function iconeFrequencia(
    status
  ) {

    if (
      status ===
      'PRESENTE'
    ) {

      return CheckCircle2

    }


    if (
      status ===
      'FALTA'
    ) {

      return XCircle

    }


    return CircleAlert

  }


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
          text-muted-foreground
        "
      >
        Carregando evolução acadêmica...
      </div>

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
            text-center
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
            Não foi possível consultar sua evolução
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
                  '/sistema/aluno'
                )
            }
          >
            Voltar
          </button>

        </div>

      </div>

    )

  }


  const evolucao =
    dados?.evolucao


  const periodo =
    dados?.periodoSelecionado


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
          max-w-6xl
        "
      >

        <button
          type="button"
          onClick={
            () =>
              navigate(
                '/sistema/aluno'
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

          Voltar para disciplinas

        </button>


        <section
          className="
            mt-8
            rounded-xl
            border
            border-border
            bg-card
            p-6
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
                Evolução acadêmica
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
                  periodo?.nomePeriodo ||
                  'Período acadêmico'
                }
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  text-muted-foreground
                "
              >
                Acompanhe suas notas e registros de frequência
                em ordem cronológica ao longo do período.
              </p>

            </div>

          </div>

        </section>


        <section
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-3
          "
        >

          <ResumoCard
            titulo="Registros"
            valor={
              evolucao
                ?.totalRegistros ||
              0
            }
            icone={
              ClipboardList
            }
          />

          <ResumoCard
            titulo="Notas"
            valor={
              evolucao
                ?.totalNotas ||
              0
            }
            icone={
              BookOpen
            }
          />

          <ResumoCard
            titulo="Frequências"
            valor={
              evolucao
                ?.totalFrequencias ||
              0
            }
            icone={
              CalendarDays
            }
          />

        </section>


        {
          !evolucao
            ?.dadosSuficientes
            ? (

                <section
                  className="
                    mt-8
                    rounded-xl
                    border
                    border-dashed
                    border-border
                    bg-card
                    p-10
                    text-center
                  "
                >

                  <TrendingUp
                    className="
                      mx-auto
                      size-9
                      text-primary
                    "
                  />

                  <h2
                    className="
                      mt-4
                      text-lg
                      font-semibold
                    "
                  >
                    Ainda não há dados suficientes
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-xl
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    São necessários registros acadêmicos realizados
                    em momentos diferentes para apresentar sua evolução
                    ao longo do período.
                  </p>

                </section>

              )
            : (

                <section
                  className="
                    mt-10
                  "
                >

                  <div>

                    <h2
                      className="
                        font-[family-name:var(--font-display)]
                        text-2xl
                        font-semibold
                      "
                    >
                      Linha do tempo
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-muted-foreground
                      "
                    >
                      Registros apresentados do mais antigo para o mais recente.
                    </p>

                  </div>


                  <div
                    className="
                      relative
                      mt-8
                      space-y-5
                      border-l
                      border-border
                      pl-6
                    "
                  >

                    {
                      evolucao
                        ?.eventos
                        ?.map(
                          (
                            evento,
                            index
                          ) => {

                            const Icone =
                              evento.tipo ===
                              'NOTA'
                                ? BookOpen
                                : iconeFrequencia(
                                    evento.statusFrequencia
                                  )


                            return (

                              <article
                                key={
                                  `${evento.tipo}-${evento.data}-${evento.idMatricula}-${index}`
                                }
                                className="
                                  relative
                                  rounded-xl
                                  border
                                  border-border
                                  bg-card
                                  p-5
                                "
                              >

                                <div
                                  className="
                                    absolute
                                    -left-[31px]
                                    top-6
                                    size-3
                                    rounded-full
                                    border-2
                                    border-background
                                    bg-primary
                                  "
                                />


                                <div
                                  className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-start
                                    sm:justify-between
                                  "
                                >

                                  <div
                                    className="
                                      flex
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

                                      <Icone
                                        className="size-5"
                                      />

                                    </div>


                                    <div>

                                      <p
                                        className="
                                          text-xs
                                          font-medium
                                          uppercase
                                          tracking-wide
                                          text-primary
                                        "
                                      >
                                        {
                                          evento.tipo ===
                                          'NOTA'
                                            ? 'Avaliação'
                                            : 'Frequência'
                                        }
                                      </p>

                                      <h3
                                        className="
                                          mt-1
                                          font-semibold
                                        "
                                      >
                                        {
                                          evento.nomeDisciplina
                                        }
                                      </h3>

                                      <p
                                        className="
                                          mt-1
                                          text-xs
                                          text-muted-foreground
                                        "
                                      >
                                        {
                                          evento.codDisciplina
                                        }
                                      </p>

                                    </div>

                                  </div>


                                  <div
                                    className="
                                      text-left
                                      sm:text-right
                                    "
                                  >

                                    <p
                                      className="
                                        text-sm
                                        font-medium
                                      "
                                    >
                                      {
                                        formatarData(
                                          evento.data
                                        )
                                      }
                                    </p>

                                  </div>

                                </div>


                                {
                                  evento.tipo ===
                                  'NOTA'
                                    ? (

                                        <div
                                          className="
                                            mt-5
                                            rounded-lg
                                            border
                                            border-border
                                            bg-background
                                            p-4
                                          "
                                        >

                                          <p
                                            className="
                                              text-sm
                                              text-muted-foreground
                                            "
                                          >
                                            {
                                              evento.titulo
                                            }
                                          </p>

                                          <p
                                            className="
                                              mt-1
                                              text-2xl
                                              font-semibold
                                              text-primary
                                            "
                                          >
                                            {
                                              evento.valor
                                            }
                                            {' / '}
                                            {
                                              evento.valorMaximo
                                            }
                                          </p>

                                        </div>

                                      )
                                    : (

                                        <div
                                          className="
                                            mt-5
                                            rounded-lg
                                            border
                                            border-border
                                            bg-background
                                            p-4
                                          "
                                        >

                                          <p
                                            className="
                                              text-sm
                                              text-muted-foreground
                                            "
                                          >
                                            Situação da aula
                                          </p>

                                          <p
                                            className="
                                              mt-1
                                              font-semibold
                                            "
                                          >
                                            {
                                              nomeFrequencia(
                                                evento.statusFrequencia
                                              )
                                            }
                                          </p>

                                          {
                                            evento.conteudo && (

                                              <p
                                                className="
                                                  mt-2
                                                  text-sm
                                                  text-muted-foreground
                                                "
                                              >
                                                {
                                                  evento.conteudo
                                                }
                                              </p>

                                            )
                                          }

                                        </div>

                                      )
                                }

                              </article>

                            )

                          }
                        )
                    }

                  </div>

                </section>

              )
        }

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


export default EvolucaoAlunoPage