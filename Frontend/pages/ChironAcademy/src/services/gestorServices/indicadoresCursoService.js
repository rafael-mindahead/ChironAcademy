const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


export async function consultarIndicadoresCursos(
  idCurso = null,
  idPeriodo = null
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
    idCurso !== null &&
    idCurso !== undefined
  ) {

    parametros.set(
      'idCurso',
      idCurso
    )

  }

  if (
    idPeriodo !== null &&
    idPeriodo !== undefined
  ) {

    parametros.set(
      'idPeriodo',
      idPeriodo
    )

  }


  const query =
    parametros.toString()


  const url =
    `${API_URL}/api/gestor/indicadores/cursos` +
    (
      query
        ? `?${query}`
        : ''
    )


  const resposta =
    await fetch(
      url,
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
      'Não foi possível consultar os indicadores dos cursos.'
    )

  }


  return dados

}