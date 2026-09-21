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


    throw erro

  }


  return dados
}


// ======================================================
// LISTAR NOTAS DA AVALIAÇÃO
// ======================================================

export async function listarNotas(
  idProfessorTurma,
  idAvaliacao
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/avaliacoes/${idAvaliacao}/notas`
  )

}


// ======================================================
// REGISTRAR / ALTERAR NOTA
// ======================================================

export async function registrarNota(
  idProfessorTurma,
  idAvaliacao,
  idMatricula,
  dadosNota
) {

  const resposta =
    await requisicao(
      `/api/professor/turmas/${idProfessorTurma}/avaliacoes/${idAvaliacao}/notas/${idMatricula}`,
      {
        method:
          'PUT',

        body:
          JSON.stringify(
            dadosNota
          )
      }
    )


  return resposta.nota
}


// ======================================================
// REMOVER NOTA
// ======================================================

export async function excluirNota(
  idProfessorTurma,
  idAvaliacao,
  idMatricula
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/avaliacoes/${idAvaliacao}/notas/${idMatricula}`,
    {
      method:
        'DELETE'
    }
  )

}