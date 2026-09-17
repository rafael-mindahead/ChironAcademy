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

export async function listarOpcoesTurma() {
  return requisicao('/api/turmas/opcoes')
}

export async function listarTurmas() {
  const dados = await requisicao('/api/turmas')
  return dados.turmas
}

export async function criarTurma(dados) {
  const resposta = await requisicao('/api/turmas', { method: 'POST', body: JSON.stringify(dados) })
  return resposta.turma
}

export async function atualizarTurma(idTurma, dados) {
  const resposta = await requisicao(`/api/turmas/${idTurma}`, { method: 'PUT', body: JSON.stringify(dados) })
  return resposta.turma
}

export async function excluirTurma(idTurma) {
  return requisicao(`/api/turmas/${idTurma}`, { method: 'DELETE' })
}
