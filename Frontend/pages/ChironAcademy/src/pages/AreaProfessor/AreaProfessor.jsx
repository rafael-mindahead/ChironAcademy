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
  UsersRound
} from 'lucide-react'

import {
  useNavigate
} from 'react-router-dom'

import {
  Link
} from 'react-router-dom'

import logo
  from '../../assets/chiron-logo.png'

import {
  validarAcessoProfessor
} from '../../services/authService'

function AreaProfessor({ modoGestor = false }) {

  return modoGestor
    ? <GestorDashboard />
    : <ProfessorDashboard />
}


function GestorDashboard() {

  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('chiron_token')
    sessionStorage.removeItem('chiron_usuario')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <img src={logo} alt="ChironAcademy" className="h-9 w-auto" />
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <p className="text-sm text-primary">Área do gestor acadêmico</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl">Cadastros acadêmicos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Acesse os cadastros da Sprint 1 para organizar a estrutura acadêmica.</p>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProfessorAreaItem icon={<UsersRound className="size-5" />} title="Cadastrar professores" description="Mantenha os dados do corpo docente." to="/sistema/gestor/professores" />
            <ProfessorAreaItem icon={<BookOpen className="size-5" />} title="Disciplinas" description="Organize disciplinas por curso e período em breve." to="/sistema/gestor/disciplinas" />
            <ProfessorAreaItem icon={<ClipboardCheck className="size-5" />} title="Turmas" description="Organize as turmas da instituição em breve." to="/sistema/gestor/turmas" />
          </section>
        </section>
      </main>
    </div>
  )
}


function ProfessorDashboard() {

  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [estado, setEstado] = useState('carregando')
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function validarPerfil() {
      try {
        const resposta = await validarAcessoProfessor()
        setUsuario(resposta.usuario)
        setEstado('sucesso')
      } catch (error) {
        sessionStorage.removeItem('chiron_token')
        sessionStorage.removeItem('chiron_usuario')
        setErro(error.message)
        setEstado('erro')
      }
    }

    validarPerfil()
  }, [])

  function handleLogout() {
    sessionStorage.removeItem('chiron_token')
    sessionStorage.removeItem('chiron_usuario')
    navigate('/login', { replace: true })
  }

  if (estado === 'carregando') {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Validando acesso de professor...</div>
  }

  if (estado === 'erro') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
        <div>
          <p className="text-sm text-destructive">{erro || 'Acesso não autorizado.'}</p>
          <button type="button" onClick={() => navigate('/login', { replace: true })} className="mt-5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Ir para o login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <img src={logo} alt="ChironAcademy" className="h-9 w-auto" />
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="size-6" /></div>
            <div>
              <p className="text-sm text-primary">Área do professor</p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl">Minhas turmas</h1>
              <p className="mt-2 text-sm text-muted-foreground">{usuario?.email}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background px-6 text-center">
              <BookOpen className="mb-3 size-8 text-muted-foreground" />
              <h2 className="font-medium">Nenhuma turma vinculada.</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">As turmas sob sua responsabilidade aparecerão aqui quando os vínculos acadêmicos forem cadastrados.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProfessorAreaItem icon={<UsersRound className="size-5" />} title="Alunos" />
          <ProfessorAreaItem icon={<ClipboardCheck className="size-5" />} title="Avaliações" />
          <ProfessorAreaItem icon={<FileText className="size-5" />} title="Notas" />
          <ProfessorAreaItem icon={<ClipboardCheck className="size-5" />} title="Frequência" />
        </section>
      </main>
    </div>
  )
}


function ProfessorAreaItem({ icon, title, description, to }) {
  return (
    <Link to={to || '#'} className="rounded-lg border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary/40">
      <div className="flex items-center gap-3 text-primary">
        {icon}
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{description || 'Disponível ao acessar uma turma.'}</p>
    </Link>
  )
}


export default AreaProfessor