import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  ArrowLeft,
  Check,
  Eye,
  LoaderCircle,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
  UsersRound,
  X
} from 'lucide-react'

import {
  useNavigate
} from 'react-router-dom'

import logo
  from '../../assets/chiron-logo.png'

import {
  atualizarProfessor,
  criarProfessor,
  excluirProfessor,
  listarProfessores
} from '../../services/professorService'


const professorVazio = {
  nome: '',
  telefone: '',
  email: ''
}


function ProfessoresPage() {

  const navigate = useNavigate()

  const [professores, setProfessores] = useState([])
  const [estado, setEstado] = useState('carregando')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(null)
  const [professorSelecionado, setProfessorSelecionado] = useState(null)
  const [formulario, setFormulario] = useState(professorVazio)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarProfessores()
  }, [])

  async function carregarProfessores() {
    setEstado('carregando')
    setErro('')

    try {
      const lista = await listarProfessores()
      setProfessores(lista)
      setEstado('sucesso')
    } catch {
      setEstado('erro')
      setErro('Não foi possível carregar os professores.')
    }
  }

  const professoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    if (!termo) {
      return professores
    }

    return professores.filter((professor) =>
      professor.nome.toLowerCase().includes(termo) ||
      professor.email.toLowerCase().includes(termo)
    )
  }, [busca, professores])

  function exibirMensagem(texto, tipo = 'sucesso') {
    setMensagem({ texto, tipo })
    window.setTimeout(() => setMensagem(''), 3500)
  }

  function abrirCadastro() {
    setFormulario(professorVazio)
    setErro('')
    setModal('formulario')
  }

  function abrirEdicao(professor) {
    setFormulario({
      nome: professor.nome,
      telefone: professor.telefone,
      email: professor.email,
      idProfessor: professor.idProfessor
    })
    setErro('')
    setModal('formulario')
  }

  function abrirVisualizacao(professor) {
    setProfessorSelecionado(professor)
    setModal('visualizacao')
  }

  function abrirExclusao(professor) {
    setProfessorSelecionado(professor)
    setErro('')
    setModal('exclusao')
  }

  function fecharModal() {
    if (!salvando) {
      setModal(null)
      setErro('')
    }
  }

  function atualizarCampo(campo, valor) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor
    }))
  }

  async function salvarProfessor(evento) {
    evento.preventDefault()
    setSalvando(true)
    setErro('')

    try {
      if (formulario.idProfessor) {
        await atualizarProfessor(formulario.idProfessor, formulario)
        exibirMensagem('Dados atualizados com sucesso.')
      } else {
        await criarProfessor(formulario)
        exibirMensagem('Professor cadastrado com sucesso.')
      }

      await carregarProfessores()
      setModal(null)
    } catch (error) {
      setErro(error.message || 'Não foi possível realizar a operação.')
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    setSalvando(true)
    setErro('')

    try {
      await excluirProfessor(professorSelecionado.idProfessor)
      await carregarProfessores()
      setModal(null)
      exibirMensagem('Professor excluído com sucesso.')
    } catch (error) {
      setErro(error.message || 'Não foi possível excluir o professor.')
    } finally {
      setSalvando(false)
    }
  }

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
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-primary">
              <UsersRound className="size-4" />
              <span>Cadastros acadêmicos</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">Professores</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Mantenha os dados do corpo docente atualizados para permitir seus vínculos com turmas e disciplinas.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/sistema/gestor')} className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
              <ArrowLeft className="size-4" />
              Voltar
            </button>
            <button type="button" onClick={abrirCadastro} className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              <Plus className="size-4" />
              Novo professor
            </button>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-base font-semibold">Corpo docente</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {professoresFiltrados.length} professor{professoresFiltrados.length === 1 ? '' : 'es'} encontrado{professoresFiltrados.length === 1 ? '' : 's'}
              </p>
            </div>
            <label className="relative block w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Buscar por nome ou e-mail" className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary" />
            </label>
          </div>

          {estado === 'carregando' && <StateMessage loading text="Carregando professores..." />}
          {estado === 'erro' && <StateMessage text={erro} action={carregarProfessores} />}
          {estado === 'sucesso' && professoresFiltrados.length === 0 && <StateMessage text="Nenhum professor encontrado." />}
          {estado === 'sucesso' && professoresFiltrados.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Nome</th>
                    <th className="px-5 py-4 font-medium">Telefone</th>
                    <th className="px-5 py-4 font-medium">E-mail</th>
                    <th className="px-5 py-4 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {professoresFiltrados.map((professor) => (
                    <tr key={professor.idProfessor} className="border-b border-border/70 last:border-0 hover:bg-secondary/20">
                      <td className="px-5 py-4 font-medium">{professor.nome}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{professor.telefone}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{professor.email}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton label="Visualizar" onClick={() => abrirVisualizacao(professor)}><Eye className="size-4" /></ActionButton>
                          <ActionButton label="Editar" onClick={() => abrirEdicao(professor)}><Pencil className="size-4" /></ActionButton>
                          <ActionButton label="Excluir" danger onClick={() => abrirExclusao(professor)}><Trash2 className="size-4" /></ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modal && <ModalOverlay>
        {modal === 'formulario' && (
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
            <ModalHeader title={formulario.idProfessor ? 'Editar professor' : 'Novo professor'} onClose={fecharModal} />
            <form onSubmit={salvarProfessor} className="space-y-5 p-5 sm:p-6">
              <Field label="Nome" required>
                <input required value={formulario.nome} onChange={(evento) => atualizarCampo('nome', evento.target.value)} placeholder="Nome completo" className="field-input" />
              </Field>
              <Field label="Telefone" required>
                <input required value={formulario.telefone} onChange={(evento) => atualizarCampo('telefone', evento.target.value)} placeholder="(41) 90000-0000" className="field-input" />
              </Field>
              <Field label="E-mail" required>
                <input required type="email" value={formulario.email} onChange={(evento) => atualizarCampo('email', evento.target.value)} placeholder="nome@chironacademy.edu" className="field-input" />
              </Field>
              {erro && <FeedbackError text={erro} />}
              <ModalFooter onCancel={fecharModal} loading={salvando} submitText="Salvar professor" />
            </form>
          </div>
        )}

        {modal === 'visualizacao' && professorSelecionado && (
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
            <ModalHeader title="Dados do professor" onClose={fecharModal} />
            <div className="space-y-5 p-5 sm:p-6">
              <Detail label="Nome" value={professorSelecionado.nome} />
              <Detail label="Telefone" value={professorSelecionado.telefone} />
              <Detail label="E-mail" value={professorSelecionado.email} />
              <div className="flex justify-end border-t border-border pt-5">
                <button type="button" onClick={fecharModal} className="rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary">Fechar</button>
              </div>
            </div>
          </div>
        )}

        {modal === 'exclusao' && professorSelecionado && (
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive"><Trash2 className="size-5" /></div>
            <h2 className="mt-5 text-xl font-semibold">Excluir professor?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Tem certeza de que deseja excluir <strong className="font-medium text-foreground">{professorSelecionado.nome}</strong>?</p>
            {erro && <FeedbackError text={erro} />}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={fecharModal} disabled={salvando} className="rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary">Cancelar</button>
              <button type="button" onClick={confirmarExclusao} disabled={salvando} className="flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-60">
                {salvando && <LoaderCircle className="size-4 animate-spin" />}
                Excluir professor
              </button>
            </div>
          </div>
        )}
      </ModalOverlay>}

      {mensagem && <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-2 rounded-md border border-primary/30 bg-card px-4 py-3 text-sm shadow-xl"><Check className="size-4 text-primary" />{mensagem.texto}</div>}
    </div>
  )
}

function ModalOverlay({ children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">{children}</div>
}

function ModalHeader({ title, onClose }) {
  return <div className="flex items-center justify-between border-b border-border p-5 sm:p-6"><h2 className="text-xl font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="Fechar" className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="size-5" /></button></div>
}

function ModalFooter({ onCancel, loading, submitText }) {
  return <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} disabled={loading} className="rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary">Cancelar</button><button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">{loading && <LoaderCircle className="size-4 animate-spin" />}<Check className="size-4" />{submitText}</button></div>
}

function Field({ label, required, children }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}{required && <span className="ml-1 text-primary">*</span>}</span>{children}</label>
}

function Detail({ label, value }) {
  return <div><p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</p><p className="mt-2 text-sm font-medium">{value}</p></div>
}

function FeedbackError({ text }) {
  return <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{text}</p>
}

function StateMessage({ loading = false, text, action }) {
  return <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center text-sm text-muted-foreground">{loading ? <LoaderCircle className="mb-3 size-7 animate-spin text-primary" /> : <UsersRound className="mb-3 size-8" />}<p>{text}</p>{action && <button type="button" onClick={action} className="mt-4 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary">Tentar novamente</button>}</div>
}

function ActionButton({ children, label, onClick, danger = false }) {
  return <button type="button" onClick={onClick} title={label} aria-label={label} className={`rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground ${danger ? 'hover:bg-destructive/10 hover:text-destructive' : ''}`}>{children}</button>
}


export default ProfessoresPage
