import {
  useEffect,
  useState
} from 'react'

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
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
                                sm:grid-cols-4
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

                            </div>


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
        {
          Number(
            valor ||
            0
          )
        }
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