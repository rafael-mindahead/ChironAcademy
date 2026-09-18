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
  Clock,
  GraduationCap,
  MapPin,
  UsersRound
} from 'lucide-react'

import {
  buscarMinhaTurma
} from '../../services/professorServices/turmasProfessorService.js'


const nomesTurno = {

  MANHA:
    'Manhã',

  TARDE:
    'Tarde',

  NOITE:
    'Noite'

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
        await buscarMinhaTurma(
          idProfessorTurma
        )


      setProfessor(
        resposta.professor
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
        'Não foi possível carregar a turma.'
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

        {/* HEADER */}

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


        {/* TURMA */}

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


        {/* ALUNOS */}

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