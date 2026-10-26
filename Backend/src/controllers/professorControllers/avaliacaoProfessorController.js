import database from '../../config/database.js'

// PBI 10 | Aceite: o professor mantém avaliações somente nas turmas pelas quais é responsável.


// PROFESSOR AUTENTICADO

async function buscarProfessorAutenticado(req) {

  const email =
    req.usuario
      ?.email
      ?.trim()
      ?.toLowerCase()


  if (!email) {
    return null
  }


  const [professores] =
    await database.execute(
      `
        SELECT
          idProfessor,
          nome,
          email

        FROM Professor

        WHERE LOWER(email) = ?

        LIMIT 1
      `,
      [email]
    )


  if (professores.length === 0) {
    return null
  }


  return professores[0]
}


// VERIFICAR VÍNCULO DO PROFESSOR

async function buscarVinculoProfessor(
  idProfessorTurma,
  idProfessor
) {

  const [vinculos] =
    await database.execute(
      `
        SELECT
          pt.idProfessorTurma,
          pt.idProfessor,

          t.idTurma,
          t.localTurma,
          t.turnoTurma,

          d.codDisciplina,
          d.nomeDisciplina,

          c.idCurso,
          c.nomeCurso

        FROM ProfessorTurma pt

        INNER JOIN Turma t
          ON t.idTurma = pt.idTurma

        INNER JOIN Disciplina d
          ON d.codDisciplina =
             pt.codDisciplina

        INNER JOIN Curso c
          ON c.idCurso =
             t.idCurso

        WHERE pt.idProfessorTurma = ?

          AND pt.idProfessor = ?

        LIMIT 1
      `,
      [
        idProfessorTurma,
        idProfessor
      ]
    )


  if (vinculos.length === 0) {
    return null
  }


  return vinculos[0]
}


// VALIDAR DADOS

function validarDados(body) {

  const titulo =
    body.titulo
      ?.trim()


  const descricao =
    body.descricao
      ?.trim() ||
    null


  const dataAvaliacao =
    body.dataAvaliacao
      ?.trim()


  const valorMaximo =
    Number(
      body.valorMaximo
    )


  if (!titulo) {

    return {
      erro:
        'O título da avaliação é obrigatório.'
    }

  }


  if (titulo.length > 150) {

    return {
      erro:
        'O título deve possuir no máximo 150 caracteres.'
    }

  }


  if (
    descricao &&
    descricao.length > 500
  ) {

    return {
      erro:
        'A descrição deve possuir no máximo 500 caracteres.'
    }

  }


  if (!dataAvaliacao) {

    return {
      erro:
        'A data da avaliação é obrigatória.'
    }

  }


  const dataValida =
    /^\d{4}-\d{2}-\d{2}$/
      .test(
        dataAvaliacao
      )


  if (!dataValida) {

    return {
      erro:
        'A data da avaliação é inválida.'
    }

  }


  if (
    !Number.isFinite(
      valorMaximo
    ) ||
    valorMaximo <= 0
  ) {

    return {
      erro:
        'O valor máximo deve ser maior que zero.'
    }

  }


  if (
    valorMaximo > 999.99
  ) {

    return {
      erro:
        'O valor máximo informado é muito alto.'
    }

  }


  return {

    titulo,

    descricao,

    dataAvaliacao,

    valorMaximo

  }

}


// LISTAR AVALIAÇÕES

export async function listarAvaliacoes(
  req,
  res
) {

  try {

    const professor =
      await buscarProfessorAutenticado(
        req
      )


    if (!professor) {

      return res.status(404).json({
        message:
          'Professor não encontrado.'
      })

    }


    const idProfessorTurma =
      Number(
        req.params.idProfessorTurma
      )


    if (
      !Number.isInteger(
        idProfessorTurma
      ) ||
      idProfessorTurma <= 0
    ) {

      return res.status(400).json({
        message:
          'Vínculo acadêmico inválido.'
      })

    }


    const vinculo =
      await buscarVinculoProfessor(
        idProfessorTurma,
        professor.idProfessor
      )


    if (!vinculo) {

      return res.status(404).json({
        message:
          'Turma não encontrada ou não pertence ao professor autenticado.'
      })

    }


    const [avaliacoes] =
      await database.execute(
        `
          SELECT
            idAvaliacao,
            titulo,
            descricao,
            dataAvaliacao,
            valorMaximo,
            idProfessorTurma,
            createdAt,
            updatedAt

          FROM Avaliacao

          WHERE idProfessorTurma = ?

          ORDER BY
            dataAvaliacao ASC,
            idAvaliacao ASC
        `,
        [
          idProfessorTurma
        ]
      )


    return res.status(200).json({

      professor,

      turma:
        vinculo,

      avaliacoes

    })


  } catch (error) {

    console.error(
      'Erro ao listar avaliações:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível listar as avaliações.'
    })

  }

}


// CRIAR AVALIAÇÃO

export async function criarAvaliacao(
  req,
  res
) {

  try {

    const professor =
      await buscarProfessorAutenticado(
        req
      )


    if (!professor) {

      return res.status(404).json({
        message:
          'Professor não encontrado.'
      })

    }


    const idProfessorTurma =
      Number(
        req.params.idProfessorTurma
      )


    if (
      !Number.isInteger(
        idProfessorTurma
      ) ||
      idProfessorTurma <= 0
    ) {

      return res.status(400).json({
        message:
          'Vínculo acadêmico inválido.'
      })

    }


    const vinculo =
      await buscarVinculoProfessor(
        idProfessorTurma,
        professor.idProfessor
      )


    if (!vinculo) {

      return res.status(404).json({
        message:
          'Turma não encontrada ou não pertence ao professor autenticado.'
      })

    }


    const dados =
      validarDados(
        req.body
      )


    if (dados.erro) {

      return res.status(400).json({
        message:
          dados.erro
      })

    }


    const [resultado] =
      await database.execute(
        `
          INSERT INTO Avaliacao
          (
            titulo,
            descricao,
            dataAvaliacao,
            valorMaximo,
            idProfessorTurma
          )

          VALUES (?, ?, ?, ?, ?)
        `,
        [
          dados.titulo,
          dados.descricao,
          dados.dataAvaliacao,
          dados.valorMaximo,
          idProfessorTurma
        ]
      )


    const [avaliacoes] =
      await database.execute(
        `
          SELECT
            idAvaliacao,
            titulo,
            descricao,
            dataAvaliacao,
            valorMaximo,
            idProfessorTurma,
            createdAt,
            updatedAt

          FROM Avaliacao

          WHERE idAvaliacao = ?

          LIMIT 1
        `,
        [
          resultado.insertId
        ]
      )


    return res.status(201).json({

      message:
        'Avaliação criada com sucesso.',

      avaliacao:
        avaliacoes[0]

    })


  } catch (error) {

    console.error(
      'Erro ao criar avaliação:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível criar a avaliação.'
    })

  }

}


// ATUALIZAR AVALIAÇÃO

export async function atualizarAvaliacao(
  req,
  res
) {

  try {

    const professor =
      await buscarProfessorAutenticado(
        req
      )


    if (!professor) {

      return res.status(404).json({
        message:
          'Professor não encontrado.'
      })

    }


    const idProfessorTurma =
      Number(
        req.params.idProfessorTurma
      )


    const idAvaliacao =
      Number(
        req.params.idAvaliacao
      )


    if (
      !Number.isInteger(
        idProfessorTurma
      ) ||
      idProfessorTurma <= 0 ||
      !Number.isInteger(
        idAvaliacao
      ) ||
      idAvaliacao <= 0
    ) {

      return res.status(400).json({
        message:
          'Identificador inválido.'
      })

    }


    const vinculo =
      await buscarVinculoProfessor(
        idProfessorTurma,
        professor.idProfessor
      )


    if (!vinculo) {

      return res.status(404).json({
        message:
          'Turma não encontrada ou não pertence ao professor autenticado.'
      })

    }


    const [existentes] =
      await database.execute(
        `
          SELECT idAvaliacao

          FROM Avaliacao

          WHERE idAvaliacao = ?

            AND idProfessorTurma = ?

          LIMIT 1
        `,
        [
          idAvaliacao,
          idProfessorTurma
        ]
      )


    if (
      existentes.length === 0
    ) {

      return res.status(404).json({
        message:
          'Avaliação não encontrada.'
      })

    }


    const dados =
      validarDados(
        req.body
      )


    if (dados.erro) {

      return res.status(400).json({
        message:
          dados.erro
      })

    }


    await database.execute(
      `
        UPDATE Avaliacao

        SET
          titulo = ?,
          descricao = ?,
          dataAvaliacao = ?,
          valorMaximo = ?

        WHERE idAvaliacao = ?

          AND idProfessorTurma = ?
      `,
      [
        dados.titulo,
        dados.descricao,
        dados.dataAvaliacao,
        dados.valorMaximo,
        idAvaliacao,
        idProfessorTurma
      ]
    )


    const [avaliacoes] =
      await database.execute(
        `
          SELECT
            idAvaliacao,
            titulo,
            descricao,
            dataAvaliacao,
            valorMaximo,
            idProfessorTurma,
            createdAt,
            updatedAt

          FROM Avaliacao

          WHERE idAvaliacao = ?

          LIMIT 1
        `,
        [
          idAvaliacao
        ]
      )


    return res.status(200).json({

      message:
        'Avaliação atualizada com sucesso.',

      avaliacao:
        avaliacoes[0]

    })


  } catch (error) {

    console.error(
      'Erro ao atualizar avaliação:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível atualizar a avaliação.'
    })

  }

}


// EXCLUIR AVALIAÇÃO

export async function excluirAvaliacao(
  req,
  res
) {

  try {

    const professor =
      await buscarProfessorAutenticado(
        req
      )


    if (!professor) {

      return res.status(404).json({
        message:
          'Professor não encontrado.'
      })

    }


    const idProfessorTurma =
      Number(
        req.params.idProfessorTurma
      )


    const idAvaliacao =
      Number(
        req.params.idAvaliacao
      )


    if (
      !Number.isInteger(
        idProfessorTurma
      ) ||
      idProfessorTurma <= 0 ||
      !Number.isInteger(
        idAvaliacao
      ) ||
      idAvaliacao <= 0
    ) {

      return res.status(400).json({
        message:
          'Identificador inválido.'
      })

    }


    const vinculo =
      await buscarVinculoProfessor(
        idProfessorTurma,
        professor.idProfessor
      )


    if (!vinculo) {

      return res.status(404).json({
        message:
          'Turma não encontrada ou não pertence ao professor autenticado.'
      })

    }


    const [resultado] =
      await database.execute(
        `
          DELETE FROM Avaliacao

          WHERE idAvaliacao = ?

            AND idProfessorTurma = ?
        `,
        [
          idAvaliacao,
          idProfessorTurma
        ]
      )


    if (
      resultado.affectedRows === 0
    ) {

      return res.status(404).json({
        message:
          'Avaliação não encontrada.'
      })

    }


    return res.status(200).json({
      message:
        'Avaliação excluída com sucesso.'
    })


  } catch (error) {

    if (
      error.code ===
      'ER_ROW_IS_REFERENCED_2'
    ) {

      return res.status(409).json({
        message:
          'Esta avaliação possui registros vinculados e não pode ser excluída.'
      })

    }


    console.error(
      'Erro ao excluir avaliação:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível excluir a avaliação.'
    })

  }

}