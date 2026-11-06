import database from '../../config/database.js'
import {
  calcularIndicadoresRendimento
} from '../../services/rendimentoService.js'

// Sprint 2 | Consultar desempenho dos alunos


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


async function buscarVinculoProfessor(
  idProfessorTurma,
  idProfessor
) {

  const [vinculos] =
    await database.execute(
      `
        SELECT
          pt.idProfessorTurma,

          t.idTurma,
          t.localTurma,
          t.turnoTurma,

          d.codDisciplina,
          d.nomeDisciplina,

          p.idPeriodo,
          p.numeroPeriodo,
          p.nomePeriodo,

          c.idCurso,
          c.nomeCurso

        FROM ProfessorTurma pt

        INNER JOIN Turma t
          ON t.idTurma =
             pt.idTurma

        INNER JOIN Disciplina d
          ON d.codDisciplina =
             pt.codDisciplina

        INNER JOIN Periodo p
          ON p.idPeriodo =
             d.idPeriodo

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


  if (
    vinculos.length === 0
  ) {

    return null

  }


  return vinculos[0]

}


async function buscarMatriculaDaTurma(
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


  if (
    matriculas.length === 0
  ) {

    return null

  }


  return matriculas[0]

}


// ======================================================
// LISTAR DESEMPENHO DA TURMA
// ======================================================

export async function listarDesempenhoTurma(
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


    if (
      !Number.isInteger(
        idProfessorTurma
      ) ||
      idProfessorTurma <= 0
    ) {

      return res.status(400).json({
        message:
          'Turma inválida.'
      })

    }


    const vinculo =
      await buscarVinculoProfessor(
        idProfessorTurma,
        professor.idProfessor
      )


    if (!vinculo) {

      return res.status(403).json({
        message:
          'Esta turma não pertence ao professor autenticado.'
      })

    }


    const [alunos] =
      await database.execute(
        `
          SELECT
            m.idMatricula,
            a.idAluno,
            a.nome,
            a.numeroMatricula

          FROM Matricula m

          INNER JOIN Aluno a
            ON a.idAluno =
               m.idAluno

          WHERE m.idTurma = ?

            AND m.codDisciplina = ?

            AND m.statusMatricula = 'CURSANDO'

          ORDER BY
            a.nome ASC
        `,
        [
          vinculo.idTurma,
          vinculo.codDisciplina
        ]
      )

    const [avaliacoes] =
      await database.execute(
        `
          SELECT
            idAvaliacao,
            valorMaximo,
            pesoAvaliacao

          FROM Avaliacao

          WHERE idProfessorTurma = ?
        `,
        [
          idProfessorTurma
        ]
      )

    const [notas] =
      await database.execute(
        `
          SELECT
            n.idMatricula,
            n.idAvaliacao,
            n.valor

          FROM Nota n

          INNER JOIN Avaliacao av
            ON av.idAvaliacao =
               n.idAvaliacao

          INNER JOIN Matricula m
            ON m.idMatricula =
               n.idMatricula

          WHERE av.idProfessorTurma = ?

            AND m.idTurma = ?

            AND m.codDisciplina = ?

            AND m.statusMatricula = 'CURSANDO'
        `,
        [
          idProfessorTurma,
          vinculo.idTurma,
          vinculo.codDisciplina
        ]
      )

    const [frequencias] =
      await database.execute(
        `
          SELECT
            f.idMatricula,
            f.statusFrequencia,
            COUNT(*) AS total

          FROM Frequencia f

          INNER JOIN Aula au
            ON au.idAula =
               f.idAula

          INNER JOIN Matricula m
            ON m.idMatricula =
               f.idMatricula

           AND m.idTurma = ?

           AND m.codDisciplina = ?

           AND m.statusMatricula = 'CURSANDO'

          WHERE au.idProfessorTurma = ?

          GROUP BY
            f.idMatricula,
            f.statusFrequencia
        `,
        [
          vinculo.idTurma,
          vinculo.codDisciplina,
          idProfessorTurma
        ]
      )

    const alunosNormalizados =
      alunos.map(
        aluno => {
          const notasDoAluno =
            notas.filter(
              nota =>
                Number(nota.idMatricula) ===
                Number(aluno.idMatricula)
            )

          const frequenciasDoAluno =
            frequencias.filter(
              frequencia =>
                Number(frequencia.idMatricula) ===
                Number(aluno.idMatricula)
            )

          const rendimento =
            calcularIndicadoresRendimento(
              avaliacoes,
              notasDoAluno,
              frequenciasDoAluno
            )

          return {
            ...aluno,
            totalNotas: notasDoAluno.length,
            totalFrequencias:
              frequenciasDoAluno.reduce(
                (total, item) =>
                  total + Number(item.total),
                0
              ),
            presentes: rendimento.presentes,
            faltas: rendimento.faltas,
            justificadas: rendimento.justificadas,
            rendimento
          }
        }
      )


    return res.status(200).json({

      professor,

      turma:
        vinculo,

      alunos:
        alunosNormalizados

    })


  } catch (error) {

    console.error(
      'Erro ao consultar desempenho da turma:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar o desempenho da turma.'
    })

  }

}


// ======================================================
// DETALHAR DESEMPENHO DE UM ALUNO
// ======================================================

export async function consultarDesempenhoAluno(
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


    const idMatricula =
      Number(
        req.params.idMatricula
      )


    if (
      !Number.isInteger(
        idProfessorTurma
      ) ||
      idProfessorTurma <= 0 ||
      !Number.isInteger(
        idMatricula
      ) ||
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

      return res.status(403).json({
        message:
          'Esta turma não pertence ao professor autenticado.'
      })

    }


    const matricula =
      await buscarMatriculaDaTurma(
        idMatricula,
        vinculo
      )


    if (!matricula) {

      return res.status(404).json({
        message:
          'Aluno não encontrado nesta turma.'
      })

    }


    const [notas] =
      await database.execute(
        `
          SELECT
            av.idAvaliacao,
            av.titulo,
            av.descricao,
            av.dataAvaliacao,
            av.valorMaximo,
            av.pesoAvaliacao,

            n.idNota,
            n.valor,
            n.observacao

          FROM Avaliacao av

          LEFT JOIN Nota n
            ON n.idAvaliacao =
               av.idAvaliacao

           AND n.idMatricula = ?

          WHERE av.idProfessorTurma = ?

          ORDER BY
            av.dataAvaliacao ASC,
            av.idAvaliacao ASC
        `,
        [
          idMatricula,
          idProfessorTurma
        ]
      )


    const [frequencias] =
      await database.execute(
        `
          SELECT
            au.idAula,
            au.dataAula,
            au.conteudo,

            f.idFrequencia,
            f.statusFrequencia,
            f.observacao

          FROM Aula au

          LEFT JOIN Frequencia f
            ON f.idAula =
               au.idAula

           AND f.idMatricula = ?

          WHERE au.idProfessorTurma = ?

          ORDER BY
            au.dataAula ASC,
            au.idAula ASC
        `,
        [
          idMatricula,
          idProfessorTurma
        ]
      )


    const registrosFrequencia =
      frequencias.filter(
        item =>
          item.idFrequencia !== null
      )


    const presentes =
      registrosFrequencia.filter(
        item =>
          item.statusFrequencia ===
          'PRESENTE'
      ).length


    const faltas =
      registrosFrequencia.filter(
        item =>
          item.statusFrequencia ===
          'FALTA'
      ).length


    const justificadas =
      registrosFrequencia.filter(
        item =>
          item.statusFrequencia ===
          'JUSTIFICADA'
      ).length

    const rendimento =
      calcularIndicadoresRendimento(
        notas
          .map(
            item => ({
              idAvaliacao: item.idAvaliacao,
              valorMaximo: item.valorMaximo,
              pesoAvaliacao: item.pesoAvaliacao
            })
          ),
        notas
          .filter(
            item =>
              item.idNota !== null
          )
          .map(
            item => ({
              idAvaliacao: item.idAvaliacao,
              valor: item.valor
            })
          ),
        frequencias
          .filter(
            item =>
              item.idFrequencia !== null
          )
          .reduce(
            (agrupadas, item) => {
              const existente =
                agrupadas.find(
                  status =>
                    status.statusFrequencia ===
                    item.statusFrequencia
                )

              if (existente) {
                existente.total += 1
              } else {
                agrupadas.push({
                  statusFrequencia:
                    item.statusFrequencia,
                  total: 1
                })
              }

              return agrupadas
            },
            []
          )
      )


    return res.status(200).json({

      professor,

      turma:
        vinculo,

      aluno:
        matricula,

      desempenho: {

        notas,

        rendimento,

        frequencia: {

          totalRegistros:
            registrosFrequencia.length,

          presentes,

          faltas,

          justificadas,

          aulas:
            frequencias

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
        'Não foi possível consultar o desempenho do aluno.'
    })

  }

}