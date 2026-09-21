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


    erro.codigo =
      dados.code


    erro.status =
      resposta.status


    throw erro

  }


  return dados

}


// ======================================================
// MINHAS TURMAS
// ======================================================

export async function listarMinhasTurmas() {

  return requisicao(
    '/api/professor/turmas'
  )

}


// ======================================================
// TURMA ESPECÍFICA
// ======================================================

export async function buscarMinhaTurma(
  idProfessorTurma
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}`
  )

}