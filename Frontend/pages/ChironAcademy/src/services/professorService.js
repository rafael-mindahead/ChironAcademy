const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


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
    const erro = new Error(
      dados.message || 'Não foi possível realizar a operaçãos.'
    )
    erro.codigo = dados.code
    throw erro
  }

  return dados
}

export async function listarProfessores() {
  const dados = await requisicao('/api/professores')
  return dados.professores
}

export async function criarProfessor(dados) {
  const resposta = await requisicao('/api/professores', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
  return resposta.professor
}

export async function atualizarProfessor(idProfessor, dados) {
  const resposta = await requisicao(`/api/professores/${idProfessor}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
  return resposta.professor
}

export async function excluirProfessor(idProfessor) {
  return requisicao(`/api/professores/${idProfessor}`, {
    method: 'DELETE'
  })
}
