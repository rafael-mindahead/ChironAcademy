import express from 'express'

import {
  registrarUsuario,
  loginUsuario,
  recuperarSenha
} from '../controllers/authController.js'

import {
  obterUsuarioAtual
} from '../controllers/sessionController.js'

import {
  autenticarToken
} from '../middlewares/authMiddleware.js'


const router =
  express.Router()


// ======================================================
// CADASTRO
// ======================================================

router.post(
  '/register',
  registrarUsuario
)


// ======================================================
// LOGIN
// ======================================================

router.post(
  '/login',
  loginUsuario
)


// ======================================================
// RECUPERAÇÃO DE SENHA
// ======================================================

router.post(
  '/recover',
  recuperarSenha
)


// ======================================================
// USUÁRIO AUTENTICADO
// ======================================================

router.get(
  '/me',
  autenticarToken,
  obterUsuarioAtual
)


export default router