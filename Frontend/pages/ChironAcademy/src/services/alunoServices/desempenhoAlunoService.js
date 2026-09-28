const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


async function requisicao(
  caminho
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
        headers: {

          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`

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
        'Não foi possível consultar o desempenho.'
      )


    erro.status =
      resposta.status


    throw erro

  }


  return dados

}


export async function consultarDesempenhoDisciplina(
  idMatricula
) {

  return requisicao(
    `/api/aluno/disciplinas/${idMatricula}/desempenho`
  )

}