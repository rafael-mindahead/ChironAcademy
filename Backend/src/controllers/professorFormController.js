import database from '../config/database.js'


const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


function validarDados(body) {
  const nome = body.nome?.trim()
  const telefone = body.telefone?.trim() || null
  const email = body.email?.trim().toLowerCase()

  if (!nome || !email) {
    return { erro: 'Nome e e-mail são obrigatórios.' }
  }

  if (!emailValido.test(email)) {
    return { erro: 'Informe um e-mail válido.' }
  }

  if (nome.length > 150 || telefone?.length > 20 || email.length > 255) {
    return { erro: 'Um ou mais campos ultrapassam o tamanho permitido.' }
  }

  return { nome, telefone, email }
}


function responderErroBanco(error, res) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      code: 'EMAIL_DUPLICADO',
      message: 'Já existe um professor cadastrado com este e-mail.'
    })
  }

  console.error('Erro no CRUD de professores:', error)
  return res.status(500).json({
    message: 'Não foi possível realizar a operação.'
  })
}


async function possuiVinculos(idProfessor) {
  const [tabelas] = await database.execute(
    `
      SELECT COUNT(*) AS quantidade
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = 'ProfessorTurma'
    `
  )

  if (Number(tabelas[0].quantidade) === 0) {
    return false
  }

  const [vinculos] = await database.execute(
    `
      SELECT 1
      FROM ProfessorTurma
      WHERE idProfessor = ?
      LIMIT 1
    `,
    [idProfessor]
  )

  return vinculos.length > 0
}


export async function listarProfessores(req, res) {
  try {
    const [professores] = await database.execute(
      `
        SELECT idProfessor, nome, telefone, email
        FROM Professor
        ORDER BY nome ASC
      `
    )

    return res.status(200).json({ professores })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function buscarProfessor(req, res) {
  try {
    const [professores] = await database.execute(
      `
        SELECT idProfessor, nome, telefone, email
        FROM Professor
        WHERE idProfessor = ?
        LIMIT 1
      `,
      [req.params.idProfessor]
    )

    if (professores.length === 0) {
      return res.status(404).json({ message: 'Professor não encontrado.' })
    }

    return res.status(200).json({ professor: professores[0] })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function criarProfessor(req, res) {
  const dados = validarDados(req.body)

  if (dados.erro) {
    return res.status(400).json({ message: dados.erro })
  }

  try {
    const [resultado] = await database.execute(
      `
        INSERT INTO Professor (nome, telefone, email)
        VALUES (?, ?, ?)
      `,
      [dados.nome, dados.telefone, dados.email]
    )

    const [professores] = await database.execute(
      `
        SELECT idProfessor, nome, telefone, email
        FROM Professor
        WHERE idProfessor = ?
      `,
      [resultado.insertId]
    )

    return res.status(201).json({ professor: professores[0] })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function atualizarProfessor(req, res) {
  const dados = validarDados(req.body)

  if (dados.erro) {
    return res.status(400).json({ message: dados.erro })
  }

  try {
    const [resultado] = await database.execute(
      `
        UPDATE Professor
        SET nome = ?, telefone = ?, email = ?
        WHERE idProfessor = ?
      `,
      [dados.nome, dados.telefone, dados.email, req.params.idProfessor]
    )

    if (resultado.affectedRows === 0) {
      const [existente] = await database.execute(
        'SELECT idProfessor FROM Professor WHERE idProfessor = ?',
        [req.params.idProfessor]
      )

      if (existente.length === 0) {
        return res.status(404).json({ message: 'Professor não encontrado.' })
      }
    }

    const [professores] = await database.execute(
      `
        SELECT idProfessor, nome, telefone, email
        FROM Professor
        WHERE idProfessor = ?
      `,
      [req.params.idProfessor]
    )

    return res.status(200).json({ professor: professores[0] })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function excluirProfessor(req, res) {
  try {
    if (await possuiVinculos(req.params.idProfessor)) {
      return res.status(409).json({
        code: 'VINCULO_EXISTENTE',
        message: 'Não foi possível excluir o professor porque existem vínculos com turmas ou disciplinas.'
      })
    }

    const [resultado] = await database.execute(
      'DELETE FROM Professor WHERE idProfessor = ?',
      [req.params.idProfessor]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Professor não encontrado.' })
    }

    return res.status(200).json({ message: 'Professor excluído com sucesso.' })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}
