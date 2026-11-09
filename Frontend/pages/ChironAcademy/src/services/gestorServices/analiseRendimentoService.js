const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


export async function consultarAnaliseRendimento(
  numeroPeriodo = null
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


  const parametros =
    new URLSearchParams()


  if (
    numeroPeriodo !== null &&
    numeroPeriodo !== undefined &&
    numeroPeriodo !== ''
  ) {

    parametros.set(
      'numeroPeriodo',
      numeroPeriodo
    )

  }


  const query =
    parametros.toString()


  const resposta =
    await fetch(
      `${API_URL}/api/gestor/indicadores/cursos/rendimento${query ? `?${query}` : ''}`,
      {
        headers: {
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

    throw new Error(
      dados.message ||
      'Não foi possível consultar a análise de rendimento.'
    )

  }


  return dados

}
