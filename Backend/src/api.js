console.log(
  'bem vindo ao inicio do backend'
)

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import database from './config/database.js'

import authRoutes
  from './routes/authRoutes.js'

import cursoFormRoutes
  from './routes/gestorRoutes/cursoFormRoutes.js'

import periodoFormRoutes
  from './routes/gestorRoutes/periodoFormRoutes.js'

import alunoFormRoutes
  from './routes/gestorRoutes/alunoFormRoutes.js'

import professorFormRoutes
  from './routes/gestorRoutes/professorFormRoutes.js'

import disciplinaFormRoutes
  from './routes/gestorRoutes/disciplinaFormRoutes.js'

import turmaFormRoutes
  from './routes/gestorRoutes/turmaFormRoutes.js'

import vinculosFormRoutes
  from './routes/gestorRoutes/vinculosFormRoutes.js'

import matriculaFormRoutes
  from './routes/gestorRoutes/matriculaFormRoutes.js'

import turmasProfessorRoutes
  from './routes/professorRoutes/turmasProfessorRoutes.js'


dotenv.config()


const app =
  express()


const PORT =
  process.env.PORT ||
  3000


app.use(
  cors()
)

app.use(
  express.json()
)


// ======================================================
// AUTENTICAÇÃO
// ======================================================

app.use(
  '/api/auth',
  authRoutes
)


// ======================================================
// GESTOR
// ======================================================

app.use(
  '/api/cursos',
  cursoFormRoutes
)

app.use(
  '/api/periodos',
  periodoFormRoutes
)

app.use(
  '/api/alunos',
  alunoFormRoutes
)

app.use(
  '/api/professores',
  professorFormRoutes
)

app.use(
  '/api/disciplinas',
  disciplinaFormRoutes
)

app.use(
  '/api/turmas',
  turmaFormRoutes
)

app.use(
  '/api/vinculos',
  vinculosFormRoutes
)

app.use(
  '/api/matriculas',
  matriculaFormRoutes
)


// ======================================================
// PROFESSOR
// ======================================================

app.use(
  '/api/professor/turmas',
  turmasProfessorRoutes
)


// ======================================================
// API
// ======================================================

app.get(
  '/',
  (req, res) => {

    res.json({

      sistema:
        'ChironAcademy',

      api:
        'Online'

    })

  }
)


// ======================================================
// HEALTH
// ======================================================

app.get(
  '/api/health',
  (req, res) => {

    res.status(200).json({

      status:
        'ok',

      mensagem:
        'API esta funcionando'

    })

  }
)


// ======================================================
// DATABASE HEALTH
// ======================================================

app.get(
  '/api/database/health',

  async (
    req,
    res
  ) => {

    try {

      const [resultado] =
        await database.query(
          `
            SELECT
              DATABASE() AS banco,
              NOW() AS horario
          `
        )


      res.status(200).json({

        status:
          'ok',

        message:
          'conexao MYSQL esta funcionando',

        database:
          resultado[0].banco,

        horario:
          resultado[0].horario

      })


    } catch (error) {

      console.error(
        'Erro ao verificar a conexão com o banco de dados:',
        error
      )


      res.status(500).json({

        status:
          'error',

        message:
          'nao foi possivel conectar ao banco de dados'

      })

    }

  }
)


// ======================================================
// START SERVER
// ======================================================

app.listen(
  PORT,
  () => {

    console.log(
      'servidor rodando na porta: ' +
      PORT
    )

  }
)