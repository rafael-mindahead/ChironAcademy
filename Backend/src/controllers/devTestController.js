import database from '../config/database.js'


export async function excluirUsuarioTemporario(
  req,
  res
) {

  try {

    if (
      process.env.NODE_ENV ===
      'production'
    ) {

      return res.status(404).json({
        message:
          'Recurso não encontrado.'
      })

    }


    const email =
      req.body.email
        ?.trim()
        ?.toLowerCase()


    if (!email) {

      return res.status(400).json({
        message:
          'E-mail é obrigatório.'
      })

    }


    const emailTesteValido =
      /^professor\.test\.\d+@chiron\.local$/
        .test(email)


    if (!emailTesteValido) {

      return res.status(400).json({
        message:
          'Somente usuários temporários de teste podem ser removidos.'
      })

    }


    const [resultado] =
      await database.execute(
        `
          DELETE FROM Usuario

          WHERE email = ?
        `,
        [
          email
        ]
      )


    return res.status(200).json({

      message:
        'Usuário temporário removido.',

      removido:
        resultado.affectedRows > 0

    })


  } catch (error) {

    console.error(
      'Erro ao remover usuário temporário:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível remover o usuário temporário.'
    })

  }

}