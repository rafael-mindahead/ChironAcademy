import database from '../../config/database.js'

// PBI 09 | Aceite: o professor consulta somente as próprias turmas e os alunos matriculados nelas.


// LOCALIZAR PROFESSOR AUTENTICADO

async function buscarProfessorAutenticado(
  req
) {

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
          telefone,
          email

        FROM Professor

        WHERE LOWER(email) = ?

        LIMIT 1
      `,
      [
        email
      ]
    )


  if (
    professores.length === 0
  ) {

    return null

  }


  return professores[0]

}


// LISTAR TURMAS SOB RESPONSABILIDADE

export async function listarMinhasTurmas(
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
          'Não foi encontrado um cadastro de professor vinculado a esta conta.'
      })

    }


    const [turmas] =
      await database.execute(
        `
          SELECT
            pt.idProfessorTurma,

            t.idTurma,
            t.localTurma,
            t.turnoTurma,

            c.idCurso,
            c.nomeCurso,

            d.codDisciplina,
            d.nomeDisciplina,
            d.tipoDisciplina,
            d.cargaHoraria,

            pe.idPeriodo,
            pe.numeroPeriodo,
            pe.nomePeriodo,

            COUNT(
              DISTINCT
              CASE
                WHEN m.statusMatricula = 'CURSANDO'
                THEN m.idAluno
              END
            ) AS totalAlunos

          FROM ProfessorTurma pt

          INNER JOIN Turma t
            ON t.idTurma =
               pt.idTurma

          INNER JOIN Curso c
            ON c.idCurso =
               t.idCurso

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               pt.codDisciplina

          INNER JOIN Periodo pe
            ON pe.idPeriodo =
               d.idPeriodo

          LEFT JOIN Matricula m
            ON m.idTurma =
               pt.idTurma

           AND m.codDisciplina =
               pt.codDisciplina

          WHERE pt.idProfessor = ?

          GROUP BY
            pt.idProfessorTurma,

            t.idTurma,
            t.localTurma,
            t.turnoTurma,

            c.idCurso,
            c.nomeCurso,

            d.codDisciplina,
            d.nomeDisciplina,
            d.tipoDisciplina,
            d.cargaHoraria,

            pe.idPeriodo,
            pe.numeroPeriodo,
            pe.nomePeriodo

          ORDER BY
            c.nomeCurso ASC,
            pe.numeroPeriodo ASC,
            d.nomeDisciplina ASC,
            t.idTurma ASC
        `,
        [
          professor.idProfessor
        ]
      )


    return res.status(200).json({

      professor,

      turmas

    })


  } catch (error) {

    console.error(
      'Erro ao consultar turmas do professor:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar as turmas do professor.'
    })

  }

}


// CONSULTAR UMA TURMA SOB RESPONSABILIDADE

export async function buscarMinhaTurma(
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
          'Não foi encontrado um cadastro de professor vinculado a esta conta.'
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


    // GARANTIR QUE A TURMA É DO PROFESSOR LOGADO

    const [turmas] =
      await database.execute(
        `
          SELECT
            pt.idProfessorTurma,

            t.idTurma,
            t.localTurma,
            t.turnoTurma,

            c.idCurso,
            c.nomeCurso,

            d.codDisciplina,
            d.nomeDisciplina,
            d.tipoDisciplina,
            d.cargaHoraria,

            pe.idPeriodo,
            pe.numeroPeriodo,
            pe.nomePeriodo

          FROM ProfessorTurma pt

          INNER JOIN Turma t
            ON t.idTurma =
               pt.idTurma

          INNER JOIN Curso c
            ON c.idCurso =
               t.idCurso

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               pt.codDisciplina

          INNER JOIN Periodo pe
            ON pe.idPeriodo =
               d.idPeriodo

          WHERE pt.idProfessorTurma = ?

            AND pt.idProfessor = ?

          LIMIT 1
        `,
        [
          idProfessorTurma,
          professor.idProfessor
        ]
      )


    if (
      turmas.length === 0
    ) {

      return res.status(404).json({
        message:
          'Turma não encontrada ou não está sob responsabilidade deste professor.'
      })

    }


    const turma =
      turmas[0]


    // ALUNOS MATRICULADOS

    const [alunos] =
      await database.execute(
        `
          SELECT
            m.idMatricula,
            m.statusMatricula,
            m.dataMatricula,

            a.idAluno,
            a.nome,
            a.email,
            a.numeroMatricula

          FROM Matricula m

          INNER JOIN Aluno a
            ON a.idAluno =
               m.idAluno

          WHERE m.idTurma = ?

            AND m.codDisciplina = ?

          ORDER BY
            a.nome ASC
        `,
        [
          turma.idTurma,
          turma.codDisciplina
        ]
      )


    return res.status(200).json({

      professor,

      turma,

      alunos

    })


  } catch (error) {

    console.error(
      'Erro ao consultar turma do professor:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar os dados da turma.'
    })

  }

}