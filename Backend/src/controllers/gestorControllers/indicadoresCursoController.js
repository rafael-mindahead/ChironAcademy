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


    const [alunosAgrupados] =
      await database.execute(
        `
          SELECT
            idCurso,
            COUNT(*) AS total

          FROM Aluno

          GROUP BY
            idCurso
        `
      )


    const [disciplinasAgrupadas] =
      await database.execute(
        `
          SELECT
            idCurso,
            COUNT(*) AS total

          FROM Disciplina

          GROUP BY
            idCurso
        `
      )


    const [turmasAgrupadas] =
      await database.execute(
        `
          SELECT
            idCurso,
            COUNT(*) AS total

          FROM Turma

          GROUP BY
            idCurso
        `
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

          GROUP BY
            d.idCurso,
            m.statusMatricula
        `
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

          GROUP BY
            d.idCurso
        `
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

          GROUP BY
            d.idCurso,
            f.statusFrequencia
        `
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