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

import AreaProfessor
  from './pages/AreaProfessor/AreaProfessor.jsx'

import AcessoNegado
  from './pages/AcessoNegado/AcessoNegado.jsx'

import ProtectedRoute
  from './components/ProtectedRoute/ProtectedRoute.jsx'

<<<<<<< Updated upstream
import CursosPage
  from './pages/Cursos/CursosPage.jsx'
=======
  import DisciplinasPage
  from './pages/Disciplinas/DisciplinasPage.jsx'

  import TurmasPage
    from './pages/Turmas/TurmasPage.jsx'

  import ProfessoresPage
    from './pages/Professores/ProfessoresPage.jsx'
>>>>>>> Stashed changes

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


        {/* PROFESSOR */}

        <Route
          path="/sistema/professor"

          element={
            <ProtectedRoute
              perfisPermitidos={[
                'PROFESSOR'
              ]}
            >
              <AreaProfessor />
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

        <Route
          path="/sistema/gestor/disciplinas"

          element={
            <ProtectedRoute
              perfisPermitidos={[
                'GESTOR'
              ]}
            >
              <DisciplinasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/turmas"

          element={
            <ProtectedRoute
              perfisPermitidos={[
                'GESTOR'
              ]}
            >
              <TurmasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/professores"

          element={
            <ProtectedRoute
              perfisPermitidos={[
                'GESTOR'
              ]}
            >
              <ProfessoresPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/cursos"

          element={
            <ProtectedRoute perfisPermitidos={['GESTOR']}>
              <CursosPage />
            </ProtectedRoute>
        }
        />

      </Routes>

    </BrowserRouter>

  )

}


export default App