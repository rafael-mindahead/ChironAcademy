const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


// ======================================================
// CADASTRO
// ======================================================

export async function cadastrarUsuario(
  email,
  senha
) {

  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        email,
        senha
      })
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível criar a conta.'
    )

  }


  return data
}


// ======================================================
// LOGIN
// ======================================================

export async function loginUsuario(
  email,
  senha
) {

  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        email,
        senha
      })
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível realizar o login.'
    )

  }


  return data
}


// ======================================================
// RECUPERAÇÃO
// ======================================================

export async function recuperarSenha(
  email,
  chaveRecuperacao,
  novaSenha
) {

  const response = await fetch(
    `${API_URL}/api/auth/recover`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        email,
        chaveRecuperacao,
        novaSenha
      })
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Não foi possível redefinir a senha.'
    )

  }


  return data
}


// ======================================================
// USUÁRIO AUTENTICADO
// ======================================================

export async function obterUsuarioAtual() {

  const token =
    sessionStorage.getItem(
      'chiron_token'
    )


  if (!token) {

    throw new Error(
      'Usuário não autenticado.'
    )

  }


  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {

      method: 'GET',

      headers: {

        Authorization:
          `Bearer ${token}`

      }

    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.message ||
      'Sessão inválida.'
    )

  }


  return data
}