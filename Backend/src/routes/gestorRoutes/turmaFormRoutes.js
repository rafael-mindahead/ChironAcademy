import express from 'express'

import { autenticarToken } from '../../middlewares/authMiddleware.js'
import { autorizarPerfis } from '../../middlewares/authorizationMiddleware.js'
import {
  listarOpcoes,
  listarTurmas,
  buscarTurma,
  criarTurma,
  atualizarTurma,
  excluirTurma
} from '../../controllers/gestorControllers/turmaFormController.js'


const router = express.Router()

router.use(autenticarToken)
router.use(autorizarPerfis('GESTOR'))

router.get('/opcoes', listarOpcoes)
router.get('/', listarTurmas)
router.post('/', criarTurma)
router.get('/:idTurma', buscarTurma)
router.put('/:idTurma', atualizarTurma)
router.delete('/:idTurma', excluirTurma)


export default router
