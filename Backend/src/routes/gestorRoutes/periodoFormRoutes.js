import express from 'express'

import {
  cadastrarPeriodo,
  listarPeriodos,
  buscarPeriodo,
  atualizarPeriodo,
  excluirPeriodo
} from '../controllers/gestorControllers/periodoFormController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router = express.Router()


// ======================================================
// CADASTRAR PERÍODO
// ======================================================

router.post(
  '/',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  cadastrarPeriodo
)


// ======================================================
// LISTAR PERÍODOS
// ======================================================

router.get(
  '/',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  listarPeriodos
)


// ======================================================
// BUSCAR PERÍODO POR ID
// ======================================================

router.get(
  '/:id',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  buscarPeriodo
)


// ======================================================
// ATUALIZAR PERÍODO
// ======================================================

router.put(
  '/:id',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  atualizarPeriodo
)


// ======================================================
// EXCLUIR PERÍODO
// ======================================================

router.delete(
  '/:id',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  excluirPeriodo
)


export default router