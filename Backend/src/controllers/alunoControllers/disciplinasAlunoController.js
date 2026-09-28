import database from '../../config/database.js'

// Sprint 2 | Consultar disciplinas matriculadas


async function buscarAlunoAutenticado(
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


  const [alunos] =
    await database.execute(
      `
        SELECT
          a.idAluno,
          a.nome,
          a.telefone,
          a.email,
          a.numeroMatricula,
          a.idCurso,
          a.idPeriodo,

          c.nomeCurso

        FROM Aluno a

        INNER JOIN Curso c
          ON c.idCurso =
             a.idCurso

        WHERE LOWER(a.email) = ?

        LIMIT 1
      `,
      [
        email
      ]
    )


  if (
    alunos.length === 0
  ) {

    return null

  }


  return alunos[0]

}


export async function listarDisciplinasMatriculadas(
  req,
  res
) {

  try {

    const aluno =
      await buscarAlunoAutenticado(
        req
      )


    if (!aluno) {

      return res.status(404).json({
        message:
          'Não foi encontrado um cadastro de aluno vinculado a esta conta.'
      })

    }


    const [periodos] =
      await database.execute(
        `
          SELECT
            idPeriodo,
            numeroPeriodo,
            nomePeriodo

          FROM Periodo

          WHERE idCurso = ?

          ORDER BY
            numeroPeriodo ASC,
            idPeriodo ASC
        `,
        [
          aluno.idCurso
        ]
      )


    let idPeriodo =
      req.query.periodo
        ? Number(
            req.query.periodo
          )
        : Number(
            aluno.idPeriodo
          )


    if (
      !Number.isInteger(
        idPeriodo
      ) ||
      idPeriodo <= 0
    ) {

      return res.status(400).json({
        message:
          'Período acadêmico inválido.'
      })

    }


    const periodoSelecionado =
      periodos.find(
        periodo =>
          Number(
            periodo.idPeriodo
          ) ===
          idPeriodo
      )


    if (!periodoSelecionado) {

      return res.status(400).json({
        message:
          'O período selecionado não pertence ao curso do aluno.'
      })

    }


    const [disciplinas] =
      await database.execute(
        `
          SELECT
            m.idMatricula,
            m.dataMatricula,
            m.statusMatricula,

            d.codDisciplina,
            d.nomeDisciplina,
            d.tipoDisciplina,
            d.cargaHoraria,

            p.idPeriodo,
            p.numeroPeriodo,
            p.nomePeriodo,

            t.idTurma,
            t.localTurma,
            t.turnoTurma

          FROM Matricula m

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               m.codDisciplina

          INNER JOIN Periodo p
            ON p.idPeriodo =
               d.idPeriodo

          INNER JOIN Turma t
            ON t.idTurma =
               m.idTurma

          WHERE m.idAluno = ?

            AND m.statusMatricula =
                'CURSANDO'

            AND d.idPeriodo = ?

            AND d.idCurso = ?

            AND t.idCurso = ?

          ORDER BY
            d.nomeDisciplina ASC,
            t.idTurma ASC
        `,
        [
          aluno.idAluno,
          idPeriodo,
          aluno.idCurso,
          aluno.idCurso
        ]
      )


    return res.status(200).json({

      aluno,

      periodos,

      periodoSelecionado,

      disciplinas

    })


  } catch (error) {

    console.error(
      'Erro ao consultar disciplinas do aluno:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar as disciplinas matriculadas.'
    })

  }

}
