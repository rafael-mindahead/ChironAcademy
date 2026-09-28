import database from '../../config/database.js'

// Sprint 2 | Consultar desempenho por disciplina


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
          idAluno,
          nome,
          email,
          numeroMatricula,
          idCurso,
          idPeriodo

        FROM Aluno

        WHERE LOWER(email) = ?

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


async function buscarMatriculaDoAluno(
  idMatricula,
  idAluno
) {

  const [matriculas] =
    await database.execute(
      `
        SELECT
          m.idMatricula,
          m.dataMatricula,
          m.statusMatricula,

          m.idAluno,
          m.idTurma,
          m.codDisciplina,

          d.nomeDisciplina,
          d.tipoDisciplina,
          d.cargaHoraria,

          p.idPeriodo,
          p.numeroPeriodo,
          p.nomePeriodo,

          t.localTurma,
          t.turnoTurma,

          c.idCurso,
          c.nomeCurso

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

        INNER JOIN Curso c
          ON c.idCurso =
             d.idCurso

        WHERE m.idMatricula = ?

          AND m.idAluno = ?

        LIMIT 1
      `,
      [
        idMatricula,
        idAluno
      ]
    )


  if (
    matriculas.length === 0
  ) {

    return null

  }


  return matriculas[0]

}


export async function consultarDesempenhoDisciplina(
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


    const idMatricula =
      Number(
        req.params.idMatricula
      )


    if (
      !Number.isInteger(
        idMatricula
      ) ||
      idMatricula <= 0
    ) {

      return res.status(400).json({
        message:
          'Matrícula inválida.'
      })

    }


    const matricula =
      await buscarMatriculaDoAluno(
        idMatricula,
        aluno.idAluno
      )


    if (!matricula) {

      return res.status(404).json({
        message:
          'Disciplina não encontrada entre as matrículas deste aluno.'
      })

    }


    // NOTAS E AVALIAÇÕES

    const [avaliacoes] =
      await database.execute(
        `
          SELECT
            av.idAvaliacao,
            av.titulo,
            av.descricao,
            av.dataAvaliacao,
            av.valorMaximo,

            n.idNota,
            n.valor,
            n.observacao,
            n.createdAt,
            n.updatedAt

          FROM ProfessorTurma pt

          INNER JOIN Avaliacao av
            ON av.idProfessorTurma =
               pt.idProfessorTurma

          LEFT JOIN Nota n
            ON n.idAvaliacao =
               av.idAvaliacao

           AND n.idMatricula = ?

          WHERE pt.idTurma = ?

            AND pt.codDisciplina = ?

          ORDER BY
            av.dataAvaliacao ASC,
            av.idAvaliacao ASC
        `,
        [
          matricula.idMatricula,
          matricula.idTurma,
          matricula.codDisciplina
        ]
      )


    // FREQUÊNCIA

    const [aulas] =
      await database.execute(
        `
          SELECT
            au.idAula,
            au.dataAula,
            au.conteudo,

            f.idFrequencia,
            f.statusFrequencia,
            f.observacao,
            f.createdAt,
            f.updatedAt

          FROM ProfessorTurma pt

          INNER JOIN Aula au
            ON au.idProfessorTurma =
               pt.idProfessorTurma

          LEFT JOIN Frequencia f
            ON f.idAula =
               au.idAula

           AND f.idMatricula = ?

          WHERE pt.idTurma = ?

            AND pt.codDisciplina = ?

          ORDER BY
            au.dataAula ASC,
            au.idAula ASC
        `,
        [
          matricula.idMatricula,
          matricula.idTurma,
          matricula.codDisciplina
        ]
      )


    const notasRegistradas =
      avaliacoes.filter(
        avaliacao =>
          avaliacao.idNota !== null
      )


    const frequenciasRegistradas =
      aulas.filter(
        aula =>
          aula.idFrequencia !== null
      )


    const presentes =
      frequenciasRegistradas.filter(
        aula =>
          aula.statusFrequencia ===
          'PRESENTE'
      ).length


    const faltas =
      frequenciasRegistradas.filter(
        aula =>
          aula.statusFrequencia ===
          'FALTA'
      ).length


    const justificadas =
      frequenciasRegistradas.filter(
        aula =>
          aula.statusFrequencia ===
          'JUSTIFICADA'
      ).length


    return res.status(200).json({

      aluno,

      disciplina:
        matricula,

      desempenho: {

        notas: {
          disponivel:
            notasRegistradas.length > 0,

          totalAvaliacoes:
            avaliacoes.length,

          totalRegistradas:
            notasRegistradas.length,

          avaliacoes
        },

        frequencia: {
          disponivel:
            frequenciasRegistradas.length > 0,

          totalAulas:
            aulas.length,

          totalRegistradas:
            frequenciasRegistradas.length,

          presentes,

          faltas,

          justificadas,

          aulas
        }

      }

    })


  } catch (error) {

    console.error(
      'Erro ao consultar desempenho do aluno:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar o desempenho da disciplina.'
    })

  }

}