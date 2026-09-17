const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'

function obterToken() {
  const token = sessionStorage.getItem('chiron_token')

  if (!token) {
    throw new Error('Usuário não autenticado.')
  }

  return token
}

// ======================================================
// CADASTRAR
// ======================================================

export async function cadastrarCurso(
  nomeCurso,
  modalidade,
  duracaoSemestres
) {
  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/cursos`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nomeCurso,
        modalidade,
        duracaoSemestres
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Não foi possível cadastrar o curso.'
    )
  }

  return data
}

// ======================================================
// LISTAR
// ======================================================



export async function listarCursos() {
  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/cursos`,
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
      'Não foi possível carregar os cursos.'
    )
  }

  return data
}

// ======================================================
// BUSCAR POR ID
// ======================================================

// esse bloco de código ele vai fazer a requisição para a API, enviando o id do curso que queremos buscar. Ele usa o método GET, que é o método HTTP usado para buscar recursos existentes.

export async function buscarCurso(idCurso) {
  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/cursos/${idCurso}`,
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
      'Não foi possível buscar o curso.'
    )
  }

  return data
}

// ======================================================
// ATUALIZAR
// ======================================================

export async function atualizarCurso(
  idCurso,
  nomeCurso,
  modalidade,
  duracaoSemestres
) {
  const token = obterToken()

  // teste para ver se realmente está recebendo os dados corretos 

  console.log({
    idCurso,
    nomeCurso,
    modalidade,
    duracaoSemestres
  })

  // esse bloco ele vai fazer a requisição para a API, enviando os dados do curso que queremos atualizar. Ele usa o método PUT, que é o método HTTP usado para atualizar recursos existentes.

  const response = await fetch(
    `${API_URL}/api/cursos/${idCurso}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nomeCurso,
        modalidade,
        duracaoSemestres
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Não foi possível atualizar o curso.'
    )
  }

  return data
}

// ======================================================
// EXCLUIR
// ======================================================

export async function excluirCurso(idCurso) {
  const token = obterToken()

  const response = await fetch(
    `${API_URL}/api/cursos/${idCurso}`,
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
      'Não foi possível excluir o curso.'
    )
  }

  return data
}