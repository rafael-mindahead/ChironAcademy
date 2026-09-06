import jwt from 'jsonwebtoken'


export function autenticarToken(req, res, next) {

  try {

    // ==================================================
    // VERIFICAR CONFIGURAÇÃO
    // ==================================================

    if (!process.env.JWT_SECRET) {

      console.error(
        'JWT_SECRET não está configurado.'
      )

      return res.status(500).json({
        message:
          'Erro de configuração do servidor.'
      })

    }


    // ==================================================
    // PEGAR HEADER AUTHORIZATION
    // ==================================================

    const authorization =
      req.headers.authorization


    if (!authorization) {

      return res.status(401).json({
        message:
          'Token de autenticação não informado.'
      })

    }


    // Esperado:
    // Authorization: Bearer eyJ...

    const partes =
      authorization.split(' ')


    if (
      partes.length !== 2 ||
      partes[0] !== 'Bearer'
    ) {

      return res.status(401).json({
        message:
          'Formato de token inválido.'
      })

    }


    const token =
      partes[1]


    // ==================================================
    // VALIDAR JWT
    // ==================================================

    const payload =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      )


    // ==================================================
    // ADICIONAR USUÁRIO À REQUEST
    // ==================================================

    req.usuario = {

      idUsuario:
        Number(payload.sub),

      email:
        payload.email,

      perfil:
        payload.perfil

    }


    next()


  } catch (error) {

    if (
      error.name ===
      'TokenExpiredError'
    ) {

      return res.status(401).json({
        message:
          'Sua sessão expirou. Faça login novamente.'
      })

    }


    return res.status(401).json({
      message:
        'Token inválido.'
    })

  }

}