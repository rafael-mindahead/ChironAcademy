import {
  useEffect,
  useState
} from 'react'

import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  Layers3,
  LogOut,
  MapPin,
  UserRound
} from 'lucide-react'

import {
  useNavigate
} from 'react-router-dom'

import logo
  from '../../assets/chiron-logo.png'

import {
  listarMinhasDisciplinas
} from '../../services/alunoServices/disciplinasAlunoService.js'


function AreaAluno() {

  const navigate =
    useNavigate()


  const [
    aluno,
    setAluno
  ] =
    useState(null)


  const [
    periodos,
    setPeriodos
  ] =
    useState([])


  const [
    disciplinas,
    setDisciplinas
  ] =
    useState([])


  const [
    periodoSelecionado,
    setPeriodoSelecionado
  ] =
    useState('')


  const [
    estado,
    setEstado
  ] =
    useState('carregando')


  const [
    carregandoPeriodo,
    setCarregandoPeriodo
  ] =
    useState(false)


  const [
    erro,
    setErro
  ] =
    useState('')


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
        await listarMinhasDisciplinas()


      setAluno(
        resposta.aluno
      )


      setPeriodos(
        resposta.periodos ||
        []
      )


      setPeriodoSelecionado(
        resposta
          .periodoSelecionado
          ?.idPeriodo
          ? String(
              resposta
                .periodoSelecionado
                .idPeriodo
            )
          : ''
      )


      setDisciplinas(
        resposta.disciplinas ||
        []
      )


      setEstado(
        'sucesso'
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível carregar suas disciplinas.'
      )


      setEstado(
        'erro'
      )

    }

  }


  async function trocarPeriodo(
    event
  ) {

    const novoPeriodo =
      event.target.value


    setPeriodoSelecionado(
      novoPeriodo
    )

    setCarregandoPeriodo(
      true
    )

    setErro('')


    try {

      const resposta =
        await listarMinhasDisciplinas(
          novoPeriodo
        )


      setDisciplinas(
        resposta.disciplinas ||
        []
      )


      setPeriodoSelecionado(
        String(
          resposta
            .periodoSelecionado
            ?.idPeriodo ||
          novoPeriodo
        )
      )


    } catch (error) {

      setErro(
        error.message ||
        'Não foi possível atualizar o período.'
      )

    } finally {

      setCarregandoPeriodo(
        false
      )

    }

  }


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


  function formatarTipo(
    tipo
  ) {

    const nomes = {

      OBRIGATORIA:
        'Obrigatória',

      OPTATIVA:
        'Optativa'

    }


    return (
      nomes[tipo] ||
      tipo
    )

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

        Carregando suas disciplinas...

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

          <h1
            className="
              font-[family-name:var(--font-display)]
              text-2xl
            "
          >
            Não foi possível abrir sua área
          </h1>

          <p
            className="
              mt-3
              text-sm
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
              className="botao-principal"
              onClick={carregar}
            >
              Tentar novamente
            </button>

            <button
              type="button"
              className="botao-secundario"
              onClick={handleLogout}
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

      <header
        className="
          border-b
          border-border
          bg-card/70
          backdrop-blur
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-6
            py-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <img
              src={logo}
              alt="ChironAcademy"
              className="
                size-11
                rounded-lg
                object-cover
              "
            />

            <div>

              <p
                className="
                  font-[family-name:var(--font-display)]
                  text-lg
                  font-semibold
                "
              >
                ChironAcademy
              </p>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                Área do aluno
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={handleLogout}
            className="
              inline-flex
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
              className="size-4"
            />

            Sair

          </button>

        </div>

      </header>


      <main
        className="
          mx-auto
          max-w-7xl
          px-6
          py-10
        "
      >

        <section
          className="
            grid
            gap-6
            lg:grid-cols-[1fr_320px]
          "
        >

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
              Sprint 2
            </p>

            <h1
              className="
                mt-3
                font-[family-name:var(--font-display)]
                text-4xl
                font-semibold
                tracking-tight
              "
            >
              Minhas disciplinas
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Consulte as disciplinas em que você está matriculado
              no período acadêmico selecionado.
            </p>

          </div>


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

                <UserRound
                  className="size-5"
                />

              </div>

              <div
                className="min-w-0"
              >

                <p
                  className="
                    truncate
                    font-medium
                  "
                >
                  {
                    aluno?.nome ||
                    'Aluno'
                  }
                </p>

                <p
                  className="
                    truncate
                    text-xs
                    text-muted-foreground
                  "
                >
                  Matrícula {
                    aluno?.numeroMatricula ||
                    '—'
                  }
                </p>

              </div>

            </div>

            <div
              className="
                mt-4
                border-t
                border-border
                pt-4
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
                Curso
              </p>

              <p
                className="
                  mt-1
                  text-sm
                "
              >
                {
                  aluno?.nomeCurso ||
                  'Não informado'
                }
              </p>

            </div>

          </div>

        </section>


        <section
          className="
            mt-10
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
              md:flex-row
              md:items-end
              md:justify-between
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <CalendarDays
                  className="
                    size-5
                    text-primary
                  "
                />

                <h2
                  className="
                    font-semibold
                  "
                >
                  Período acadêmico
                </h2>

              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                A lista é atualizada conforme o período escolhido.
              </p>

            </div>


            <div
              className="
                w-full
                md:w-72
              "
            >

              <label
                htmlFor="periodo"
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                Selecionar período
              </label>

              <select
                id="periodo"
                className="campo"
                value={periodoSelecionado}
                onChange={trocarPeriodo}
                disabled={
                  carregandoPeriodo ||
                  periodos.length === 0
                }
              >

                {
                  periodos.map(
                    periodo => (

                      <option
                        key={
                          periodo.idPeriodo
                        }
                        value={
                          periodo.idPeriodo
                        }
                      >
                        {
                          periodo.nomePeriodo
                        }
                      </option>

                    )
                  )
                }

              </select>

            </div>

          </div>

        </section>


        {
          erro && (

            <div
              className="
                mt-6
                rounded-lg
                border
                border-destructive/30
                bg-destructive/10
                px-4
                py-3
                text-sm
                text-destructive
              "
            >
              {erro}
            </div>

          )
        }


        <section
          className="mt-8"
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
                  font-[family-name:var(--font-display)]
                  text-2xl
                  font-semibold
                "
              >
                Disciplinas matriculadas
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                {
                  disciplinas.length
                } disciplina(s) encontrada(s)
              </p>

            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                text-sm
                text-muted-foreground
                sm:flex
              "
            >

              <Layers3
                className="size-4"
              />

              Período selecionado

            </div>

          </div>


          {
            carregandoPeriodo
              ? (

                  <div
                    className="
                      mt-6
                      rounded-xl
                      border
                      border-border
                      bg-card
                      p-8
                      text-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Atualizando disciplinas...
                  </div>

                )
              : disciplinas.length === 0
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

                      <BookOpen
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
                        Nenhuma disciplina matriculada
                      </h3>

                      <p
                        className="
                          mx-auto
                          mt-2
                          max-w-lg
                          text-sm
                          text-muted-foreground
                        "
                      >
                        Não existem disciplinas com matrícula ativa
                        para o período acadêmico selecionado.
                      </p>

                    </div>

                  )
                : (

                    <div
                      className="
                        mt-6
                        grid
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-3
                      "
                    >

                      {
                        disciplinas.map(
                          disciplina => (

                            <article
                              key={
                                disciplina.idMatricula
                              }
                              className="
                                rounded-xl
                                border
                                border-border
                                bg-card
                                p-5
                                transition
                                hover:border-primary/30
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

                                <div>
                                  <button
                                    type="button"
                                    onClick={
                                      () =>
                                        navigate(
                                          `/sistema/aluno/disciplinas/${disciplina.idMatricula}/desempenho`
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
                                    Ver desempenho
                                  </button>

                                  <span
                                    className="
                                      inline-flex
                                      rounded-full
                                      border
                                      border-primary/25
                                      bg-primary/10
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-medium
                                      text-primary
                                    "
                                  >
                                    {
                                      disciplina.codDisciplina
                                    }
                                  </span>

                                  <h3
                                    className="
                                      mt-4
                                      text-lg
                                      font-semibold
                                    "
                                  >
                                    {
                                      disciplina.nomeDisciplina
                                    }
                                  </h3>

                                </div>

                                <GraduationCap
                                  className="
                                    size-5
                                    shrink-0
                                    text-muted-foreground
                                  "
                                />

                              </div>


                              <div
                                className="
                                  mt-5
                                  space-y-3
                                  border-t
                                  border-border
                                  pt-4
                                  text-sm
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                  "
                                >
                                  <span
                                    className="text-muted-foreground"
                                  >
                                    Tipo
                                  </span>

                                  <span>
                                    {
                                      formatarTipo(
                                        disciplina.tipoDisciplina
                                      )
                                    }
                                  </span>
                                </div>


                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                  "
                                >
                                  <span
                                    className="
                                      inline-flex
                                      items-center
                                      gap-2
                                      text-muted-foreground
                                    "
                                  >
                                    <Clock3
                                      className="size-4"
                                    />
                                    Carga horária
                                  </span>

                                  <span>
                                    {
                                      disciplina.cargaHoraria
                                    }h
                                  </span>
                                </div>


                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                  "
                                >
                                  <span
                                    className="
                                      inline-flex
                                      items-center
                                      gap-2
                                      text-muted-foreground
                                    "
                                  >
                                    <MapPin
                                      className="size-4"
                                    />
                                    Turma
                                  </span>

                                  <span
                                    className="
                                      text-right
                                    "
                                  >
                                    {
                                      disciplina.localTurma
                                    }
                                    {' · '}
                                    {
                                      formatarTurno(
                                        disciplina.turnoTurma
                                      )
                                    }
                                  </span>
                                </div>

                              </div>

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


export default AreaAluno
