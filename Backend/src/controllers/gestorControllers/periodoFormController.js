import database from '../../config/database.js'


// ======================================================
// CADASTRAR PERÍODO
// ======================================================

export async function cadastrarPeriodo(req, res) {

  try {

    const {
      numeroPeriodo,
      nomePeriodo,
      idCurso
    } = req.body


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (
      numeroPeriodo === '' ||
      numeroPeriodo === null ||
      numeroPeriodo === undefined
    ) {

      return res.status(400).json({
        message:
          'O número do período é obrigatório.'
      })

    }


    const numero = Number(numeroPeriodo)


    if (!Number.isInteger(numero)) {

      return res.status(400).json({
        message:
          'O número do período deve ser um número inteiro.'
      })

    }


    if (numero < 1) {

      return res.status(400).json({
        message:
          'O número do período deve ser maior que zero.'
      })

    }


    if (!nomePeriodo || !nomePeriodo.trim()) {

      return res.status(400).json({
        message:
          'O nome do período é obrigatório.'
      })

    }


    if (!idCurso) {

      return res.status(400).json({
        message:
          'Selecione um curso.'
      })

    }


    // ==================================================
    // VERIFICAR SE O CURSO EXISTE
    // ==================================================

    const [cursos] = await database.execute(
      `
        SELECT idCurso
        FROM Curso
        WHERE idCurso = ?
        LIMIT 1
      `,
      [idCurso]
    )


    if (cursos.length === 0) {

      return res.status(400).json({
        message:
          'O curso selecionado não existe.'
      })

    }


    // ==================================================
    // VERIFICAR PERÍODO DUPLICADO NO CURSO
    // ==================================================

    const [periodoExistente] = await database.execute(
      `
        SELECT idPeriodo
        FROM Periodo
        WHERE numeroPeriodo = ?
          AND idCurso = ?
        LIMIT 1
      `,
      [
        numero,
        idCurso
      ]
    )


    if (periodoExistente.length > 0) {

      return res.status(400).json({
        message:
          'Já existe este número de período para o curso selecionado.'
      })

    }


    // ==================================================
    // CADASTRAR NO BANCO
    // ==================================================

    const [resultado] = await database.execute(
      `
        INSERT INTO Periodo
        (
          numeroPeriodo,
          nomePeriodo,
          idCurso
        )
        VALUES (?, ?, ?)
      `,
      [
        numero,
        nomePeriodo.trim(),
        idCurso
      ]
    )


    return res.status(201).json({

      message:
        'Período cadastrado com sucesso.',

      periodo: {

        idPeriodo:
          resultado.insertId,

        numeroPeriodo:
          numero,

        nomePeriodo:
          nomePeriodo.trim(),

        idCurso:
          Number(idCurso)

      }

    })


  } catch (error) {

    console.error(
      'Erro ao cadastrar período:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível cadastrar o período.'
    })

  }

}


// ======================================================
// LISTAR PERÍODOS
// ======================================================

export async function listarPeriodos(req, res) {

  try {

    const { curso } = req.query

    let query = `
      SELECT
        p.idPeriodo,
        p.numeroPeriodo,
        p.nomePeriodo,
        p.idCurso,
        c.nomeCurso

      FROM Periodo p

      INNER JOIN Curso c
        ON p.idCurso = c.idCurso
    `

    const parametros = []

    // Filtrar por curso quando informado
    if (curso) {
      query += `
        WHERE p.idCurso = ?
      `

      parametros.push(curso)
    }

    query += `
      ORDER BY
        p.numeroPeriodo ASC
    `

    const [periodos] = await database.execute(
      query,
      parametros
    )

    return res.status(200).json(periodos)

  } catch (error) {

    console.error(
      'Erro ao listar períodos:',
      error
    )

    return res.status(500).json({
      message:
        'Não foi possível carregar os períodos.'
    })

  }

}


// ======================================================
// BUSCAR PERÍODO POR ID
// ======================================================

export async function buscarPeriodo(req, res) {

  try {

    const { id } = req.params


    const [periodos] = await database.execute(
      `
        SELECT
          p.idPeriodo,
          p.numeroPeriodo,
          p.nomePeriodo,
          p.idCurso,
          c.nomeCurso

        FROM Periodo p

        INNER JOIN Curso c
          ON p.idCurso = c.idCurso

        WHERE p.idPeriodo = ?

        LIMIT 1
      `,
      [id]
    )


    if (periodos.length === 0) {

      return res.status(404).json({
        message:
          'Período não encontrado.'
      })

    }


    return res.status(200).json(
      periodos[0]
    )


  } catch (error) {

    console.error(
      'Erro ao buscar período:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível buscar o período.'
    })

  }

}


// ======================================================
// ATUALIZAR PERÍODO
// ======================================================

export async function atualizarPeriodo(req, res) {

  try {

    const { id } = req.params

    const {
      numeroPeriodo,
      nomePeriodo,
      idCurso
    } = req.body


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (
      numeroPeriodo === '' ||
      numeroPeriodo === null ||
      numeroPeriodo === undefined
    ) {

      return res.status(400).json({
        message:
          'O número do período é obrigatório.'
      })

    }


    const numero = Number(numeroPeriodo)


    if (!Number.isInteger(numero)) {

      return res.status(400).json({
        message:
          'O número do período deve ser um número inteiro.'
      })

    }


    if (numero < 1) {

      return res.status(400).json({
        message:
          'O número do período deve ser maior que zero.'
      })

    }


    if (!nomePeriodo || !nomePeriodo.trim()) {

      return res.status(400).json({
        message:
          'O nome do período é obrigatório.'
      })

    }


    if (!idCurso) {

      return res.status(400).json({
        message:
          'Selecione um curso.'
      })

    }


    // ==================================================
    // VERIFICAR SE O PERÍODO EXISTE
    // ==================================================

    const [periodosExistentes] = await database.execute(
      `
        SELECT idPeriodo
        FROM Periodo
        WHERE idPeriodo = ?
        LIMIT 1
      `,
      [id]
    )


    if (periodosExistentes.length === 0) {

      return res.status(404).json({
        message:
          'Período não encontrado.'
      })

    }


    // ==================================================
    // VERIFICAR SE O CURSO EXISTE
    // ==================================================

    const [cursos] = await database.execute(
      `
        SELECT idCurso
        FROM Curso
        WHERE idCurso = ?
        LIMIT 1
      `,
      [idCurso]
    )


    if (cursos.length === 0) {

      return res.status(400).json({
        message:
          'O curso selecionado não existe.'
      })

    }


    // ==================================================
    // VERIFICAR PERÍODO DUPLICADO
    // ==================================================

    const [periodoExistente] = await database.execute(
      `
        SELECT idPeriodo
        FROM Periodo
        WHERE numeroPeriodo = ?
          AND idCurso = ?
          AND idPeriodo <> ?
        LIMIT 1
      `,
      [
        numero,
        idCurso,
        id
      ]
    )


    if (periodoExistente.length > 0) {

      return res.status(400).json({
        message:
          'Já existe este número de período para o curso selecionado.'
      })

    }


    // ==================================================
    // ATUALIZAR PERÍODO
    // ==================================================

    await database.execute(
      `
        UPDATE Periodo

        SET
          numeroPeriodo = ?,
          nomePeriodo = ?,
          idCurso = ?

        WHERE idPeriodo = ?
      `,
      [
        numero,
        nomePeriodo.trim(),
        idCurso,
        id
      ]
    )


    return res.status(200).json({

      message:
        'Período atualizado com sucesso.',

      periodo: {

        idPeriodo:
          Number(id),

        numeroPeriodo:
          numero,

        nomePeriodo:
          nomePeriodo.trim(),

        idCurso:
          Number(idCurso)

      }

    })


  } catch (error) {

    console.error(
      'Erro ao atualizar período:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível atualizar o período.'
    })

  }

}


// ======================================================
// EXCLUIR PERÍODO
// ======================================================

export async function excluirPeriodo(req, res) {

  try {

    const { id } = req.params


    // ==================================================
    // VERIFICAR SE O PERÍODO EXISTE
    // ==================================================

    const [periodos] = await database.execute(
      `
        SELECT idPeriodo
        FROM Periodo
        WHERE idPeriodo = ?
        LIMIT 1
      `,
      [id]
    )


    if (periodos.length === 0) {

      return res.status(404).json({
        message:
          'Período não encontrado.'
      })

    }


    // ==================================================
    // VERIFICAR ALUNOS VINCULADOS
    // ==================================================

    const [alunos] = await database.execute(
      `
        SELECT idAluno
        FROM Aluno
        WHERE idPeriodo = ?
        LIMIT 1
      `,
      [id]
    )


    if (alunos.length > 0) {

      return res.status(400).json({
        message:
          'Não é possível excluir o período porque existem alunos vinculados a ele.'
      })

    }


    // ==================================================
    // EXCLUIR PERÍODO
    // ==================================================

    await database.execute(
      `
        DELETE FROM Periodo
        WHERE idPeriodo = ?
      `,
      [id]
    )


    return res.status(200).json({
      message:
        'Período excluído com sucesso.'
    })


  } catch (error) {

    console.error(
      'Erro ao excluir período:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível excluir o período.'
    })

  }

}