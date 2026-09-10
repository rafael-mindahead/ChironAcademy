const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


function obterToken() {

  const token =
    sessionStorage.getItem('chiron_token')

  if (!token) {
    throw new Error('Usuário não autenticado.')
  }

  return token

}


// ======================================================
// CADASTRAR
// ======================================================

export async function cadastrarPeriodo(
  numeroPeriodo,
  nomePeriodo,
  idCurso
) {

  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/periodos`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        numeroPeriodo,
        nomePeriodo,
        idCurso
      })
    }
  )


  const data = await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível cadastrar o período.'
    )

  }


  return data

}


// ======================================================
// LISTAR
// ======================================================

export async function listarPeriodos() {

  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/periodos`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )


  const data = await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível carregar os períodos.'
    )

  }


  return data

}


// ======================================================
// BUSCAR POR ID
// ======================================================

export async function buscarPeriodo(
  idPeriodo
) {

  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/periodos/${idPeriodo}`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )


  const data = await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível buscar o período.'
    )

  }


  return data

}


// ======================================================
// ATUALIZAR
// ======================================================

export async function atualizarPeriodo(
  idPeriodo,
  numeroPeriodo,
  nomePeriodo,
  idCurso
) {

  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/periodos/${idPeriodo}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({
        numeroPeriodo,
        nomePeriodo,
        idCurso
      })
    }
  )


  const data = await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível atualizar o período.'
    )

  }


  return data

}


// ======================================================
// EXCLUIR
// ======================================================

export async function excluirPeriodo(
  idPeriodo
) {

  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/periodos/${idPeriodo}`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )


  const data = await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível excluir o período.'
    )

  }


  return data

}