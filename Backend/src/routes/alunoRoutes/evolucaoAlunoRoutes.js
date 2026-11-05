import express from 'express'

import {
  consultarEvolucaoPeriodo
} from '../../controllers/alunoControllers/evolucaoAlunoController.js'

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
  consultarEvolucaoPeriodo
)


export default router
