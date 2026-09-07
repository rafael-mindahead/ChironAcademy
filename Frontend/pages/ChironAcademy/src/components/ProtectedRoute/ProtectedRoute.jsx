import { Navigate } from 'react-router-dom'


function ProtectedRoute({
  children,
  perfisPermitidos = []
}) {

  const token =
    sessionStorage.getItem('chiron_token')


  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  const usuarioSalvo =
    sessionStorage.getItem('chiron_usuario')


  if (!usuarioSalvo) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  let usuario


  try {

    usuario =
      JSON.parse(usuarioSalvo)

  } catch {

    sessionStorage.removeItem('chiron_token')
    sessionStorage.removeItem('chiron_usuario')

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  if (
    perfisPermitidos.length > 0 &&
    !perfisPermitidos.includes(usuario.perfil)
  ) {

    return (
      <Navigate
        to="/acesso-negado"
        replace
      />
    )

  }


  return children
}


export default ProtectedRoute