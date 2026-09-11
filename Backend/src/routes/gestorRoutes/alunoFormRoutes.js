import express from 'express'

import {
    cadastrarAluno,
    listarAlunos,
    buscarAluno,
    atualizarAluno,
    excluirAluno
} from '../controllers/gestorControllers/alunoFormController.js'

import { autenticarToken } from '../../middlewares/authMiddleware.js'
import { autorizarPerfis } from '../../middlewares/authorizationMiddleware.js'

const router = express.Router()

router.post(
    '/',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    cadastrarAluno
)

router.get(
    '/',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    listarAlunos
)

router.get(
    '/:id',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    buscarAluno
)

router.put(
    '/:id',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    atualizarAluno
)

router.delete(
    '/:id',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    excluirAluno
)

export default router