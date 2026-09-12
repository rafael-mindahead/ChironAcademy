import express from 'express'

import {
    listarOpcoes,
    listarVinculos,
    buscarVinculo,
    criarVinculo,
    excluirVinculo
} from '../../controllers/gestorControllers/vinculosFormController.js'

import { autenticarToken } from '../middlewares/authMiddleware.js'
import { autorizarPerfis } from '../middlewares/authorizationMiddleware.js'

const router = express.Router()

router.get(
    '/opcoes',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    listarOpcoes
)

router.get(
    '/',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    listarVinculos
)

router.get(
    '/:idProfessorTurma',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    buscarVinculo
)

router.post(
    '/',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    criarVinculo
)

router.delete(
    '/:idProfessorTurma',
    autenticarToken,
    autorizarPerfis('GESTOR'),
    excluirVinculo
)

export default router