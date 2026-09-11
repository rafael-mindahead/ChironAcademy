import database from '../../config/database.js'

function validarDados(body) {
  const idProfessor = Number(body.idProfessor)
  const idTurma = Number(body.idTurma)
  const codDisciplina = body.codDisciplina?.trim()

  if (!idProfessor || !idTurma || !codDisciplina) {
    return {
      erro: 'Professor, turma e disciplina são obrigatórios.'
    }
  }

  return {
    idProfessor,
    idTurma,
    codDisciplina
  }
}

function responderErroBanco(error, res) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      code: 'VINCULO_DUPLICADO',
      message: 'Esse professor já está vinculado a essa turma e disciplina.'
    })
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      code: 'RELACIONAMENTO_INVALIDO',
      message: 'O professor, turma ou disciplina selecionado não existe.'
    })
  }

  console.error('Erro no CRUD de vínculos:', error)

  return res.status(500).json({
    message: 'Não foi possível realizar a operação.'
  })
}

export async function listarOpcoes(req, res) {
  try {
    const [professores] = await database.execute(
      `
        SELECT idProfessor, nome
        FROM Professor
        ORDER BY nome ASC
      `
    )

    const [turmas] = await database.execute(
      `
        SELECT t.idTurma, t.localTurma, t.turnoTurma,
               t.idCurso, c.nomeCurso
        FROM Turma t
        INNER JOIN Curso c ON c.idCurso = t.idCurso
        ORDER BY t.idTurma DESC
      `
    )

    const [disciplinas] = await database.execute(
      `
        SELECT d.codDisciplina, d.nomeDisciplina,
               d.idCurso, c.nomeCurso,
               d.idPeriodo, p.nomePeriodo
        FROM Disciplina d
        INNER JOIN Curso c ON c.idCurso = d.idCurso
        INNER JOIN Periodo p ON p.idPeriodo = d.idPeriodo
        ORDER BY d.nomeDisciplina ASC
      `
    )

    return res.status(200).json({
      professores,
      turmas,
      disciplinas
    })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}

export async function listarVinculos(req, res) {
  try {
    const [vinculos] = await database.execute(
      `
        SELECT
          pt.idProfessorTurma,
          pt.idProfessor,
          p.nome AS nomeProfessor,
          pt.idTurma,
          t.localTurma,
          t.turnoTurma,
          pt.codDisciplina,
          d.nomeDisciplina
        FROM ProfessorTurma pt
        INNER JOIN Professor p
          ON p.idProfessor = pt.idProfessor
        INNER JOIN Turma t
          ON t.idTurma = pt.idTurma
        INNER JOIN Disciplina d
          ON d.codDisciplina = pt.codDisciplina
        ORDER BY p.nome ASC, d.nomeDisciplina ASC
      `
    )

    return res.status(200).json({ vinculos })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}

export async function buscarVinculo(req, res) {
  try {
    const [vinculos] = await database.execute(
      `
        SELECT
          pt.idProfessorTurma,
          pt.idProfessor,
          p.nome AS nomeProfessor,
          pt.idTurma,
          t.localTurma,
          t.turnoTurma,
          pt.codDisciplina,
          d.nomeDisciplina
        FROM ProfessorTurma pt
        INNER JOIN Professor p
          ON p.idProfessor = pt.idProfessor
        INNER JOIN Turma t
          ON t.idTurma = pt.idTurma
        INNER JOIN Disciplina d
          ON d.codDisciplina = pt.codDisciplina
        WHERE pt.idProfessorTurma = ?
        LIMIT 1
      `,
      [req.params.idProfessorTurma]
    )

    if (vinculos.length === 0) {
      return res.status(404).json({
        message: 'Vínculo não encontrado.'
      })
    }

    return res.status(200).json({
      vinculo: vinculos[0]
    })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}

export async function criarVinculo(req, res) {
  const dados = validarDados(req.body)

  if (dados.erro) {
    return res.status(400).json({
      message: dados.erro
    })
  }

  try {
    const [professor] = await database.execute(
      `
        SELECT idProfessor
        FROM Professor
        WHERE idProfessor = ?
        LIMIT 1
      `,
      [dados.idProfessor]
    )

    if (professor.length === 0) {
      return res.status(400).json({
        code: 'PROFESSOR_INVALIDO',
        message: 'O professor selecionado não existe.'
      })
    }

    const [turma] = await database.execute(
      `
        SELECT idTurma
        FROM Turma
        WHERE idTurma = ?
        LIMIT 1
      `,
      [dados.idTurma]
    )

    if (turma.length === 0) {
      return res.status(400).json({
        code: 'TURMA_INVALIDA',
        message: 'A turma selecionada não existe.'
      })
    }

    const [disciplina] = await database.execute(
      `
        SELECT codDisciplina
        FROM Disciplina
        WHERE codDisciplina = ?
        LIMIT 1
      `,
      [dados.codDisciplina]
    )

    if (disciplina.length === 0) {
      return res.status(400).json({
        code: 'DISCIPLINA_INVALIDA',
        message: 'A disciplina selecionada não existe.'
      })
    }

    const [vinculoExistente] = await database.execute(
      `
        SELECT idProfessorTurma
        FROM ProfessorTurma
        WHERE idProfessor = ?
          AND idTurma = ?
          AND codDisciplina = ?
        LIMIT 1
      `,
      [
        dados.idProfessor,
        dados.idTurma,
        dados.codDisciplina
      ]
    )

    if (vinculoExistente.length > 0) {
      return res.status(409).json({
        code: 'VINCULO_DUPLICADO',
        message: 'Esse professor já está vinculado a essa turma e disciplina.'
      })
    }

    const [resultado] = await database.execute(
      `
        INSERT INTO ProfessorTurma
          (idProfessor, idTurma, codDisciplina)
        VALUES (?, ?, ?)
      `,
      [
        dados.idProfessor,
        dados.idTurma,
        dados.codDisciplina
      ]
    )

    return buscarVinculo(
      {
        params: {
          idProfessorTurma: resultado.insertId
        }
      },
      res
    )
  } catch (error) {
    return responderErroBanco(error, res)
  }
}

export async function excluirVinculo(req, res) {
  try {
    const [resultado] = await database.execute(
      `
        DELETE FROM ProfessorTurma
        WHERE idProfessorTurma = ?
      `,
      [req.params.idProfessorTurma]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Vínculo não encontrado.'
      })
    }

    return res.status(200).json({
      message: 'Vínculo excluído com sucesso.'
    })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}