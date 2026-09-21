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


    throw erro

  }


  return dados

}


// ======================================================
// OPÇÕES
// ======================================================

export async function listarOpcoesMatricula() {

  return requisicao(
    '/api/matriculas/opcoes'
  )

}


// ======================================================
// LISTAR
// ======================================================

export async function listarMatriculas() {

  const dados =
    await requisicao(
      '/api/matriculas'
    )


  return (
    dados.matriculas ||
    []
  )

}


// ======================================================
// BUSCAR
// ======================================================

export async function buscarMatricula(
  idMatricula
) {

  const dados =
    await requisicao(
      `/api/matriculas/${idMatricula}`
    )


  return dados.matricula

}


// ======================================================
// CRIAR
// ======================================================

export async function criarMatricula(
  dados
) {

  const resposta =
    await requisicao(
      '/api/matriculas',
      {

        method:
          'POST',

        body:
          JSON.stringify(
            dados
          )

      }
    )


  return resposta.matricula

}


// ======================================================
// ATUALIZAR
// ======================================================

export async function atualizarMatricula(
  idMatricula,
  dados
) {

  const resposta =
    await requisicao(
      `/api/matriculas/${idMatricula}`,
      {

        method:
          'PUT',

        body:
          JSON.stringify(
            dados
          )

      }
    )


  return resposta.matricula

}


// ======================================================
// EXCLUIR
// ======================================================

export async function excluirMatricula(
  idMatricula
) {

  return requisicao(
    `/api/matriculas/${idMatricula}`,
    {
      method:
        'DELETE'
    }
  )

}