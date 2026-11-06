import express from 'express'

import {
  cadastrarCurso,
  listarCursos,
  buscarCurso,
  atualizarCurso,
  excluirCurso
} from '../../controllers/gestorControllers/cursoFormController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router = express.Router()


// ======================================================
// CADASTRAR CURSO COM A REQUISIÇÃO POST
//
// primeiro ele autentica se o token da sessão é valida
// depois verifica se o usuario acessando a rota tem o perfil de GESTOR
// e só então roda a função cadastrarCurso
// ======================================================

router.post(
  '/',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  cadastrarCurso
)


// ======================================================
// LISTAR CURSOS
// ======================================================

router.get(
  '/',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  listarCursos
)


// ======================================================
// BUSCAR CURSO POR ID
// ======================================================

router.get(
  '/:id',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  buscarCurso
)


// ======================================================
// ATUALIZAR CURSO
// ======================================================

router.put(
  '/:id',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  atualizarCurso
)


// ======================================================
// EXCLUIR CURSO
// ======================================================

router.delete(
  '/:id',
  autenticarToken,
  autorizarPerfis('GESTOR'),
  excluirCurso
)


export default router
