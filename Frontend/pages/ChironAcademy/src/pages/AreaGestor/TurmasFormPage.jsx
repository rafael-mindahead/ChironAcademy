import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  atualizarTurma,
  criarTurma,
  excluirTurma,
  listarOpcoesTurma,
  listarTurmas
} from '../../services/turmaFormService'

const vazio = {
  localTurma: '',
  turnoTurma: 'MANHA',
  idCurso: ''
}

const nomesTurno = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite'
}

function TurmasPage() {
  const navigate = useNavigate()

  const [turmas, setTurmas] = useState([])
  const [cursos, setCursos] = useState([])
  const [estado, setEstado] = useState('carregando')
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null)
  const [turmaParaExcluir, setTurmaParaExcluir] = useState(null)
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
        listarTurmas(),
        listarOpcoesTurma()
      ])

      setTurmas(lista)
      setCursos(opcoes.cursos)
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
      idCurso: cursos[0]?.idCurso || ''
    })
    setTurmaEmEdicao(null)
    setErro('')
  }

  function handleEditar(turma) {
    setFormulario({
      ...turma,
      _modoEdicao: true
    })

    setTurmaEmEdicao(turma)

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
      if (turmaEmEdicao) {
        await atualizarTurma(turmaEmEdicao.idTurma, formulario)
      } else {
        await criarTurma(formulario)
      }

      await carregar()

      toast(
        turmaEmEdicao
          ? 'Dados atualizados com sucesso.'
          : 'Turma cadastrada com sucesso.'
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
      await excluirTurma(turmaParaExcluir.idTurma)

      await carregar()

      toast('Turma excluída com sucesso.')

      setTurmaParaExcluir(null)
    } catch (error) {
      setErro(error.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl">
              Turmas
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Cadastre e gerencie as turmas acadêmicas.
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
              {turmaEmEdicao ? 'Editar turma' : 'Cadastrar turma'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {turmaEmEdicao
                ? 'Altere os dados da turma e salve as mudanças.'
                : 'Preencha os dados para cadastrar uma nova turma.'}
            </p>
          </div>

          <form onSubmit={salvar} className="space-y-6">

            <div className="grid gap-5 md:grid-cols-2">

              <Campo titulo="Local da turma">
                <input
                  required
                  value={formulario.localTurma}
                  onChange={(e) => campo('localTurma', e.target.value)}
                  className="campo"
                  placeholder="Ex.: Sala 04"
                />
              </Campo>

              <Campo titulo="Turno">
                <select
                  required
                  value={formulario.turnoTurma}
                  onChange={(e) => campo('turnoTurma', e.target.value)}
                  className="campo"
                >
                  <option value="MANHA">Manhã</option>
                  <option value="TARDE">Tarde</option>
                  <option value="NOITE">Noite</option>
                </select>
              </Campo>

              <Campo titulo="Curso">
                <select
                  required
                  value={formulario.idCurso}
                  onChange={(e) => campo('idCurso', e.target.value)}
                  className="campo"
                >
                  <option value="">Selecione um curso</option>

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

              {turmaEmEdicao && (
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
                  : turmaEmEdicao
                    ? 'Atualizar turma'
                    : 'Cadastrar turma'}
              </button>

            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Turmas cadastradas
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {turmas.length} registro(s) encontrado(s)
              </p>
            </div>
          </div>

          {estado === 'carregando' && (
            <Estado texto="Carregando turmas..." carregando />
          )}

          {estado === 'erro' && (
            <Estado
              texto="Não foi possível carregar as turmas."
              acao={carregar}
            />
          )}

          {estado === 'sucesso' && turmas.length === 0 && (
            <Estado texto="Nenhuma turma encontrada." />
          )}

          {estado === 'sucesso' && turmas.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40 text-xs uppercase text-muted-foreground">
                      <th className="px-5 py-4">Local</th>
                      <th className="px-5 py-4">Turno</th>
                      <th className="px-5 py-4">Curso</th>
                      <th className="px-5 py-4 text-right">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {turmas.map((item) => (
                      <tr
                        key={item.idTurma}
                        className="border-b border-border/70 last:border-0 hover:bg-secondary/20"
                      >
                        <td className="px-5 py-4 font-medium">
                          {item.localTurma}
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {nomesTurno[item.turnoTurma]}
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {item.nomeCurso}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() => handleEditar(item)}
                              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setTurmaParaExcluir(item)
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

      {turmaParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">

            <h2 className="text-xl font-semibold">
              Excluir turma?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza de que deseja excluir{' '}
              <b>{turmaParaExcluir.localTurma}</b>?
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
                  setTurmaParaExcluir(null)
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
                {salvando ? 'Excluindo...' : 'Excluir'}
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

export default TurmasPage