const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


async function requisicao(
  caminho,
  opcoes = {}
) {

  const token =
    sessionStorage.getItem(
      'chiron_token'
    )


  if (!token) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }


  const resposta =
    await fetch(
      `${API_URL}${caminho}`,
      {
        ...opcoes,

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`,

          ...opcoes.headers
        }
      }
    )


  const dados =
    await resposta
      .json()
      .catch(() => ({}))


  if (!resposta.ok) {

    const erro =
      new Error(
        dados.message ||
        'Não foi possível realizar a operação.'
      )


    erro.status =
      resposta.status


    erro.codigo =
      dados.code


    throw erro
  }


  return dados
}


// ======================================================
// LISTAR
// ======================================================

export async function listarAvaliacoes(
  idProfessorTurma
) {

  const dados =
    await requisicao(
      `/api/professor/turmas/${idProfessorTurma}/avaliacoes`
    )


  return dados.avaliacoes || []
}


// ======================================================
// CRIAR
// ======================================================

export async function criarAvaliacao(
  idProfessorTurma,
  dadosAvaliacao
) {

  const dados =
    await requisicao(
      `/api/professor/turmas/${idProfessorTurma}/avaliacoes`,
      {
        method:
          'POST',

        body:
          JSON.stringify(
            dadosAvaliacao
          )
      }
    )


  return dados.avaliacao
}


// ======================================================
// ATUALIZAR
// ======================================================

export async function atualizarAvaliacao(
  idProfessorTurma,
  idAvaliacao,
  dadosAvaliacao
) {

  const dados =
    await requisicao(
      `/api/professor/turmas/${idProfessorTurma}/avaliacoes/${idAvaliacao}`,
      {
        method:
          'PUT',

        body:
          JSON.stringify(
            dadosAvaliacao
          )
      }
    )


  return dados.avaliacao
}


// ======================================================
// EXCLUIR
// ======================================================

export async function excluirAvaliacao(
  idProfessorTurma,
  idAvaliacao
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/avaliacoes/${idAvaliacao}`,
    {
      method:
        'DELETE'
    }
  )
}