import database from '../../config/database.js'


export async function consultarIndicadoresCursos(
  req,
  res
) {

  try {

    const idCurso =
      req.query.idCurso === undefined
        ? null
        : Number(req.query.idCurso)

    const idPeriodo =
      req.query.idPeriodo === undefined
        ? null
        : Number(req.query.idPeriodo)


    if (
      idCurso !== null &&
      (
        !Number.isInteger(idCurso) ||
        idCurso <= 0
      )
    ) {

      return res.status(400).json({
        message:
          'Curso inválido.'
      })

    }

    if (
      idPeriodo !== null &&
      (
        !Number.isInteger(idPeriodo) ||
        idPeriodo <= 0 ||
        idCurso === null
      )
    ) {

      return res.status(400).json({
        message:
          'Selecione um curso e um período válidos.'
      })

    }


    const [cursos] =
      await database.execute(
        `
          SELECT
            idCurso,
            nomeCurso

          FROM Curso

          ORDER BY
            nomeCurso ASC
        `
      )


    if (
      idCurso !== null &&
      !cursos.some(
        curso =>
          Number(curso.idCurso) === idCurso
      )
    ) {

      return res.status(404).json({
        message:
          'Curso não encontrado.'
      })

    }

    const [periodos] =
      await database.execute(
        `
          SELECT
            idPeriodo,
            numeroPeriodo,
            nomePeriodo,
            idCurso

          FROM Periodo

          ${idCurso === null ? '' : 'WHERE idCurso = ?'}

          ORDER BY
            idCurso ASC,
            numeroPeriodo ASC,
            nomePeriodo ASC
        `,
        idCurso === null
          ? []
          : [idCurso]
      )

    const periodoSelecionado =
      idPeriodo === null
        ? null
        : periodos.find(
            periodo =>
              Number(periodo.idPeriodo) === idPeriodo &&
              Number(periodo.idCurso) === idCurso
          )

    if (idPeriodo !== null && !periodoSelecionado) {
      return res.status(404).json({
        message:
          'O período selecionado não pertence ao curso escolhido.'
      })
    }

    const filtroPeriodo =
      idPeriodo === null
        ? ''
        : 'AND d.idPeriodo = ?'

    const parametrosPeriodo =
      idPeriodo === null
        ? []
        : [idPeriodo]


    const [alunosAgrupados] =
      await database.execute(
        idPeriodo === null
          ? `
              SELECT
                idCurso,
                COUNT(*) AS total

              FROM Aluno

              GROUP BY idCurso
            `
          : `
              SELECT
                d.idCurso,
                COUNT(DISTINCT m.idAluno) AS total

              FROM Matricula m

              INNER JOIN Disciplina d
                ON d.codDisciplina = m.codDisciplina

              WHERE d.idPeriodo = ?

              GROUP BY d.idCurso
            `,
        idPeriodo === null
          ? []
          : [idPeriodo]
      )


    const [disciplinasAgrupadas] =
      await database.execute(
        `
          SELECT
            idCurso,
            COUNT(*) AS total

          FROM Disciplina

          ${idPeriodo === null ? '' : 'WHERE idPeriodo = ?'}

          GROUP BY
            idCurso
        `,
        parametrosPeriodo
      )


    const [turmasAgrupadas] =
      await database.execute(
        idPeriodo === null
          ? `
              SELECT
                idCurso,
                COUNT(*) AS total

              FROM Turma

              GROUP BY idCurso
            `
          : `
              SELECT
                d.idCurso,
                COUNT(DISTINCT m.idTurma) AS total

              FROM Matricula m

              INNER JOIN Disciplina d
                ON d.codDisciplina = m.codDisciplina

              WHERE d.idPeriodo = ?

              GROUP BY d.idCurso
            `,
        parametrosPeriodo
      )


    const [matriculasAgrupadas] =
      await database.execute(
        `
          SELECT
            d.idCurso,
            m.statusMatricula AS status,
            COUNT(*) AS total

          FROM Matricula m

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               m.codDisciplina

          WHERE 1 = 1

            ${filtroPeriodo}

          GROUP BY
            d.idCurso,
            m.statusMatricula
        `,
        parametrosPeriodo
      )


    const [notasAgrupadas] =
      await database.execute(
        `
          SELECT
            d.idCurso,
            COUNT(DISTINCT n.idNota) AS total

          FROM Nota n

          INNER JOIN Matricula m
            ON m.idMatricula =
               n.idMatricula

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               m.codDisciplina

          INNER JOIN Avaliacao av
            ON av.idAvaliacao =
               n.idAvaliacao

          INNER JOIN ProfessorTurma pt
            ON pt.idProfessorTurma =
               av.idProfessorTurma

           AND pt.idTurma =
               m.idTurma

           AND pt.codDisciplina =
               m.codDisciplina

          WHERE 1 = 1

            ${filtroPeriodo}

          GROUP BY
            d.idCurso
        `,
        parametrosPeriodo
      )


    const [frequenciasAgrupadas] =
      await database.execute(
        `
          SELECT
            d.idCurso,
            f.statusFrequencia AS status,
            COUNT(DISTINCT f.idFrequencia) AS total

          FROM Frequencia f

          INNER JOIN Matricula m
            ON m.idMatricula =
               f.idMatricula

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               m.codDisciplina

          INNER JOIN Aula au
            ON au.idAula =
               f.idAula

          INNER JOIN ProfessorTurma pt
            ON pt.idProfessorTurma =
               au.idProfessorTurma

           AND pt.idTurma =
               m.idTurma

           AND pt.codDisciplina =
               m.codDisciplina

          WHERE 1 = 1

            ${filtroPeriodo}

          GROUP BY
            d.idCurso,
            f.statusFrequencia
        `,
        parametrosPeriodo
      )


    const cursosParaIndicadores =
      idCurso === null
        ? cursos
        : cursos.filter(
            curso =>
              Number(curso.idCurso) === idCurso
          )


    const indicadores =
      cursosParaIndicadores.map(
        curso => {

          const alunosDoCurso =
            alunosAgrupados.find(
              item =>
                Number(item.idCurso) ===
                Number(curso.idCurso)
            )


          const disciplinasDoCurso =
            disciplinasAgrupadas.find(
              item =>
                Number(item.idCurso) ===
                Number(curso.idCurso)
            )


          const turmasDoCurso =
            turmasAgrupadas.find(
              item =>
                Number(item.idCurso) ===
                Number(curso.idCurso)
            )


          const notasDoCurso =
            notasAgrupadas.find(
              item =>
                Number(item.idCurso) ===
                Number(curso.idCurso)
            )


          const frequenciasDoCurso =
            frequenciasAgrupadas
              .filter(
                item =>
                  Number(item.idCurso) ===
                  Number(curso.idCurso)
              )
              .map(
                item => ({
                  status:
                    item.status,

                  total:
                    Number(item.total)
                })
              )


          return {

            idCurso:
              Number(curso.idCurso),

            nomeCurso:
              curso.nomeCurso,

            idPeriodo:
              periodoSelecionado
                ? Number(periodoSelecionado.idPeriodo)
                : null,

            numeroPeriodo:
              periodoSelecionado
                ? Number(periodoSelecionado.numeroPeriodo)
                : null,

            nomePeriodo:
              periodoSelecionado?.nomePeriodo || null,

            alunosCadastrados:
              alunosDoCurso
                ? Number(alunosDoCurso.total)
                : 0,

            disciplinas:
              disciplinasDoCurso
                ? Number(disciplinasDoCurso.total)
                : 0,

            turmas:
              turmasDoCurso
                ? Number(turmasDoCurso.total)
                : 0,

            matriculasPorStatus:
              matriculasAgrupadas
                .filter(
                  item =>
                    Number(item.idCurso) ===
                    Number(curso.idCurso)
                )
                .map(
                  item => ({
                    status:
                      item.status,

                    total:
                      Number(item.total)
                  })
                ),

            notasLancadas:
              notasDoCurso
                ? Number(notasDoCurso.total)
                : 0,

            frequenciasRegistradas:
              frequenciasDoCurso.reduce(
                (total, frequencia) =>
                  total + frequencia.total,
                0
              ),

            frequenciasPorStatus:
              frequenciasDoCurso

          }

        }
      )


    return res.status(200).json({

      cursos,

      periodos,

      indicadores

    })


  } catch (error) {

    console.error(
      'Erro ao consultar indicadores dos cursos:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar os indicadores dos cursos.'
    })

  }

}