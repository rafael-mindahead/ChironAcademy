import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Check, Eye, LoaderCircle, LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/chiron-logo.png'
import { atualizarDisciplina, criarDisciplina, excluirDisciplina, listarDisciplinas, listarOpcoesDisciplina } from '../../services/disciplinaService'

const vazio = { codDisciplina: '', nomeDisciplina: '', tipoDisciplina: 'OBRIGATORIA', cargaHoraria: '', idCurso: '', idPeriodo: '' }

function DisciplinasPage() {
  const navigate = useNavigate()
  const [disciplinas, setDisciplinas] = useState([])
  const [cursos, setCursos] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [estado, setEstado] = useState('carregando')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(null)
  const [selecionada, setSelecionada] = useState(null)
  const [formulario, setFormulario] = useState(vazio)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setEstado('carregando')
    try {
      const [lista, opcoes] = await Promise.all([listarDisciplinas(), listarOpcoesDisciplina()])
      setDisciplinas(lista); setCursos(opcoes.cursos); setPeriodos(opcoes.periodos); setEstado('sucesso')
    } catch { setEstado('erro') }
  }

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return disciplinas.filter((item) => !termo || item.codDisciplina.toLowerCase().includes(termo) || item.nomeDisciplina.toLowerCase().includes(termo) || item.nomeCurso.toLowerCase().includes(termo))
  }, [busca, disciplinas])

  function toast(texto) { setMensagem(texto); window.setTimeout(() => setMensagem(''), 3500) }
  function abrirNovo() { setFormulario({ ...vazio, idCurso: cursos[0]?.idCurso || '', idPeriodo: periodos[0]?.idPeriodo || '' }); setErro(''); setModal('formulario') }
  function abrirEdicao(item) { setFormulario({ ...item }); setErro(''); setModal('formulario') }
  function campo(nome, valor) { setFormulario((atual) => ({ ...atual, [nome]: valor })) }
  function sair() { sessionStorage.removeItem('chiron_token'); sessionStorage.removeItem('chiron_usuario'); navigate('/login', { replace: true }) }

  async function salvar(evento) {
    evento.preventDefault(); setSalvando(true); setErro('')
    try {
      if (formulario._modoEdicao) await atualizarDisciplina(formulario.codDisciplina, formulario)
      else await criarDisciplina(formulario)
      await carregar(); setModal(null); toast(formulario._modoEdicao ? 'Dados atualizados com sucesso.' : 'Disciplina cadastrada com sucesso.')
    } catch (error) { setErro(error.message) } finally { setSalvando(false) }
  }

  async function excluir() {
    setSalvando(true); setErro('')
    try { await excluirDisciplina(selecionada.codDisciplina); await carregar(); setModal(null); toast('Disciplina excluída com sucesso.') }
    catch (error) { setErro(error.message) } finally { setSalvando(false) }
  }

  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border/70"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"><img src={logo} alt="ChironAcademy" className="h-9 w-auto" /><button onClick={sair} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><LogOut className="size-4" /><span className="hidden sm:inline">Sair</span></button></div></header>
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 flex items-center gap-2 text-sm text-primary"><BookOpen className="size-4" />Cadastros acadêmicos</div><h1 className="font-[family-name:var(--font-display)] text-4xl">Disciplinas</h1><p className="mt-3 text-sm text-muted-foreground">Organize as disciplinas por curso e período acadêmico.</p></div><div className="flex flex-col gap-3 sm:flex-row"><button onClick={() => navigate('/sistema/gestor')} className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"><ArrowLeft className="size-4" />Voltar</button><button onClick={abrirNovo} className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"><Plus className="size-4" />Nova disciplina</button></div></div>
      <section className="rounded-xl border border-border bg-card"><div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Disciplinas cadastradas</h2><p className="mt-1 text-sm text-muted-foreground">{filtradas.length} registro(s) encontrado(s)</p></div><label className="relative sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por código ou nome" className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></label></div>
        {estado === 'carregando' && <Estado texto="Carregando disciplinas..." carregando />}{estado === 'erro' && <Estado texto="Não foi possível carregar as disciplinas." acao={carregar} />}{estado === 'sucesso' && filtradas.length === 0 && <Estado texto="Nenhuma disciplina encontrada." />}{estado === 'sucesso' && filtradas.length > 0 && <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead><tr className="border-b border-border bg-secondary/40 text-xs uppercase text-muted-foreground"><th className="px-5 py-4">Código / Disciplina</th><th className="px-5 py-4">Curso</th><th className="px-5 py-4">Período</th><th className="px-5 py-4">Tipo</th><th className="px-5 py-4">Carga</th><th className="px-5 py-4 text-right">Ações</th></tr></thead><tbody>{filtradas.map((item) => <tr key={item.codDisciplina} className="border-b border-border/70 last:border-0 hover:bg-secondary/20"><td className="px-5 py-4"><b>{item.codDisciplina}</b><p className="mt-1 text-sm text-muted-foreground">{item.nomeDisciplina}</p></td><td className="px-5 py-4 text-sm text-muted-foreground">{item.nomeCurso}</td><td className="px-5 py-4 text-sm text-muted-foreground">{item.nomePeriodo}</td><td className="px-5 py-4 text-sm">{item.tipoDisciplina === 'OBRIGATORIA' ? 'Obrigatória' : 'Optativa'}</td><td className="px-5 py-4 text-sm text-muted-foreground">{item.cargaHoraria}h</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Acao label="Visualizar" onClick={() => { setSelecionada(item); setModal('visualizar') }}><Eye className="size-4" /></Acao><Acao label="Editar" onClick={() => { setFormulario({ ...item, _modoEdicao: true }); setModal('formulario') }}><Pencil className="size-4" /></Acao><Acao label="Excluir" perigo onClick={() => { setSelecionada(item); setErro(''); setModal('excluir') }}><Trash2 className="size-4" /></Acao></div></td></tr>)}</tbody></table></div>}
      </section>
    </main>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">{modal === 'formulario' && <div className="w-full max-w-2xl rounded-xl border border-border bg-card"><Cabecalho titulo={formulario._modoEdicao ? 'Editar disciplina' : 'Nova disciplina'} fechar={() => setModal(null)} /><form onSubmit={salvar} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6"><Campo titulo="Código da disciplina"><input required disabled={formulario._modoEdicao} value={formulario.codDisciplina} onChange={(e) => campo('codDisciplina', e.target.value)} className="campo" placeholder="Ex.: ES-101" /></Campo><Campo titulo="Nome da disciplina"><input required value={formulario.nomeDisciplina} onChange={(e) => campo('nomeDisciplina', e.target.value)} className="campo" placeholder="Ex.: Banco de Dados" /></Campo><Campo titulo="Tipo"><select required value={formulario.tipoDisciplina} onChange={(e) => campo('tipoDisciplina', e.target.value)} className="campo"><option value="OBRIGATORIA">Obrigatória</option><option value="OPTATIVA">Optativa</option></select></Campo><Campo titulo="Carga horária"><input required type="number" min="1" value={formulario.cargaHoraria} onChange={(e) => campo('cargaHoraria', e.target.value)} className="campo" placeholder="Ex.: 80" /></Campo><Campo titulo="Curso"><select required value={formulario.idCurso} onChange={(e) => campo('idCurso', e.target.value)} className="campo">{cursos.map((item) => <option key={item.idCurso} value={item.idCurso}>{item.nomeCurso}</option>)}</select></Campo><Campo titulo="Período acadêmico"><select required value={formulario.idPeriodo} onChange={(e) => campo('idPeriodo', e.target.value)} className="campo">{periodos.filter((item) => String(item.idCurso) === String(formulario.idCurso)).map((item) => <option key={item.idPeriodo} value={item.idPeriodo}>{item.nomePeriodo}</option>)}</select></Campo>{erro && <p className="sm:col-span-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}<div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:col-span-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModal(null)} className="botao-secundario">Cancelar</button><button disabled={salvando} className="botao-principal">{salvando && <LoaderCircle className="size-4 animate-spin" />}<Check className="size-4" />Salvar disciplina</button></div></form></div>}{modal === 'visualizar' && <div className="w-full max-w-lg rounded-xl border border-border bg-card"><Cabecalho titulo="Dados da disciplina" fechar={() => setModal(null)} /><div className="grid gap-5 p-6 sm:grid-cols-2"><Detalhe titulo="Código" valor={selecionada.codDisciplina} /><Detalhe titulo="Nome" valor={selecionada.nomeDisciplina} /><Detalhe titulo="Curso" valor={selecionada.nomeCurso} /><Detalhe titulo="Período" valor={selecionada.nomePeriodo} /><Detalhe titulo="Tipo" valor={selecionada.tipoDisciplina === 'OBRIGATORIA' ? 'Obrigatória' : 'Optativa'} /><Detalhe titulo="Carga horária" valor={`${selecionada.cargaHoraria}h`} /></div></div>}{modal === 'excluir' && <div className="w-full max-w-md rounded-xl border border-border bg-card p-6"><Trash2 className="size-6 text-destructive" /><h2 className="mt-4 text-xl font-semibold">Excluir disciplina?</h2><p className="mt-2 text-sm text-muted-foreground">Tem certeza de que deseja excluir <b>{selecionada.nomeDisciplina}</b>?</p>{erro && <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}<div className="mt-6 flex justify-end gap-3"><button onClick={() => setModal(null)} className="botao-secundario">Cancelar</button><button onClick={excluir} disabled={salvando} className="botao-perigo">Excluir</button></div></div>}</div>}
    {mensagem && <div className="fixed bottom-5 right-5 z-50 rounded-md border border-primary/30 bg-card px-4 py-3 text-sm shadow-xl"><Check className="mr-2 inline size-4 text-primary" />{mensagem}</div>}
  </div>
}

function Campo({ titulo, children }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{titulo} *</span>{children}</label> }
function Cabecalho({ titulo, fechar }) { return <div className="flex items-center justify-between border-b border-border p-5"><h2 className="text-xl font-semibold">{titulo}</h2><button onClick={fechar} aria-label="Fechar"><X className="size-5" /></button></div> }
function Detalhe({ titulo, valor }) { return <div><p className="text-xs uppercase text-muted-foreground">{titulo}</p><p className="mt-2 text-sm font-medium">{valor}</p></div> }
function Estado({ texto, carregando, acao }) { return <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground">{carregando && <LoaderCircle className="size-7 animate-spin text-primary" />}<p>{texto}</p>{acao && <button onClick={acao} className="botao-secundario">Tentar novamente</button>}</div> }
function Acao({ children, label, onClick, perigo }) { return <button title={label} aria-label={label} onClick={onClick} className={`rounded-md p-2 text-muted-foreground hover:bg-secondary ${perigo ? 'hover:text-destructive' : 'hover:text-primary'}`}>{children}</button> }

export default DisciplinasPage
