import database from '../../config/database.js'

// PBI 11 | Aceite: o professor lança, altera e remove notas dos matriculados sem ultrapassar o valor máximo da avaliação.


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


// VÍNCULO DO PROFESSOR

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
          ON t.idTurma =
             pt.idTurma

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


// AVALIAÇÃO DO VÍNCULO

async function buscarAvaliacao(
  idAvaliacao,
  idProfessorTurma
) {

  const [avaliacoes] =
    await database.execute(
      `
        SELECT
          idAvaliacao,
          titulo,
          descricao,
          dataAvaliacao,
          valorMaximo,
          idProfessorTurma

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


  if (avaliacoes.length === 0) {
    return null
  }


  return avaliacoes[0]
}


// MATRÍCULA DA TURMA/DISCIPLINA

async function buscarMatricula(
  idMatricula,
  vinculo
) {

  const [matriculas] =
    await database.execute(
      `
        SELECT
          m.idMatricula,
          m.statusMatricula,

          a.idAluno,
          a.nome,
          a.numeroMatricula,
          a.email

        FROM Matricula m

        INNER JOIN Aluno a
          ON a.idAluno =
             m.idAluno

        WHERE m.idMatricula = ?

          AND m.idTurma = ?

          AND m.codDisciplina = ?

        LIMIT 1
      `,
      [
        idMatricula,
        vinculo.idTurma,
        vinculo.codDisciplina
      ]
    )


  if (matriculas.length === 0) {
    return null
  }


  return matriculas[0]
}


// LISTAR NOTAS

export async function listarNotas(
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
      !Number.isInteger(idProfessorTurma) ||
      idProfessorTurma <= 0 ||
      !Number.isInteger(idAvaliacao) ||
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


    const avaliacao =
      await buscarAvaliacao(
        idAvaliacao,
        idProfessorTurma
      )


    if (!avaliacao) {

      return res.status(404).json({
        message:
          'Avaliação não encontrada.'
      })

    }


    const [alunos] =
      await database.execute(
        `
          SELECT
            m.idMatricula,
            m.statusMatricula,

            a.idAluno,
            a.nome,
            a.numeroMatricula,
            a.email,

            n.idNota,
            n.valor,
            n.observacao,
            n.createdAt,
            n.updatedAt

          FROM Matricula m

          INNER JOIN Aluno a
            ON a.idAluno =
               m.idAluno

          LEFT JOIN Nota n
            ON n.idMatricula =
               m.idMatricula

           AND n.idAvaliacao = ?

          WHERE m.idTurma = ?

            AND m.codDisciplina = ?

          ORDER BY
            a.nome ASC
        `,
        [
          idAvaliacao,
          vinculo.idTurma,
          vinculo.codDisciplina
        ]
      )


    return res.status(200).json({

      professor,

      turma:
        vinculo,

      avaliacao,

      alunos

    })


  } catch (error) {

    console.error(
      'Erro ao listar notas:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar as notas.'
    })

  }

}


// REGISTRAR / ATUALIZAR NOTA

export async function registrarNota(
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


    const idMatricula =
      Number(
        req.params.idMatricula
      )


    if (
      !Number.isInteger(idProfessorTurma) ||
      idProfessorTurma <= 0 ||
      !Number.isInteger(idAvaliacao) ||
      idAvaliacao <= 0 ||
      !Number.isInteger(idMatricula) ||
      idMatricula <= 0
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


    const avaliacao =
      await buscarAvaliacao(
        idAvaliacao,
        idProfessorTurma
      )


    if (!avaliacao) {

      return res.status(404).json({
        message:
          'Avaliação não encontrada.'
      })

    }


    const matricula =
      await buscarMatricula(
        idMatricula,
        vinculo
      )


    if (!matricula) {

      return res.status(404).json({
        message:
          'O aluno não está matriculado nesta turma e disciplina.'
      })

    }


    // ==================================================
    // VALOR DA NOTA
    // ==================================================

    if (
      req.body.valor === undefined ||
      req.body.valor === null ||
      req.body.valor === ''
    ) {

      return res.status(400).json({
        message:
          'A nota é obrigatória.'
      })

    }


    const valor =
      Number(
        req.body.valor
      )


    if (
      !Number.isFinite(valor) ||
      valor < 0
    ) {

      return res.status(400).json({
        message:
          'A nota deve ser um número maior ou igual a zero.'
      })

    }


    const valorMaximo =
      Number(
        avaliacao.valorMaximo
      )


    if (
      valor >
      valorMaximo
    ) {

      return res.status(400).json({
        message:
          `A nota não pode ser maior que ${valorMaximo}.`
      })

    }


    const observacao =
      req.body.observacao
        ?.trim() ||
      null


    if (
      observacao &&
      observacao.length > 500
    ) {

      return res.status(400).json({
        message:
          'A observação deve possuir no máximo 500 caracteres.'
      })

    }


    // ==================================================
    // UPSERT
    // ==================================================

    await database.execute(
      `
        INSERT INTO Nota
        (
          valor,
          observacao,
          idAvaliacao,
          idMatricula
        )

        VALUES (?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE

          valor =
            VALUES(valor),

          observacao =
            VALUES(observacao),

          updatedAt =
            CURRENT_TIMESTAMP
      `,
      [
        valor,
        observacao,
        idAvaliacao,
        idMatricula
      ]
    )


    const [notas] =
      await database.execute(
        `
          SELECT
            idNota,
            valor,
            observacao,
            idAvaliacao,
            idMatricula,
            createdAt,
            updatedAt

          FROM Nota

          WHERE idAvaliacao = ?

            AND idMatricula = ?

          LIMIT 1
        `,
        [
          idAvaliacao,
          idMatricula
        ]
      )


    return res.status(200).json({

      message:
        'Nota registrada com sucesso.',

      aluno:
        matricula,

      nota:
        notas[0]

    })


  } catch (error) {

    console.error(
      'Erro ao registrar nota:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível registrar a nota.'
    })

  }

}


// REMOVER NOTA

export async function excluirNota(
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


    const idMatricula =
      Number(
        req.params.idMatricula
      )


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


    const avaliacao =
      await buscarAvaliacao(
        idAvaliacao,
        idProfessorTurma
      )


    if (!avaliacao) {

      return res.status(404).json({
        message:
          'Avaliação não encontrada.'
      })

    }


    const matricula =
      await buscarMatricula(
        idMatricula,
        vinculo
      )


    if (!matricula) {

      return res.status(404).json({
        message:
          'Matrícula não encontrada nesta turma.'
      })

    }


    const [resultado] =
      await database.execute(
        `
          DELETE FROM Nota

          WHERE idAvaliacao = ?

            AND idMatricula = ?
        `,
        [
          idAvaliacao,
          idMatricula
        ]
      )


    if (
      resultado.affectedRows === 0
    ) {

      return res.status(404).json({
        message:
          'Nota não encontrada.'
      })

    }


    return res.status(200).json({
      message:
        'Nota removida com sucesso.'
    })


  } catch (error) {

    console.error(
      'Erro ao excluir nota:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível remover a nota.'
    })

  }

}