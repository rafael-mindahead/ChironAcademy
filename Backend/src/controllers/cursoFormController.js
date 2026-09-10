import database from '../config/database.js'


// ======================================================
// CADASTRAR CURSO
// ======================================================

export async function cadastrarCurso(req, res) {

  try {

    const {
      nomeCurso,
      modalidade,
      duracaoSemestres
    } = req.body


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (!nomeCurso || !nomeCurso.trim()) {

      return res.status(400).json({
        message:
          'O nome do curso é obrigatório.'
      })

    }


    // O nome deve conter pelo menos uma letra.
    // Números e caracteres especiais são permitidos,
    // desde que exista pelo menos uma letra.

    if (!/[A-Za-zÀ-ÿ]/.test(nomeCurso.trim())) {

      return res.status(400).json({
        message:
          'O nome do curso deve conter pelo menos uma letra.'
      })

    }


    const modalidadesValidas = [
      'PRESENCIAL',
      'EAD',
      'HIBRIDO'
    ]


    if (!modalidade) {

      return res.status(400).json({
        message:
          'Selecione a modalidade do curso.'
      })

    }


    if (!modalidadesValidas.includes(modalidade)) {

      return res.status(400).json({
        message:
          'A modalidade selecionada é inválida. Escolha Presencial, EAD ou Híbrido.'
      })

    }


    if (
      duracaoSemestres === '' ||
      duracaoSemestres === null ||
      duracaoSemestres === undefined
    ) {

      return res.status(400).json({
        message:
          'A duração do curso é obrigatória.'
      })

    }


    const duracao = Number(duracaoSemestres)


    if (!Number.isInteger(duracao)) {

      return res.status(400).json({
        message:
          'A duração deve ser informada em números inteiros.'
      })

    }


    if (duracao < 1 || duracao > 20) {

      return res.status(400).json({
        message:
          'A duração deve estar entre 1 e 20 semestres.'
      })

    }


    // ==================================================
    // VERIFICAR CURSO DUPLICADO
    // ==================================================

    const [cursoExistente] = await database.execute(
      `
        SELECT idCurso
        FROM Curso
        WHERE nomeCurso = ?
          AND modalidade = ?
        LIMIT 1
      `,
      [
        nomeCurso.trim(),
        modalidade
      ]
    )


    if (cursoExistente.length > 0) {

      return res.status(400).json({
        message:
          'Já existe um curso com este nome e modalidade.'
      })

    }


    // ==================================================
    // CADASTRAR NO BANCO
    // ==================================================

    const [resultado] = await database.execute(
      `
        INSERT INTO Curso
        (
          nomeCurso,
          modalidade,
          duracaoSemestres
        )
        VALUES (?, ?, ?)
      `,
      [
        nomeCurso.trim(),
        modalidade,
        duracao
      ]
    )


    return res.status(201).json({

      message:
        'Curso cadastrado com sucesso.',

      curso: {

        idCurso:
          resultado.insertId,

        nomeCurso:
          nomeCurso.trim(),

        modalidade,

        duracaoSemestres:
          duracao

      }

    })


  } catch (error) {

    console.error(
      'Erro ao cadastrar curso:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível cadastrar o curso.'
    })

  }

}


// ======================================================
// LISTAR CURSOS
// ======================================================

export async function listarCursos(req, res) {

  try {

    const [cursos] = await database.execute(
      `
        SELECT
          idCurso,
          nomeCurso,
          modalidade,
          duracaoSemestres

        FROM Curso

        ORDER BY nomeCurso ASC
      `
    )


    return res.status(200).json(cursos)


  } catch (error) {

    console.error(
      'Erro ao listar cursos:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível carregar os cursos.'
    })

  }

}


// ======================================================
// BUSCAR CURSO POR ID
// ======================================================

export async function buscarCurso(req, res) {

  try {

    const { id } = req.params


    const [cursos] = await database.execute(
      `
        SELECT
          idCurso,
          nomeCurso,
          modalidade,
          duracaoSemestres

        FROM Curso

        WHERE idCurso = ?

        LIMIT 1
      `,
      [id]
    )


    if (cursos.length === 0) {

      return res.status(404).json({
        message:
          'Curso não encontrado.'
      })

    }


    return res.status(200).json(
      cursos[0]
    )


  } catch (error) {

    console.error(
      'Erro ao buscar curso:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível buscar o curso.'
    })

  }

}


// ======================================================
// ATUALIZAR CURSO
// ======================================================

export async function atualizarCurso(req, res) {

  try {

    const { id } = req.params

    const {
      nomeCurso,
      modalidade,
      duracaoSemestres
    } = req.body


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (!nomeCurso || !nomeCurso.trim()) {

      return res.status(400).json({
        message:
          'O nome do curso é obrigatório.'
      })

    }


    // O nome deve conter pelo menos uma letra.
    // Números e caracteres especiais são permitidos,
    // desde que exista pelo menos uma letra.

    if (!/[A-Za-zÀ-ÿ]/.test(nomeCurso.trim())) {

      return res.status(400).json({
        message:
          'O nome do curso deve conter pelo menos uma letra.'
      })

    }


    const modalidadesValidas = [
      'PRESENCIAL',
      'EAD',
      'HIBRIDO'
    ]


    if (!modalidade) {

      return res.status(400).json({
        message:
          'Selecione a modalidade do curso.'
      })

    }


    if (!modalidadesValidas.includes(modalidade)) {

      return res.status(400).json({
        message:
          'A modalidade selecionada é inválida. Escolha Presencial, EAD ou Híbrido.'
      })

    }


    if (
      duracaoSemestres === '' ||
      duracaoSemestres === null ||
      duracaoSemestres === undefined
    ) {

      return res.status(400).json({
        message:
          'A duração do curso é obrigatória.'
      })

    }


    const duracao = Number(duracaoSemestres)


    if (!Number.isInteger(duracao)) {

      return res.status(400).json({
        message:
          'A duração deve ser informada em números inteiros.'
      })

    }


    if (duracao < 1 || duracao > 20) {

      return res.status(400).json({
        message:
          'A duração deve estar entre 1 e 20 semestres.'
      })

    }


    // ==================================================
    // VERIFICAR CURSO DUPLICADO
    // ==================================================

    const [cursoExistente] = await database.execute(
      `
        SELECT idCurso
        FROM Curso
        WHERE nomeCurso = ?
          AND modalidade = ?
          AND idCurso <> ?
        LIMIT 1
      `,
      [
        nomeCurso.trim(),
        modalidade,
        id
      ]
    )


    if (cursoExistente.length > 0) {

      return res.status(400).json({
        message:
          'Já existe outro curso com este nome e modalidade.'
      })

    }


    // ==================================================
    // VERIFICAR SE O CURSO EXISTE
    // ==================================================

    const [cursosExistentes] = await database.execute(
      `
        SELECT idCurso
        FROM Curso
        WHERE idCurso = ?
        LIMIT 1
      `,
      [id]
    )


    if (cursosExistentes.length === 0) {

      return res.status(404).json({
        message:
          'Curso não encontrado.'
      })

    }


    // ==================================================
    // ATUALIZAR CURSO
    // ==================================================

    await database.execute(
      `
        UPDATE Curso

        SET
          nomeCurso = ?,
          modalidade = ?,
          duracaoSemestres = ?

        WHERE idCurso = ?
      `,
      [
        nomeCurso.trim(),
        modalidade,
        duracao,
        id
      ]
    )


    return res.status(200).json({

      message:
        'Curso atualizado com sucesso.',

      curso: {

        idCurso:
          Number(id),

        nomeCurso:
          nomeCurso.trim(),

        modalidade,

        duracaoSemestres:
          duracao

      }

    })


  } catch (error) {

    console.error(
      'Erro ao atualizar curso:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível atualizar o curso.'
    })

  }

}


// ======================================================
// EXCLUIR CURSO
// ======================================================

export async function excluirCurso(req, res) {

  try {

    const { id } = req.params


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
      [id]
    )


    if (cursos.length === 0) {

      return res.status(404).json({
        message:
          'Curso não encontrado.'
      })

    }


    // ==================================================
    // VERIFICAR PERÍODOS VINCULADOS
    // ==================================================

    const [periodos] = await database.execute(
      `
        SELECT idPeriodo
        FROM Periodo
        WHERE idCurso = ?
        LIMIT 1
      `,
      [id]
    )


    if (periodos.length > 0) {

      return res.status(400).json({
        message:
          'Não é possível excluir o curso porque existem períodos vinculados a ele.'
      })

    }


    // ==================================================
    // EXCLUIR CURSO
    // ==================================================

    await database.execute(
      `
        DELETE FROM Curso
        WHERE idCurso = ?
      `,
      [id]
    )


    return res.status(200).json({
      message:
        'Curso excluído com sucesso.'
    })


  } catch (error) {

    console.error(
      'Erro ao excluir curso:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível excluir o curso.'
    })

  }

}