import {
  useEffect,
  useState
} from 'react'

import {
  BookOpen,
  ClipboardCheck,
  FileText,
  LogOut,
  UserRound,
  UsersRound,
  MapPin,
  Clock,
  GraduationCap,
  ChevronRight
} from 'lucide-react'

import {
  useNavigate
} from 'react-router-dom'

import logo
  from '../../assets/chiron-logo.png'

import {
  listarMinhasTurmas
} from '../../services/professorServices/turmasProfessorService.js'


function AreaProfessor() {

  const navigate =
    useNavigate()


  const [
    professor,
    setProfessor
  ] =
    useState(null)


  const [
    turmas,
    setTurmas
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


  // ====================================================
  // CARREGAR TURMAS
  // ====================================================

  useEffect(() => {

    carregar()

  }, [])


  async function carregar() {

    try {

      setEstado(
        'carregando'
      )

      setErro('')


      const resposta =
        await listarMinhasTurmas()


      setProfessor(
        resposta.professor
      )


      setTurmas(
        resposta.turmas ||
        []
      )


      setEstado(
        'sucesso'
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar suas turmas.'
      )


      setEstado(
        'erro'
      )

    }

  }


  // ====================================================
  // LOGOUT
  // ====================================================

  function handleLogout() {

    sessionStorage.removeItem(
      'chiron_token'
    )

    sessionStorage.removeItem(
      'chiron_usuario'
    )


    navigate(
      '/login',
      {
        replace:
          true
      }
    )

  }


  // ====================================================
  // FORMATAÇÃO
  // ====================================================

  function formatarTurno(
    turno
  ) {

    const nomes = {

      MANHA:
        'Manhã',

      TARDE:
        'Tarde',

      NOITE:
        'Noite'

    }


    return (
      nomes[turno] ||
      turno
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
          text-muted-foreground
        "
      >

        Carregando suas turmas...

      </div>

    )

  }


  // ====================================================
  // ERRO
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
          text-foreground
        "
      >

        <div
          className="
            max-w-md
          "
        >

          <BookOpen
            className="
              mx-auto
              mb-4
              size-10
              text-destructive
            "
          />


          <h1
            className="
              text-xl
              font-semibold
            "
          >
            Não foi possível carregar suas turmas
          </h1>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {erro}
          </p>


          <div
            className="
              mt-6
              flex
              justify-center
              gap-3
            "
          >

            <button
              type="button"

              onClick={
                carregar
              }

              className="
                botao-secundario
              "
            >
              Tentar novamente
            </button>


            <button
              type="button"

              onClick={
                handleLogout
              }

              className="
                botao-principal
              "
            >
              Ir para login
            </button>

          </div>

        </div>

      </div>

    )

  }


  return (

    <div
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >

      {/* ==============================================
          HEADER
      ============================================== */}

      <header
        className="
          border-b
          border-border/70
        "
      >

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            items-center
            justify-between
            px-5
            py-4
            sm:px-8
          "
        >

          <img
            src={
              logo
            }

            alt="ChironAcademy"

            className="
              h-9
              w-auto
            "
          />


          <button
            type="button"

            onClick={
              handleLogout
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
              text-muted-foreground
              transition
              hover:bg-secondary
              hover:text-foreground
            "
          >

            <LogOut
              className="
                size-4
              "
            />

            <span
              className="
                hidden
                sm:inline
              "
            >
              Sair
            </span>

          </button>

        </div>

      </header>


      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          px-5
          py-8
          sm:px-8
          lg:py-12
        "
      >

        {/* ==============================================
            PROFESSOR
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
                rounded-full
                bg-primary/10
                text-primary
              "
            >

              <UserRound
                className="
                  size-6
                "
              />

            </div>


            <div>

              <p
                className="
                  text-sm
                  text-primary
                "
              >
                Área do professor
              </p>


              <h1
                className="
                  mt-1
                  font-[family-name:var(--font-display)]
                  text-3xl
                "
              >

                Olá, {
                  professor
                    ?.nome ||
                  'Professor'
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
                  professor?.email
                }
              </p>

            </div>

          </div>

        </section>


        {/* ==============================================
            MINHAS TURMAS
        ============================================== */}

        <section
          className="
            mt-8
          "
        >

          <div
            className="
              mb-5
              flex
              items-end
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
                Minhas turmas
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >

                {
                  turmas.length
                } vínculo(s) acadêmico(s)

              </p>

            </div>

          </div>


          {
            turmas.length === 0
              ? (

                <div
                  className="
                    flex
                    min-h-60
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-border
                    bg-card
                    px-6
                    text-center
                  "
                >

                  <BookOpen
                    className="
                      mb-4
                      size-9
                      text-muted-foreground
                    "
                  />


                  <h3
                    className="
                      font-medium
                    "
                  >
                    Nenhuma turma vinculada
                  </h3>


                  <p
                    className="
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    Quando a gestão acadêmica vincular você a uma turma e disciplina, ela aparecerá aqui.
                  </p>

                </div>

              )
              : (

                <div
                  className="
                    grid
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >

                  {
                    turmas.map(
                      turma => (

                        <article
                          key={
                            turma.idProfessorTurma
                          }

                          className="
                            group
                            rounded-2xl
                            border
                            border-border
                            bg-card
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-0.5
                            hover:border-primary/50
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
                                size-10
                                items-center
                                justify-center
                                rounded-lg
                                bg-primary/10
                                text-primary
                              "
                            >

                              <BookOpen
                                className="
                                  size-5
                                "
                              />

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
                                text-muted-foreground
                              "
                            >
                              {
                                turma.codDisciplina
                              }
                            </span>

                          </div>


                          <div
                            className="
                              mt-5
                            "
                          >

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-wide
                                text-primary
                              "
                            >
                              {
                                turma.nomeCurso
                              }
                            </p>


                            <h3
                              className="
                                mt-2
                                text-xl
                                font-semibold
                              "
                            >
                              {
                                turma.nomeDisciplina
                              }
                            </h3>


                            <p
                              className="
                                mt-2
                                text-sm
                                text-muted-foreground
                              "
                            >
                              {
                                turma.nomePeriodo
                              }
                            </p>

                          </div>


                          <div
                            className="
                              mt-6
                              grid
                              gap-3
                              text-sm
                              text-muted-foreground
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <MapPin
                                className="
                                  size-4
                                "
                              />

                              {
                                turma.localTurma
                              }

                            </div>


                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <Clock
                                className="
                                  size-4
                                "
                              />

                              {
                                formatarTurno(
                                  turma.turnoTurma
                                )
                              }

                            </div>


                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <UsersRound
                                className="
                                  size-4
                                "
                              />

                              {
                                Number(
                                  turma.totalAlunos ||
                                  0
                                )
                              } aluno(s)

                            </div>

                          </div>


                          <button
                            type="button"

                            onClick={() =>
                              navigate(
                                `/sistema/professor/turmas/${turma.idProfessorTurma}`
                              )
                            }

                            className="
                              mt-6
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-lg
                              border
                              border-border
                              px-4
                              py-3
                              text-sm
                              font-medium
                              transition
                              hover:bg-secondary
                            "
                          >

                            Acessar turma

                            <ChevronRight
                              className="
                                size-4
                              "
                            />

                          </button>

                        </article>

                      )
                    )
                  }

                </div>

              )
          }

        </section>


        {/* ==============================================
            PRÓXIMOS RECURSOS
        ============================================== */}

        <section
          className="
            mt-10
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          <ProfessorAreaItem

            icon={
              <UsersRound
                className="
                  size-5
                "
              />
            }

            title="Alunos"

            description="Consulte alunos dentro de cada turma."

          />


          <ProfessorAreaItem

            icon={
              <ClipboardCheck
                className="
                  size-5
                "
              />
            }

            title="Avaliações"

            description="Disponível nos próximos PBIs."

          />


          <ProfessorAreaItem

            icon={
              <FileText
                className="
                  size-5
                "
              />
            }

            title="Notas"

            description="Disponível nos próximos PBIs."

          />


          <ProfessorAreaItem

            icon={
              <GraduationCap
                className="
                  size-5
                "
              />
            }

            title="Frequência"

            description="Disponível nos próximos PBIs."

          />

        </section>

      </main>

    </div>

  )

}


function ProfessorAreaItem({
  icon,
  title,
  description
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

      <div
        className="
          flex
          items-center
          gap-3
          text-primary
        "
      >

        {icon}


        <h2
          className="
            text-sm
            font-medium
            text-foreground
          "
        >
          {title}
        </h2>

      </div>


      <p
        className="
          mt-3
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        {description}
      </p>

    </div>

  )

}


export default AreaProfessor