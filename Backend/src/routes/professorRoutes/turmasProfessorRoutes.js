import express from 'express'

import {
  listarMinhasTurmas,
  buscarMinhaTurma
} from '../../controllers/professorControllers/turmasProfessorController.js'

import {
  listarAvaliacoes,
  criarAvaliacao,
  atualizarAvaliacao,
  excluirAvaliacao
} from '../../controllers/professorControllers/avaliacaoProfessorController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router =
  express.Router()


// ======================================================
// SOMENTE PROFESSOR
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
// AVALIAÇÕES
// ======================================================

router.get(
  '/:idProfessorTurma/avaliacoes',
  listarAvaliacoes
)


router.post(
  '/:idProfessorTurma/avaliacoes',
  criarAvaliacao
)


router.put(
  '/:idProfessorTurma/avaliacoes/:idAvaliacao',
  atualizarAvaliacao
)


router.delete(
  '/:idProfessorTurma/avaliacoes/:idAvaliacao',
  excluirAvaliacao
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