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
  XCircle
} from 'lucide-react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  consultarDesempenhoDisciplina
} from '../../services/alunoServices/desempenhoAlunoService.js'


function DesempenhoDisciplinaAlunoPage() {

  const navigate =
    useNavigate()


  const {
    idMatricula
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

  }, [idMatricula])


  async function carregar() {

    try {

      setEstado(
        'carregando'
      )

      setErro('')


      const resposta =
        await consultarDesempenhoDisciplina(
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
        'Não foi possível carregar o desempenho.'
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

        Carregando desempenho...

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
            Não foi possível consultar o desempenho
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


  const disciplina =
    dados?.disciplina


  const notas =
    dados
      ?.desempenho
      ?.notas


  const frequencia =
    dados
      ?.desempenho
      ?.frequencia


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

          <p
            className="
              text-sm
              font-medium
              uppercase
              tracking-[0.2em]
              text-primary
            "
          >
            Desempenho acadêmico
          </p>

          <h1
            className="
              mt-3
              font-[family-name:var(--font-display)]
              text-3xl
              font-semibold
            "
          >
            {
              disciplina
                ?.nomeDisciplina
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
              disciplina
                ?.codDisciplina
            }
            {' • '}
            {
              disciplina
                ?.nomePeriodo
            }
          </p>

        </section>


        <section
          className="
            mt-8
            grid
            gap-4
            md:grid-cols-3
          "
        >

          <ResumoCard
            titulo="Frequências registradas"
            valor={
              frequencia
                ?.totalRegistradas ||
              0
            }
            icone={
              ClipboardList
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
              gap-2
            "
          >

            <BookOpen
              className="
                size-5
                text-primary
              "
            />

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Notas
            </h2>

          </div>


          {
            notas
              ?.totalAvaliacoes ===
            0
              ? (

                  <EstadoVazio
                    texto="Ainda não existem avaliações cadastradas para esta disciplina."
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
                      notas
                        ?.avaliacoes
                        ?.map(
                          avaliacao => (

                            <article
                              key={
                                avaliacao
                                  .idAvaliacao
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
                                  gap-4
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
                                      avaliacao
                                        .titulo
                                    }
                                  </h3>

                                  <p
                                    className="
                                      mt-1
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
                                        avaliacao
                                          .dataAvaliacao
                                      )
                                    }

                                  </p>

                                </div>


                                {
                                  avaliacao
                                    .idNota
                                    ? (

                                        <div
                                          className="
                                            text-right
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
                                              avaliacao
                                                .valor
                                            }
                                          </p>

                                          <p
                                            className="
                                              text-xs
                                              text-muted-foreground
                                            "
                                          >
                                            de {
                                              avaliacao
                                                .valorMaximo
                                            }
                                          </p>

                                        </div>

                                      )
                                    : (

                                        <span
                                          className="
                                            text-sm
                                            text-muted-foreground
                                          "
                                        >
                                          Nota ainda não registrada
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


        <section
          className="
            mt-10
            pb-10
          "
        >

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Frequência
          </h2>


          {
            !frequencia
              ?.disponivel
              ? (

                  <EstadoVazio
                    texto="Ainda não existem registros de frequência disponíveis."
                  />

                )
              : (

                  <div
                    className="
                      mt-5
                      grid
                      gap-4
                      sm:grid-cols-3
                    "
                  >

                    <ResumoCard
                      titulo="Presentes"
                      valor={
                        frequencia
                          .presentes
                      }
                      icone={
                        CheckCircle2
                      }
                    />

                    <ResumoCard
                      titulo="Faltas"
                      valor={
                        frequencia
                          .faltas
                      }
                      icone={
                        XCircle
                      }
                    />

                    <ResumoCard
                      titulo="Justificadas"
                      valor={
                        frequencia
                          .justificadas
                      }
                      icone={
                        CircleAlert
                      }
                    />

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


export default DesempenhoDisciplinaAlunoPage