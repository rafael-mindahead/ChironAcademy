import express from 'express'

import {
  listarMinhasTurmas,
  buscarMinhaTurma
} from '../../controllers/professorControllers/turmasProfessorController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router =
  express.Router()


// ======================================================
// TODAS AS ROTAS EXIGEM PROFESSOR
// ======================================================

router.use(
  autenticarToken
)


router.use(
  autorizarPerfis(
    'PROFESSOR'
  )
)


// ======================================================
// MINHAS TURMAS
// ======================================================

router.get(
  '/',
  listarMinhasTurmas
)


// ======================================================
// TURMA ESPECÍFICA
// ======================================================

router.get(
  '/:idProfessorTurma',
  buscarMinhaTurma
)


export default router