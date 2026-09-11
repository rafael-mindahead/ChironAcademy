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

import AreaAluno
  from './pages/AreaAluno/AreaAluno.jsx'



import AcessoNegado
  from './pages/AcessoNegado/AcessoNegado.jsx'

import ProtectedRoute
  from './components/ProtectedRoute/ProtectedRoute.jsx'



function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PÚBLICAS */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/esqueci-senha"
          element={<RecuperarSenha />}
        />

        <Route
          path="/acesso-negado"
          element={<AcessoNegado />}
        />


        {/* INTERNA GENÉRICA */}

        <Route
          path="/sistema"

          element={
            <ProtectedRoute>
              <AreaInterna />
            </ProtectedRoute>
          }
        />


        {/* ALUNO */}

        <Route
          path="/sistema/aluno"

          element={
            <ProtectedRoute
              perfisPermitidos={[
                'ALUNO'
              ]}
            >
              <AreaAluno />
            </ProtectedRoute>
          }
        />





        {/* GESTOR */}

        <Route
          path="/sistema/gestor"

          element={
            <ProtectedRoute
              perfisPermitidos={[
                'GESTOR'
              ]}
            >
              <AreaProfessor
                modoGestor
              />
            </ProtectedRoute>
          }
        />


   
   
      </Routes>

    </BrowserRouter>

  )

}


export default App