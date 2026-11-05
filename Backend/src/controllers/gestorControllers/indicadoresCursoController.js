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


          return {

            idCurso:
              Number(curso.idCurso),

            nomeCurso:
              curso.nomeCurso,

            alunosCadastrados:
              alunosDoCurso
                ? Number(alunosDoCurso.total)
                : 0

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