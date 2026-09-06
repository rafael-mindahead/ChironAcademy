import { ArrowRight } from 'lucide-react'
import logo from '../../assets/chiron-logo.png'

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      {/* =========================
          CABEÇALHO
      ========================== */}
      <header className="border-b border-border/60">

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">

          <img
            src={logo}
            alt="ChironAcademy"
            className="h-10 w-auto"
          />

          <button
            type="button"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Acessar sistema
          </button>

        </div>

      </header>

      {/* =========================
          CONTEÚDO PRINCIPAL
      ========================== */}
      <main className="flex flex-1 items-center">

        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center md:py-28">

          <img
            src={logo}
            alt="Logo ChironAcademy"
            className="h-40 w-auto object-contain md:h-52"
          />

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Gestão acadêmica
          </p>

          <h1
            className="
              mt-5
              max-w-3xl
              font-[family-name:var(--font-display)]
              text-4xl
              leading-tight
              tracking-tight
              md:text-6xl
            "
          >
            A administração da sua instituição, organizada e sem ruído.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            O ChironAcademy reúne os cadastros e as rotinas acadêmicas em uma
            interface sóbria, rápida e consistente — feita para quem usa o
            sistema todos os dias.
          </p>

          <div className="mt-10">

            <button
              type="button"
              className="
                inline-flex
                items-center
                gap-2
                rounded-md
                bg-primary
                px-5
                py-2.5
                text-sm
                font-semibold
                text-primary-foreground
                transition-colors
                hover:opacity-90
              "
            >
              Entrar

              <ArrowRight className="size-4" />

            </button>

          </div>

        </section>

      </main>

      {/* =========================
          RODAPÉ
      ========================== */}
      <footer className="border-t border-border/60">

        <div className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-muted-foreground">
          ChironAcademy — sistema de gestão acadêmica.
        </div>

      </footer>

    </div>
  )
}

export default Home