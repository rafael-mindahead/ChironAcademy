import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  atualizarDisciplina,
  criarDisciplina,
  excluirDisciplina,
  listarDisciplinas,
  listarOpcoesDisciplina
} from '../../services/disciplinaFormService'

const vazio = {
  codDisciplina: '',
  nomeDisciplina: '',
  tipoDisciplina: 'OBRIGATORIA',
  cargaHoraria: '',
  idCurso: '',
  idPeriodo: ''
}

function DisciplinasPage() {
  const navigate = useNavigate()

  const [disciplinas, setDisciplinas] = useState([])
  const [cursos, setCursos] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [estado, setEstado] = useState('carregando')

  const [disciplinaEmEdicao, setDisciplinaEmEdicao] = useState(null)
  const [disciplinaParaExcluir, setDisciplinaParaExcluir] = useState(null)

  const [formulario, setFormulario] = useState(vazio)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setEstado('carregando')

    try {
      const [lista, opcoes] = await Promise.all([
        listarDisciplinas(),
        listarOpcoesDisciplina()
      ])

      setDisciplinas(lista)
      setCursos(opcoes.cursos)
      setPeriodos(opcoes.periodos)
      setEstado('sucesso')
    } catch {
      setEstado('erro')
    }
  }

  function toast(texto) {
    setMensagem(texto)
    window.setTimeout(() => setMensagem(''), 3500)
  }

  function campo(nome, valor) {
    setFormulario((atual) => ({
      ...atual,
      [nome]: valor
    }))
  }

  function limparFormulario() {
    setFormulario({
      ...vazio,
      idCurso: cursos[0]?.idCurso || '',
      idPeriodo: periodos.find(
        (item) =>
          String(item.idCurso) === String(cursos[0]?.idCurso)
      )?.idPeriodo || ''
    })

    setDisciplinaEmEdicao(null)
    setErro('')
  }

  function handleEditar(disciplina) {
    setFormulario({
      ...disciplina,
      _modoEdicao: true
    })

    setDisciplinaEmEdicao(disciplina)
    setErro('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function salvar(evento) {
    evento.preventDefault()

    setSalvando(true)
    setErro('')

    try {
      if (disciplinaEmEdicao) {
        await atualizarDisciplina(
          disciplinaEmEdicao.codDisciplina,
          formulario
        )
      } else {
        await criarDisciplina(formulario)
      }

      await carregar()

      toast(
        disciplinaEmEdicao
          ? 'Dados atualizados com sucesso.'
          : 'Disciplina cadastrada com sucesso.'
      )

      limparFormulario()
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    setSalvando(true)
    setErro('')

    try {
      await excluirDisciplina(
        disciplinaParaExcluir.codDisciplina
      )

      await carregar()

      toast('Disciplina excluída com sucesso.')

      setDisciplinaParaExcluir(null)
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  const periodosDoCurso = periodos.filter(
    (item) =>
      String(item.idCurso) === String(formulario.idCurso)
  )

  return (
    <div className="min-h-screen bg-background px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl">
              Disciplinas
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Cadastre e gerencie as disciplinas acadêmicas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/sistema/gestor')}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            ← Voltar ao menu
          </button>
        </div>

        <section className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {disciplinaEmEdicao
                ? 'Editar disciplina'
                : 'Cadastrar disciplina'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {disciplinaEmEdicao
                ? 'Altere os dados da disciplina e salve as mudanças.'
                : 'Preencha os dados para cadastrar uma nova disciplina.'}
            </p>
          </div>

          <form
            onSubmit={salvar}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">

              <Campo titulo="Código da disciplina">
                <input
                  required
                  disabled={Boolean(disciplinaEmEdicao)}
                  value={formulario.codDisciplina}
                  onChange={(e) =>
                    campo('codDisciplina', e.target.value)
                  }
                  className="campo"
                  placeholder="Ex.: ES-101"
                />
              </Campo>

              <Campo titulo="Nome da disciplina">
                <input
                  required
                  value={formulario.nomeDisciplina}
                  onChange={(e) =>
                    campo('nomeDisciplina', e.target.value)
                  }
                  className="campo"
                  placeholder="Ex.: Banco de Dados"
                />
              </Campo>

              <Campo titulo="Tipo">
                <select
                  required
                  value={formulario.tipoDisciplina}
                  onChange={(e) =>
                    campo('tipoDisciplina', e.target.value)
                  }
                  className="campo"
                >
                  <option value="OBRIGATORIA">
                    Obrigatória
                  </option>

                  <option value="OPTATIVA">
                    Optativa
                  </option>
                </select>
              </Campo>

              <Campo titulo="Carga horária">
                <input
                  required
                  type="number"
                  min="1"
                  value={formulario.cargaHoraria}
                  onChange={(e) =>
                    campo('cargaHoraria', e.target.value)
                  }
                  className="campo"
                  placeholder="Ex.: 80"
                />
              </Campo>

              <Campo titulo="Curso">
                <select
                  required
                  value={formulario.idCurso}
                  onChange={(e) => {
                    const novoCurso = e.target.value

                    campo('idCurso', novoCurso)

                    const primeiroPeriodo =
                      periodos.find(
                        (item) =>
                          String(item.idCurso) ===
                          String(novoCurso)
                      )

                    campo(
                      'idPeriodo',
                      primeiroPeriodo?.idPeriodo || ''
                    )
                  }}
                  className="campo"
                >
                  <option value="">
                    Selecione um curso
                  </option>

                  {cursos.map((item) => (
                    <option
                      key={item.idCurso}
                      value={item.idCurso}
                    >
                      {item.nomeCurso}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo titulo="Período acadêmico">
                <select
                  required
                  value={formulario.idPeriodo}
                  onChange={(e) =>
                    campo('idPeriodo', e.target.value)
                  }
                  className="campo"
                >
                  <option value="">
                    Selecione um período
                  </option>

                  {periodosDoCurso.map((item) => (
                    <option
                      key={item.idPeriodo}
                      value={item.idPeriodo}
                    >
                      {item.nomePeriodo}
                    </option>
                  ))}
                </select>
              </Campo>

            </div>

            {erro && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {erro}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={limparFormulario}
                className="botao-secundario"
              >
                Redefinir
              </button>

              {disciplinaEmEdicao && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="botao-secundario"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                disabled={salvando}
                className="botao-principal"
              >
                {salvando
                  ? 'Salvando...'
                  : disciplinaEmEdicao
                    ? 'Atualizar disciplina'
                    : 'Cadastrar disciplina'}
              </button>

            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Disciplinas cadastradas
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {disciplinas.length} registro(s) encontrado(s)
              </p>
            </div>
          </div>

          {estado === 'carregando' && (
            <Estado
              texto="Carregando disciplinas..."
              carregando
            />
          )}

          {estado === 'erro' && (
            <Estado
              texto="Não foi possível carregar as disciplinas."
              acao={carregar}
            />
          )}

          {estado === 'sucesso' &&
            disciplinas.length === 0 && (
              <Estado
                texto="Nenhuma disciplina encontrada."
              />
            )}

          {estado === 'sucesso' &&
            disciplinas.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40 text-xs uppercase text-muted-foreground">
                        <th className="px-5 py-4">
                          Código / Disciplina
                        </th>

                        <th className="px-5 py-4">
                          Curso
                        </th>

                        <th className="px-5 py-4">
                          Período
                        </th>

                        <th className="px-5 py-4">
                          Tipo
                        </th>

                        <th className="px-5 py-4">
                          Carga
                        </th>

                        <th className="px-5 py-4 text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {disciplinas.map((item) => (
                        <tr
                          key={item.codDisciplina}
                          className="border-b border-border/70 last:border-0 hover:bg-secondary/20"
                        >
                          <td className="px-5 py-4">
                            <b>{item.codDisciplina}</b>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.nomeDisciplina}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {item.nomeCurso}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {item.nomePeriodo}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {item.tipoDisciplina ===
                            'OBRIGATORIA'
                              ? 'Obrigatória'
                              : 'Optativa'}
                          </td>

                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {item.cargaHoraria}h
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditar(item)
                                }
                                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setDisciplinaParaExcluir(item)
                                  setErro('')
                                }}
                                className="rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                              >
                                Excluir
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </section>

      </div>

      {disciplinaParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">

            <h2 className="text-xl font-semibold">
              Excluir disciplina?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza de que deseja excluir{' '}
              <b>
                {disciplinaParaExcluir.nomeDisciplina}
              </b>
              ?
            </p>

            {erro && (
              <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {erro}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setDisciplinaParaExcluir(null)
                  setErro('')
                }}
                className="botao-secundario"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={salvando}
                className="botao-perigo"
              >
                {salvando
                  ? 'Excluindo...'
                  : 'Excluir'}
              </button>

            </div>
          </div>
        </div>
      )}

      {mensagem && (
        <div
          className="fixed bottom-5 right-5 z-50 rounded-md border border-primary/30 bg-card px-4 py-3 text-sm shadow-xl"
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: 'var(--color-primary)'
          }}
        >
          {mensagem}
        </div>
      )}

    </div>
  )
}

function Campo({ titulo, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {titulo} *
      </span>

      {children}
    </label>
  )
}

function Estado({ texto, carregando, acao }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">

      {carregando && (
        <div className="animate-pulse text-primary">
          Carregando...
        </div>
      )}

      <p>{texto}</p>

      {acao && (
        <button
          type="button"
          onClick={acao}
          className="botao-secundario"
        >
          Tentar novamente
        </button>
      )}

    </div>
  )
}

export default DisciplinasPage