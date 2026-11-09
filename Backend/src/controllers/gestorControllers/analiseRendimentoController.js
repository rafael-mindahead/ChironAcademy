import database from '../../config/database.js'


function classificarRendimento(
  mediaNota,
  percentualFrequencia,
  matriculasConcluidas
) {

  const dadosSuficientes =
    Number(matriculasConcluidas) > 0 &&
    mediaNota !== null &&
    percentualFrequencia !== null


  if (!dadosSuficientes) {

    return 'DADOS_INSUFICIENTES'

  }


  if (
    Number(mediaNota) >= 7 &&
    Number(percentualFrequencia) >= 75
  ) {

    return 'ALTO'

  }


  return 'BAIXO'

}


function normalizarIndicador(
  item
) {

  const presentes =
    Number(item.presentes || 0)

  const faltas =
    Number(item.faltas || 0)

  const aulasConsideradas =
    presentes + faltas

  const percentualFrequencia =
    aulasConsideradas > 0
      ? Number(
          (
            presentes /
            aulasConsideradas *
            100
          ).toFixed(2)
        )
      : null

  const mediaNota =
    item.mediaNota === null
      ? null
      : Number(item.mediaNota)


  return {
    ...item,

    matriculasConcluidas:
      Number(
        item.matriculasConcluidas || 0
      ),

    mediaNota,

    presentes,

    faltas,

    aulasConsideradas,

    percentualFrequencia,

    classificacao:
      classificarRendimento(
        mediaNota,
        percentualFrequencia,
        item.matriculasConcluidas
      )
  }

}


export async function consultarAnaliseRendimento(
  req,
  res
) {

  try {

    const numeroPeriodo =
      req.query.numeroPeriodo === undefined ||
      req.query.numeroPeriodo === ''
        ? null
        : Number(
            req.query.numeroPeriodo
          )


    if (
      numeroPeriodo !== null &&
      (
        !Number.isInteger(
          numeroPeriodo
        ) ||
        numeroPeriodo <= 0
      )
    ) {

      return res.status(400).json({
        message:
          'Período curricular inválido.'
      })

    }


    const [periodos] =
      await database.execute(
        `
          SELECT DISTINCT
            numeroPeriodo

          FROM Periodo

          ORDER BY
            numeroPeriodo ASC
        `
      )


    const parametros = [
      numeroPeriodo,
      numeroPeriodo
    ]


    const baseCte = `
      WITH matriculas_concluidas AS (

        SELECT
          m.idMatricula,
          m.idTurma,

          d.idCurso,
          d.codDisciplina,
          d.nomeDisciplina,

          p.numeroPeriodo

        FROM Matricula m

        INNER JOIN Disciplina d
          ON d.codDisciplina =
             m.codDisciplina

        INNER JOIN Periodo p
          ON p.idPeriodo =
             d.idPeriodo

        WHERE m.statusMatricula IN (
          'APROVADO',
          'REPROVADO'
        )

          AND (
            ? IS NULL OR
            p.numeroPeriodo = ?
          )

      ),

      notas_matricula AS (

        SELECT
          mc.idMatricula,

          AVG(
            n.valor /
            NULLIF(
              av.valorMaximo,
              0
            ) *
            10
          ) AS mediaNota

        FROM matriculas_concluidas mc

        INNER JOIN Nota n
          ON n.idMatricula =
             mc.idMatricula

        INNER JOIN Avaliacao av
          ON av.idAvaliacao =
             n.idAvaliacao

        GROUP BY
          mc.idMatricula

      ),

      frequencia_matricula AS (

        SELECT
          mc.idMatricula,

          SUM(
            f.statusFrequencia =
            'PRESENTE'
          ) AS presentes,

          SUM(
            f.statusFrequencia =
            'FALTA'
          ) AS faltas

        FROM matriculas_concluidas mc

        INNER JOIN Frequencia f
          ON f.idMatricula =
             mc.idMatricula

        INNER JOIN Aula au
          ON au.idAula =
             f.idAula

        INNER JOIN ProfessorTurma pt
          ON pt.idProfessorTurma =
             au.idProfessorTurma

         AND pt.idTurma =
             mc.idTurma

         AND pt.codDisciplina =
             mc.codDisciplina

        GROUP BY
          mc.idMatricula

      )
    `


    const [cursos] =
      await database.execute(
        `
          ${baseCte}

          SELECT
            c.idCurso,
            c.nomeCurso,

            COUNT(
              DISTINCT
              mc.idMatricula
            ) AS matriculasConcluidas,

            ROUND(
              AVG(
                nm.mediaNota
              ),
              2
            ) AS mediaNota,

            COALESCE(
              SUM(
                fm.presentes
              ),
              0
            ) AS presentes,

            COALESCE(
              SUM(
                fm.faltas
              ),
              0
            ) AS faltas

          FROM matriculas_concluidas mc

          INNER JOIN Curso c
            ON c.idCurso =
               mc.idCurso

          LEFT JOIN notas_matricula nm
            ON nm.idMatricula =
               mc.idMatricula

          LEFT JOIN frequencia_matricula fm
            ON fm.idMatricula =
               mc.idMatricula

          GROUP BY
            c.idCurso,
            c.nomeCurso

          ORDER BY
            c.nomeCurso ASC
        `,
        parametros
      )


    const [disciplinas] =
      await database.execute(
        `
          ${baseCte}

          SELECT
            mc.idCurso,
            c.nomeCurso,

            mc.codDisciplina,
            mc.nomeDisciplina,

            COUNT(
              DISTINCT
              mc.idMatricula
            ) AS matriculasConcluidas,

            ROUND(
              AVG(
                nm.mediaNota
              ),
              2
            ) AS mediaNota,

            COALESCE(
              SUM(
                fm.presentes
              ),
              0
            ) AS presentes,

            COALESCE(
              SUM(
                fm.faltas
              ),
              0
            ) AS faltas

          FROM matriculas_concluidas mc

          INNER JOIN Curso c
            ON c.idCurso =
               mc.idCurso

          LEFT JOIN notas_matricula nm
            ON nm.idMatricula =
               mc.idMatricula

          LEFT JOIN frequencia_matricula fm
            ON fm.idMatricula =
               mc.idMatricula

          GROUP BY
            mc.idCurso,
            c.nomeCurso,
            mc.codDisciplina,
            mc.nomeDisciplina

          ORDER BY
            c.nomeCurso ASC,
            mc.nomeDisciplina ASC
        `,
        parametros
      )


    const cursosNormalizados =
      cursos.map(
        normalizarIndicador
      )


    const disciplinasNormalizadas =
      disciplinas.map(
        normalizarIndicador
      )


    const mapeamento =
      cursosNormalizados.map(
        curso => ({

          ...curso,

          disciplinas:
            disciplinasNormalizadas
              .filter(
                disciplina =>
                  Number(
                    disciplina.idCurso
                  ) ===
                  Number(
                    curso.idCurso
                  )
              )
              .sort(
                (
                  primeira,
                  segunda
                ) => {

                  const ordem = {
                    BAIXO: 0,
                    ALTO: 1,
                    DADOS_INSUFICIENTES: 2
                  }

                  return (
                    ordem[
                      primeira.classificacao
                    ] -
                    ordem[
                      segunda.classificacao
                    ]
                  )

                }
              )

        })
      )


    return res.status(200).json({

      criterios: {
        notaMinima:
          7,

        frequenciaMinima:
          75,

        base:
          'Matrículas concluídas (APROVADO ou REPROVADO)'
      },

      numeroPeriodo,

      periodos:
        periodos.map(
          periodo =>
            Number(
              periodo.numeroPeriodo
            )
        ),

      comparacao: {
        cursos:
          cursosNormalizados,

        disciplinas:
          disciplinasNormalizadas
      },

      mapeamento

    })


  } catch (error) {

    console.error(
      'Erro ao consultar análise de rendimento:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar a análise de rendimento.'
    })

  }

}
