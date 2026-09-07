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

import {
  autorizarPerfis
} from '../middlewares/authorizationMiddleware.js'


const router = express.Router()


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


// ======================================================
// TESTE - ALUNO
// ======================================================

router.get(
  '/test/aluno',

  autenticarToken,

  autorizarPerfis(
    'ALUNO'
  ),

  (req, res) => {

    return res.status(200).json({
      message:
        'Acesso de Aluno autorizado.',

      usuario:
        req.usuario
    })

  }
)


// ======================================================
// TESTE - PROFESSOR
// ======================================================

router.get(
  '/test/professor',

  autenticarToken,

  autorizarPerfis(
    'PROFESSOR'
  ),

  (req, res) => {

    return res.status(200).json({
      message:
        'Acesso de Professor autorizado.',

      usuario:
        req.usuario
    })

  }
)


// ======================================================
// TESTE - GESTOR
// ======================================================

router.get(
  '/test/gestor',

  autenticarToken,

  autorizarPerfis(
    'GESTOR'
  ),

  (req, res) => {

    return res.status(200).json({
      message:
        'Acesso de Gestor autorizado.',

      usuario:
        req.usuario
    })

  }
)


export default router