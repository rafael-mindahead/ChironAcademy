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

import AreaGestor
  from './pages/AreaGestor/AreaGestor.jsx'

import AcessoNegado
  from './pages/AcessoNegado/AcessoNegado.jsx'

import ProtectedRoute
  from './components/ProtectedRoute/ProtectedRoute.jsx'

import CursosPage
  from './pages/AreaGestor/CursosFormPage.jsx'

import DisciplinasPage
  from './pages/AreaGestor/DisciplinasFormPage.jsx'

import PeriodosPage
  from './pages/AreaGestor/PeriodosFormPage.jsx'

import AlunosPage
  from './pages/AreaGestor/AlunosFormPage.jsx'

import ProfessoresFormPage
    from './pages/AreaGestor/ProfessoresFormPage.jsx'

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
              <AreaGestor />
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

        <Route
          path="/sistema/gestor/periodos"
          element={
            <ProtectedRoute perfisPermitidos={['GESTOR']}>
              <PeriodosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/alunos"
          element={
            <ProtectedRoute perfisPermitidos={['GESTOR']}>
              <AlunosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/professores"
          element={
            <ProtectedRoute perfisPermitidos={['GESTOR']}>
              <ProfessoresFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/turmas"
          element={
            <ProtectedRoute perfisPermitidos={['GESTOR']}>
              <TurmasFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sistema/gestor/disciplinas"
          element={
            <ProtectedRoute perfisPermitidos={['GESTOR']}>
              <DisciplinasFormPage/>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  )

}


export default App