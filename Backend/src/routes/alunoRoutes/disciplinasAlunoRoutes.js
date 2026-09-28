import express from 'express'

import {
  listarDisciplinasMatriculadas
} from '../../controllers/alunoControllers/disciplinasAlunoController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router =
  express.Router()


router.use(
  autenticarToken
)


router.use(
  autorizarPerfis(
    'ALUNO'
  )
)


router.get(
  '/',
  listarDisciplinasMatriculadas
)


export default router
