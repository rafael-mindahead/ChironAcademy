import express from 'express'

import {
  consultarIndicadoresCursos
} from '../../controllers/gestorControllers/indicadoresCursoController.js'

import {
  autenticarToken
} from '../../middlewares/authMiddleware.js'

import {
  autorizarPerfis
} from '../../middlewares/authorizationMiddleware.js'


const router =
  express.Router()


router.use(
  autenticarToken
)


router.use(
  autorizarPerfis(
    'GESTOR'
  )
)


router.get(
  '/',
  consultarIndicadoresCursos
)


export default router