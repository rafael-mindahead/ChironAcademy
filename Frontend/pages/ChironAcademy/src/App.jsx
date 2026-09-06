import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'


import Home
  from './pages/Home/home.jsx'

import Login
  from './pages/Login/Login.jsx'

import Cadastro
  from './pages/Cadastro/Cadastro.jsx'

import RecuperarSenha
  from './pages/RecuperarSenha/RecuperarSenha.jsx'

import AreaInterna
  from './pages/AreaInterna/AreaInterna.jsx'

import ProtectedRoute
  from './components/ProtectedRoute/ProtectedRoute.jsx'


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* CADASTRO */}

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />


        {/* RECUPERAÇÃO */}

        <Route
          path="/esqueci-senha"
          element={<RecuperarSenha />}
        />


        {/* ÁREA PROTEGIDA */}

        <Route
          path="/sistema"
          element={
            <ProtectedRoute>

              <AreaInterna />

            </ProtectedRoute>
          }
        />


      </Routes>

    </BrowserRouter>

  )

}


export default App