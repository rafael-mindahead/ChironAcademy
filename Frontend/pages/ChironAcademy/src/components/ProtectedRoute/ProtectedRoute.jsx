import {
  Navigate
} from 'react-router-dom'


function ProtectedRoute({
  children
}) {

  const token =
    sessionStorage.getItem(
      'chiron_token'
    )


  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  return children

}


export default ProtectedRoute