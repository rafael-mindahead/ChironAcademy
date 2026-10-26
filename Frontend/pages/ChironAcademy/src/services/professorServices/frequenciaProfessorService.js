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

    throw new Error(
      dados.message ||
      'Não foi possível realizar a operação.'
    )

  }


  return dados
}


// ======================================================
// AULAS
// ======================================================

export async function listarAulas(
  idProfessorTurma
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas`
  )

}


export async function criarAula(
  idProfessorTurma,
  dados
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas`,
    {
      method:
        'POST',

      body:
        JSON.stringify(
          dados
        )
    }
  )

}


export async function atualizarAula(
  idProfessorTurma,
  idAula,
  dados
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas/${idAula}`,
    {
      method:
        'PUT',

      body:
        JSON.stringify(
          dados
        )
    }
  )

}


export async function excluirAula(
  idProfessorTurma,
  idAula
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas/${idAula}`,
    {
      method:
        'DELETE'
    }
  )

}


// ======================================================
// FREQUÊNCIA
// ======================================================

export async function listarFrequencias(
  idProfessorTurma,
  idAula
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas/${idAula}/frequencias`
  )

}


export async function registrarFrequencia(
  idProfessorTurma,
  idAula,
  idMatricula,
  dados
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas/${idAula}/frequencias/${idMatricula}`,
    {
      method:
        'PUT',

      body:
        JSON.stringify(
          dados
        )
    }
  )

}


export async function excluirFrequencia(
  idProfessorTurma,
  idAula,
  idMatricula
) {

  return requisicao(
    `/api/professor/turmas/${idProfessorTurma}/aulas/${idAula}/frequencias/${idMatricula}`,
    {
      method:
        'DELETE'
    }
  )

}