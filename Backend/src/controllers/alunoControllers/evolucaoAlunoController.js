import database from '../../config/database.js'

// Sprint 2 | Acompanhar evolução no período


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


function normalizarData(
  valor
) {

  if (!valor) {

    return null

  }


  if (
    valor instanceof Date
  ) {

    return valor
      .toISOString()
      .slice(0, 10)

  }


  return String(
    valor
  ).slice(0, 10)

}


export async function consultarEvolucaoPeriodo(
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


    const idPeriodo =
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


    const [periodos] =
      await database.execute(
        `
          SELECT
            idPeriodo,
            numeroPeriodo,
            nomePeriodo

          FROM Periodo

          WHERE idPeriodo = ?

            AND idCurso = ?

          LIMIT 1
        `,
        [
          idPeriodo,
          aluno.idCurso
        ]
      )


    if (
      periodos.length === 0
    ) {

      return res.status(400).json({
        message:
          'O período selecionado não pertence ao curso do aluno.'
      })

    }


    const periodoSelecionado =
      periodos[0]


    const [notas] =
      await database.execute(
        `
          SELECT
            n.idNota,
            n.valor,
            n.observacao,

            av.idAvaliacao,
            av.titulo,
            av.valorMaximo,
            av.dataAvaliacao,

            m.idMatricula,

            d.codDisciplina,
            d.nomeDisciplina

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

          WHERE m.idAluno = ?

            AND d.idPeriodo = ?

            AND d.idCurso = ?

          ORDER BY
            av.dataAvaliacao ASC,
            av.idAvaliacao ASC
        `,
        [
          aluno.idAluno,
          idPeriodo,
          aluno.idCurso
        ]
      )


    const [frequencias] =
      await database.execute(
        `
          SELECT
            f.idFrequencia,
            f.statusFrequencia,
            f.observacao,

            au.idAula,
            au.dataAula,
            au.conteudo,

            m.idMatricula,

            d.codDisciplina,
            d.nomeDisciplina

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

          WHERE m.idAluno = ?

            AND d.idPeriodo = ?

            AND d.idCurso = ?

          ORDER BY
            au.dataAula ASC,
            au.idAula ASC
        `,
        [
          aluno.idAluno,
          idPeriodo,
          aluno.idCurso
        ]
      )


    const eventosNotas =
      notas.map(
        nota => ({

          tipo:
            'NOTA',

          data:
            normalizarData(
              nota.dataAvaliacao
            ),

          idRegistro:
            nota.idNota,

          idMatricula:
            nota.idMatricula,

          codDisciplina:
            nota.codDisciplina,

          nomeDisciplina:
            nota.nomeDisciplina,

          titulo:
            nota.titulo,

          valor:
            Number(
              nota.valor
            ),

          valorMaximo:
            Number(
              nota.valorMaximo
            ),

          observacao:
            nota.observacao

        })
      )


    const eventosFrequencia =
      frequencias.map(
        frequencia => ({

          tipo:
            'FREQUENCIA',

          data:
            normalizarData(
              frequencia.dataAula
            ),

          idRegistro:
            frequencia.idFrequencia,

          idMatricula:
            frequencia.idMatricula,

          codDisciplina:
            frequencia.codDisciplina,

          nomeDisciplina:
            frequencia.nomeDisciplina,

          conteudo:
            frequencia.conteudo,

          statusFrequencia:
            frequencia.statusFrequencia,

          observacao:
            frequencia.observacao

        })
      )


    const eventos = [
      ...eventosNotas,
      ...eventosFrequencia
    ]


    eventos.sort(
      (a, b) => {

        const comparacaoData =
          a.data.localeCompare(
            b.data
          )


        if (
          comparacaoData !== 0
        ) {

          return comparacaoData

        }


        return a.tipo.localeCompare(
          b.tipo
        )

      }
    )


    const datasDistintas =
      new Set(
        eventos.map(
          evento =>
            evento.data
        )
      ).size


    return res.status(200).json({

      aluno,

      periodoSelecionado,

      evolucao: {

        dadosSuficientes:
          datasDistintas >= 2,

        totalRegistros:
          eventos.length,

        datasDistintas,

        totalNotas:
          eventosNotas.length,

        totalFrequencias:
          eventosFrequencia.length,

        eventos

      }

    })


  } catch (error) {

    console.error(
      'Erro ao consultar evolução acadêmica:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar a evolução acadêmica.'
    })

  }

}
