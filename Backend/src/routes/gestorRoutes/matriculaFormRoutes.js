import express from 'express'

import {
  listarOpcoes,
  listarMatriculas,
  buscarMatricula,
  criarMatricula,
  atualizarMatricula,
  excluirMatricula
} from '../../controllers/gestorControllers/matriculaFormController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router =
  express.Router()


// ======================================================
// TODAS AS ROTAS EXIGEM GESTOR
// ======================================================

router.use(
  autenticarToken
)

router.use(
  autorizarPerfis(
    'GESTOR'
  )
)


// ======================================================
// OPÇÕES DOS SELECTS
// ======================================================

router.get(
  '/opcoes',
  listarOpcoes
)


// ======================================================
// LISTAR
// ======================================================

router.get(
  '/',
  listarMatriculas
)


// ======================================================
// BUSCAR
// ======================================================

router.get(
  '/:idMatricula',
  buscarMatricula
)


// ======================================================
// CRIAR
// ======================================================

router.post(
  '/',
  criarMatricula
)


// ======================================================
// ATUALIZAR
// ======================================================

router.put(
  '/:idMatricula',
  atualizarMatricula
)


// ======================================================
// EXCLUIR
// ======================================================

router.delete(
  '/:idMatricula',
  excluirMatricula
)


export default router