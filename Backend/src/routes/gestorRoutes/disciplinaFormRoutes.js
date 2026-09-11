import express from 'express'

import { autenticarToken } from '../../middlewares/authMiddleware.js'
import { autorizarPerfis } from '../../middlewares/authorizationMiddleware.js'
import {
  listarOpcoes,
  listarDisciplinas,
  buscarDisciplina,
  criarDisciplina,
  atualizarDisciplina,
  excluirDisciplina
} from '../controllers/gestorControllers/disciplinaFormController.js'


const router = express.Router()

router.use(autenticarToken)
router.use(autorizarPerfis('GESTOR'))

router.get('/opcoes', listarOpcoes)
router.get('/', listarDisciplinas)
router.post('/', criarDisciplina)
router.get('/:codDisciplina', buscarDisciplina)
router.put('/:codDisciplina', atualizarDisciplina)
router.delete('/:codDisciplina', excluirDisciplina)


export default router
