import express from 'express'

import {
  autenticarToken
} from '../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../middlewares/authorizationMiddleware.js'

import {
  buscarProfessor,
  criarProfessor,
  atualizarProfessor,
  excluirProfessor,
  listarProfessores
} from '../controllers/professorController.js'


const router = express.Router()

router.use(autenticarToken)
router.use(autorizarPerfis('GESTOR'))

router.get('/', listarProfessores)
router.post('/', criarProfessor)
router.get('/:idProfessor', buscarProfessor)
router.put('/:idProfessor', atualizarProfessor)
router.delete('/:idProfessor', excluirProfessor)


export default router
