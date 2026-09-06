import database from '../config/database.js'


export async function obterUsuarioAtual(req, res) {

  try {

    const idUsuario =
      req.usuario.idUsuario


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
        [idUsuario]
      )


    if (
      usuarios.length === 0
    ) {

      return res.status(404).json({
        message:
          'Usuário não encontrado.'
      })

    }


    const usuario =
      usuarios[0]


    if (!usuario.ativo) {

      return res.status(403).json({
        message:
          'Esta conta está desativada.'
      })

    }


    return res.status(200).json({

      usuario: {

        idUsuario:
          usuario.idUsuario,

        email:
          usuario.email,

        perfil:
          usuario.perfil

      }

    })


  } catch (error) {

    console.error(
      'Erro ao buscar usuário autenticado:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível carregar os dados do usuário.'
    })

  }

}