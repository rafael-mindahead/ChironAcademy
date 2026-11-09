import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Layers3,
  School,
  UserRound,
  UsersRound
} from 'lucide-react'

import {
  useNavigate
} from 'react-router-dom'

import AreaInterna from '../AreaInterna/AreaInterna.jsx'


const gruposGestor = [
  {
    titulo: 'Estrutura acadêmica',
    descricao: 'Organize a oferta acadêmica.',
    opcoes: [
      {
        titulo: 'Cursos',
        descricao: 'Cadastre e organize os cursos da instituição.',
        rota: '/sistema/gestor/cursos',
        Icone: GraduationCap
      },
      {
        titulo: 'Períodos',
        descricao: 'Gerencie os períodos de cada curso.',
        rota: '/sistema/gestor/periodos',
        Icone: CalendarDays
      },
      {
        titulo: 'Disciplinas',
        descricao: 'Organize as disciplinas da matriz curricular.',
        rota: '/sistema/gestor/disciplinas',
        Icone: BookOpen
      },
      {
        titulo: 'Turmas',
        descricao: 'Cadastre e acompanhe as turmas ofertadas.',
        rota: '/sistema/gestor/turmas',
        Icone: School
      }
    ]
  },
  {
    titulo: 'Operação acadêmica',
    descricao: 'Mantenha as relações acadêmicas.',
    opcoes: [
      {
        titulo: 'Vínculos',
        descricao: 'Associe professores, turmas e disciplinas.',
        rota: '/sistema/gestor/vinculos',
        Icone: Layers3
      },
      {
        titulo: 'Matrículas',
        descricao: 'Matricule alunos em turmas e disciplinas.',
        rota: '/sistema/gestor/matriculas',
        Icone: ClipboardList
      }
    ]
  },
  {
    titulo: 'Pessoas',
    descricao: 'Acesse os cadastros da comunidade.',
    opcoes: [
      {
        titulo: 'Alunos',
        descricao: 'Consulte e mantenha os cadastros de alunos.',
        rota: '/sistema/gestor/alunos',
        Icone: UsersRound
      },
      {
        titulo: 'Professores',
        descricao: 'Consulte e mantenha os cadastros de professores.',
        rota: '/sistema/gestor/professores',
        Icone: UserRound
      }
    ]
  }
]


function AreaGestor() {

  const navigate =
    useNavigate()


  return (

    <AreaInterna mostrarResumoUsuario={false}>

      <div className="space-y-9">

        <section className="flex items-start gap-4 px-1 py-2 sm:items-center">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <School className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Área do gestor
            </p>
            <h1
              className="
                mt-1
                font-[family-name:var(--font-display)]
                text-3xl
                font-semibold
                tracking-tight
                sm:text-4xl
              "
            >
              Gestão acadêmica
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Indicadores e ferramentas para administrar a vida acadêmica da instituição.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="indicadores-heading"
          className="grid gap-4 lg:grid-cols-2"
        >
          <button
            type="button"
            onClick={() =>
              navigate('/sistema/gestor/indicadores')
            }
            className="
              group
              relative
              flex
              min-h-48
              w-full
              items-center
              justify-between
              gap-5
              overflow-hidden
              rounded-2xl
              border border-border
              bg-card
              p-6
              text-left
              transition
              hover:border-primary/50 hover:bg-secondary/30
              sm:p-8
            "
          >
            <span className="relative flex min-w-0 items-center gap-4 sm:gap-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary sm:size-16">
                <GraduationCap className="size-7" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Visão institucional
                </span>
                <span
                  id="indicadores-heading"
                  className="mt-1 block text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                >
                  Indicadores dos cursos
                </span>
                <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Explore matrículas, notas e frequências registradas. Compare cursos ou filtre por curso e período.
                </span>
              </span>
            </span>
            <span className="relative flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary sm:px-4 sm:py-3">
              Abrir painel
              <ArrowRight className="size-5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate('/sistema/gestor/rendimento')
            }
            className="
              group
              relative
              flex
              min-h-48
              w-full
              items-center
              justify-between
              gap-5
              overflow-hidden
              rounded-2xl
              border border-border
              bg-card
              p-6
              text-left
              transition
              hover:border-primary/50 hover:bg-secondary/30
              sm:p-8
            "
          >
            <span className="relative flex min-w-0 items-center gap-4 sm:gap-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary sm:size-16">
                <GraduationCap className="size-7" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  PBIs 20 e 21
                </span>
                <span className="mt-1 block text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Análise de rendimento
                </span>
                <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Compare cursos e disciplinas e identifique cenários de alto ou baixo rendimento.
                </span>
              </span>
            </span>
            <span className="relative flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition group-hover:border-primary/40 group-hover:text-primary sm:px-4 sm:py-3">
              Abrir análise
              <ArrowRight className="size-5" />
            </span>
          </button>
        </section>

        <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {
              gruposGestor.map(
                grupo => (
                  <section
                    key={grupo.titulo}
                    aria-labelledby={`grupo-${grupo.titulo}`}
                    className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
                  >
                    <div className="mb-5">
                      <h2
                        id={`grupo-${grupo.titulo}`}
                        className="text-lg font-semibold tracking-tight"
                      >
                        {grupo.titulo}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {grupo.descricao}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {
                        grupo.opcoes.map(
                          ({ titulo, descricao, rota, Icone }) => (
                            <button
                              key={rota}
                              type="button"
                              onClick={() =>
                                navigate(rota)
                              }
                              className="
                                group
                                flex
                                w-full
                                items-start
                                gap-3
                                rounded-xl
                                border border-border
                                bg-background/60
                                p-3
                                text-left
                                transition hover:border-primary/40 hover:bg-secondary/50
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-ring
                              "
                            >
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                <Icone className="size-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-foreground">
                                  {titulo}
                                </span>
                                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                  {descricao}
                                </span>
                              </span>
                              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                            </button>
                          )
                        )
                      }
                    </div>
                  </section>
                )
              )
            }
        </div>

      </div>

    </AreaInterna>

  )

}


export default AreaGestor
