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
  listarNotas,
  registrarNota,
  excluirNota
} from '../../controllers/professorControllers/notaProfessorController.js'

import {
  listarAulas,
  criarAula,
  atualizarAula,
  excluirAula,
  listarFrequencias,
  registrarFrequencia,
  excluirFrequencia
} from '../../controllers/professorControllers/frequenciaProfessorController.js'

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
// NOTAS
// ======================================================

router.get(
  '/:idProfessorTurma/avaliacoes/:idAvaliacao/notas',
  listarNotas
)


router.put(
  '/:idProfessorTurma/avaliacoes/:idAvaliacao/notas/:idMatricula',
  registrarNota
)


router.delete(
  '/:idProfessorTurma/avaliacoes/:idAvaliacao/notas/:idMatricula',
  excluirNota
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
// FREQUÊNCIA
// ======================================================

router.get(
  '/:idProfessorTurma/aulas',
  listarAulas
)


router.post(
  '/:idProfessorTurma/aulas',
  criarAula
)


router.put(
  '/:idProfessorTurma/aulas/:idAula',
  atualizarAula
)


router.delete(
  '/:idProfessorTurma/aulas/:idAula',
  excluirAula
)


router.get(
  '/:idProfessorTurma/aulas/:idAula/frequencias',
  listarFrequencias
)


router.put(
  '/:idProfessorTurma/aulas/:idAula/frequencias/:idMatricula',
  registrarFrequencia
)


router.delete(
  '/:idProfessorTurma/aulas/:idAula/frequencias/:idMatricula',
  excluirFrequencia
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