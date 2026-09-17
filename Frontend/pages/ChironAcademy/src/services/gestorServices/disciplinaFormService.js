const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'


async function requisicao(caminho, opcoes = {}) {
  const token = sessionStorage.getItem('chiron_token')
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opcoes.headers
    }
  })
  const dados = await resposta.json().catch(() => ({}))
  if (!resposta.ok) {
    const erro = new Error(dados.message || 'Não foi possível realizar a operação.')
    erro.codigo = dados.code
    throw erro
  }
  return dados
}

export async function listarOpcoesDisciplina() {
  return requisicao('/api/disciplinas/opcoes')
}

export async function listarDisciplinas() {
  const dados = await requisicao('/api/disciplinas')
  return dados.disciplinas
}

export async function criarDisciplina(dados) {
  const resposta = await requisicao('/api/disciplinas', { method: 'POST', body: JSON.stringify(dados) })
  return resposta.disciplina
}

export async function atualizarDisciplina(codigo, dados) {
  const resposta = await requisicao(`/api/disciplinas/${encodeURIComponent(codigo)}`, { method: 'PUT', body: JSON.stringify(dados) })
  return resposta.disciplina
}

export async function excluirDisciplina(codigo) {
  return requisicao(`/api/disciplinas/${encodeURIComponent(codigo)}`, { method: 'DELETE' })
}
