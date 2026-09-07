import database from '../config/database.js'


// ======================================================
// AUTORIZAÇÃO POR PERFIL
// ======================================================

export function autorizarPerfis(...perfisPermitidos) {

  return async function (req, res, next) {

    try {

      // ==================================================
      // GARANTIR QUE O USUÁRIO FOI AUTENTICADO
      // ==================================================

      if (
        !req.usuario ||
        !req.usuario.idUsuario
      ) {

        return res.status(401).json({
          message:
            'Usuário não autenticado.'
        })

      }


      // ==================================================
      // BUSCAR USUÁRIO ATUAL NO BANCO
      // ==================================================

      const [usuarios] =
        await database.execute(
          `
            SELECT
              idUsuario,
              email,
              perfil,
              ativo

            FROM Usuario

            WHERE idUsuario = ?

            LIMIT 1
          `,
          [
            req.usuario.idUsuario
          ]
        )


      // ==================================================
      // USUÁRIO NÃO EXISTE
      // ==================================================

      if (usuarios.length === 0) {

        return res.status(401).json({
          message:
            'Usuário não encontrado.'
        })

      }


      const usuario =
        usuarios[0]


      // ==================================================
      // CONTA DESATIVADA
      // ==================================================

      if (!usuario.ativo) {

        return res.status(403).json({
          message:
            'Esta conta está desativada.'
        })

      }


      // ==================================================
      // VERIFICAR PERFIL
      // ==================================================

      const possuiPermissao =
        perfisPermitidos.includes(
          usuario.perfil
        )


      if (!possuiPermissao) {

        return res.status(403).json({
          message:
            'Você não possui permissão para acessar este recurso.'
        })

      }


      // ==================================================
      // ATUALIZAR DADOS DO USUÁRIO NA REQUEST
      // ==================================================

      req.usuario = {

        idUsuario:
          usuario.idUsuario,

        email:
          usuario.email,

        perfil:
          usuario.perfil

      }


      // ==================================================
      // CONTINUAR PARA A PRÓXIMA FUNÇÃO
      // ==================================================

      next()


    } catch (error) {

      console.error(
        'Erro ao verificar autorização:',
        error
      )


      return res.status(500).json({
        message:
          'Não foi possível verificar as permissões do usuário.'
      })

    }

  }

}