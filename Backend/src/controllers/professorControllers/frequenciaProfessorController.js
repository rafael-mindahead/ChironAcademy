import database from '../../config/database.js'

// PBI 12 | Aceite: o professor registra e altera a frequência dos matriculados somente nas próprias turmas.


const statusValidos = [
  'PRESENTE',
  'FALTA',
  'JUSTIFICADA'
]


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


// AULA

async function buscarAula(
  idAula,
  idProfessorTurma
) {

  const [aulas] =
    await database.execute(
      `
        SELECT
          idAula,
          dataAula,
          conteudo,
          idProfessorTurma,
          createdAt,
          updatedAt

        FROM Aula

        WHERE idAula = ?

          AND idProfessorTurma = ?

        LIMIT 1
      `,
      [
        idAula,
        idProfessorTurma
      ]
    )


  if (aulas.length === 0) {
    return null
  }


  return aulas[0]
}


// MATRÍCULA DA TURMA

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
          a.email,
          a.numeroMatricula

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


// VALIDAR AULA

function validarAula(body) {

  const dataAula =
    body.dataAula
      ?.trim()


  const conteudo =
    body.conteudo
      ?.trim() ||
    null


  if (!dataAula) {

    return {
      erro:
        'A data da aula é obrigatória.'
    }

  }


  if (
    !/^\d{4}-\d{2}-\d{2}$/
      .test(dataAula)
  ) {

    return {
      erro:
        'A data da aula é inválida.'
    }

  }


  if (
    conteudo &&
    conteudo.length > 500
  ) {

    return {
      erro:
        'O conteúdo da aula deve possuir no máximo 500 caracteres.'
    }

  }


  return {
    dataAula,
    conteudo
  }
}


// LISTAR AULAS

export async function listarAulas(
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
          'Vínculo acadêmico inválido.'
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


    const [aulas] =
      await database.execute(
        `
          SELECT
            au.idAula,
            au.dataAula,
            au.conteudo,
            au.idProfessorTurma,
            au.createdAt,
            au.updatedAt,

            COUNT(
              f.idFrequencia
            ) AS totalRegistrados,

            SUM(
              CASE
                WHEN f.statusFrequencia = 'PRESENTE'
                THEN 1
                ELSE 0
              END
            ) AS presentes,

            SUM(
              CASE
                WHEN f.statusFrequencia = 'FALTA'
                THEN 1
                ELSE 0
              END
            ) AS faltas,

            SUM(
              CASE
                WHEN f.statusFrequencia = 'JUSTIFICADA'
                THEN 1
                ELSE 0
              END
            ) AS justificadas

          FROM Aula au

          LEFT JOIN Frequencia f
            ON f.idAula =
               au.idAula

          WHERE au.idProfessorTurma = ?

          GROUP BY
            au.idAula,
            au.dataAula,
            au.conteudo,
            au.idProfessorTurma,
            au.createdAt,
            au.updatedAt

          ORDER BY
            au.dataAula DESC,
            au.idAula DESC
        `,
        [
          idProfessorTurma
        ]
      )


    return res.status(200).json({

      professor,

      turma:
        vinculo,

      aulas

    })


  } catch (error) {

    console.error(
      'Erro ao listar aulas:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível listar as aulas.'
    })

  }

}


// CRIAR AULA

export async function criarAula(
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


    const dados =
      validarAula(
        req.body
      )


    if (dados.erro) {

      return res.status(400).json({
        message:
          dados.erro
      })

    }


    const [resultado] =
      await database.execute(
        `
          INSERT INTO Aula
          (
            dataAula,
            conteudo,
            idProfessorTurma
          )

          VALUES (?, ?, ?)
        `,
        [
          dados.dataAula,
          dados.conteudo,
          idProfessorTurma
        ]
      )


    const aula =
      await buscarAula(
        resultado.insertId,
        idProfessorTurma
      )


    return res.status(201).json({

      message:
        'Aula criada com sucesso.',

      aula

    })


  } catch (error) {

    console.error(
      'Erro ao criar aula:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível criar a aula.'
    })

  }

}


// ATUALIZAR AULA

export async function atualizarAula(
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


    const idAula =
      Number(
        req.params.idAula
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


    const aula =
      await buscarAula(
        idAula,
        idProfessorTurma
      )


    if (!aula) {

      return res.status(404).json({
        message:
          'Aula não encontrada.'
      })

    }


    const dados =
      validarAula(
        req.body
      )


    if (dados.erro) {

      return res.status(400).json({
        message:
          dados.erro
      })

    }


    await database.execute(
      `
        UPDATE Aula

        SET
          dataAula = ?,
          conteudo = ?

        WHERE idAula = ?

          AND idProfessorTurma = ?
      `,
      [
        dados.dataAula,
        dados.conteudo,
        idAula,
        idProfessorTurma
      ]
    )


    const aulaAtualizada =
      await buscarAula(
        idAula,
        idProfessorTurma
      )


    return res.status(200).json({

      message:
        'Aula atualizada com sucesso.',

      aula:
        aulaAtualizada

    })


  } catch (error) {

    console.error(
      'Erro ao atualizar aula:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível atualizar a aula.'
    })

  }

}


// EXCLUIR AULA

export async function excluirAula(
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


    const idAula =
      Number(
        req.params.idAula
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


    const [resultado] =
      await database.execute(
        `
          DELETE FROM Aula

          WHERE idAula = ?

            AND idProfessorTurma = ?
        `,
        [
          idAula,
          idProfessorTurma
        ]
      )


    if (
      resultado.affectedRows === 0
    ) {

      return res.status(404).json({
        message:
          'Aula não encontrada.'
      })

    }


    return res.status(200).json({
      message:
        'Aula excluída com sucesso.'
    })


  } catch (error) {

    console.error(
      'Erro ao excluir aula:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível excluir a aula.'
    })

  }

}


// LISTAR FREQUÊNCIAS

export async function listarFrequencias(
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


    const idAula =
      Number(
        req.params.idAula
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


    const aula =
      await buscarAula(
        idAula,
        idProfessorTurma
      )


    if (!aula) {

      return res.status(404).json({
        message:
          'Aula não encontrada.'
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
            a.email,
            a.numeroMatricula,

            f.idFrequencia,
            f.statusFrequencia,
            f.observacao

          FROM Matricula m

          INNER JOIN Aluno a
            ON a.idAluno =
               m.idAluno

          LEFT JOIN Frequencia f
            ON f.idMatricula =
               m.idMatricula

           AND f.idAula = ?

          WHERE m.idTurma = ?

            AND m.codDisciplina = ?

          ORDER BY
            a.nome ASC
        `,
        [
          idAula,
          vinculo.idTurma,
          vinculo.codDisciplina
        ]
      )


    return res.status(200).json({

      professor,

      turma:
        vinculo,

      aula,

      alunos

    })


  } catch (error) {

    console.error(
      'Erro ao listar frequências:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível consultar as frequências.'
    })

  }

}


// REGISTRAR FREQUÊNCIA

export async function registrarFrequencia(
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


    const idAula =
      Number(
        req.params.idAula
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


    const aula =
      await buscarAula(
        idAula,
        idProfessorTurma
      )


    if (!aula) {

      return res.status(404).json({
        message:
          'Aula não encontrada.'
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
          'Aluno não matriculado nesta turma e disciplina.'
      })

    }


    const statusFrequencia =
      req.body
        .statusFrequencia
        ?.trim()
        ?.toUpperCase()


    if (
      !statusValidos.includes(
        statusFrequencia
      )
    ) {

      return res.status(400).json({
        message:
          'Status de frequência inválido.'
      })

    }


    const observacao =
      req.body
        .observacao
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


    await database.execute(
      `
        INSERT INTO Frequencia
        (
          statusFrequencia,
          observacao,
          idAula,
          idMatricula
        )

        VALUES (?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE

          statusFrequencia =
            VALUES(statusFrequencia),

          observacao =
            VALUES(observacao),

          updatedAt =
            CURRENT_TIMESTAMP
      `,
      [
        statusFrequencia,
        observacao,
        idAula,
        idMatricula
      ]
    )


    const [frequencias] =
      await database.execute(
        `
          SELECT
            idFrequencia,
            statusFrequencia,
            observacao,
            idAula,
            idMatricula,
            createdAt,
            updatedAt

          FROM Frequencia

          WHERE idAula = ?

            AND idMatricula = ?

          LIMIT 1
        `,
        [
          idAula,
          idMatricula
        ]
      )


    return res.status(200).json({

      message:
        'Frequência registrada com sucesso.',

      aluno:
        matricula,

      frequencia:
        frequencias[0]

    })


  } catch (error) {

    console.error(
      'Erro ao registrar frequência:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível registrar a frequência.'
    })

  }

}


// REMOVER FREQUÊNCIA

export async function excluirFrequencia(
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


    const idAula =
      Number(
        req.params.idAula
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


    const aula =
      await buscarAula(
        idAula,
        idProfessorTurma
      )


    if (!aula) {

      return res.status(404).json({
        message:
          'Aula não encontrada.'
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
          DELETE FROM Frequencia

          WHERE idAula = ?

            AND idMatricula = ?
        `,
        [
          idAula,
          idMatricula
        ]
      )


    if (
      resultado.affectedRows === 0
    ) {

      return res.status(404).json({
        message:
          'Frequência não encontrada.'
      })

    }


    return res.status(200).json({
      message:
        'Frequência removida com sucesso.'
    })


  } catch (error) {

    console.error(
      'Erro ao excluir frequência:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível remover a frequência.'
    })

  }

}