import database from '../../config/database.js'


const tiposValidos = ['OBRIGATORIA', 'OPTATIVA']


function validarDados(body) {
  const codDisciplina = body.codDisciplina?.trim()
  const nomeDisciplina = body.nomeDisciplina?.trim()
  const tipoDisciplina = body.tipoDisciplina?.trim()?.toUpperCase()
  const cargaHoraria = Number(body.cargaHoraria)
  const idCurso = Number(body.idCurso)
  const idPeriodo = Number(body.idPeriodo)

  if (!codDisciplina || !nomeDisciplina || !tipoDisciplina || !body.cargaHoraria || !idCurso || !idPeriodo) {
    return { erro: 'Código, nome, tipo, carga horária, curso e período são obrigatórios.' }
  }

  if (!tiposValidos.includes(tipoDisciplina)) {
    return { erro: 'Tipo de disciplina inválido.' }
  }

  if (!Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
    return { erro: 'A carga horária deve ser um número inteiro positivo.' }
  }

  return { codDisciplina, nomeDisciplina, tipoDisciplina, cargaHoraria, idCurso, idPeriodo }
}


function responderErroBanco(error, res) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      code: 'CODIGO_DUPLICADO',
      message: 'Já existe uma disciplina com este código.'
    })
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      code: 'RELACIONAMENTO_INVALIDO',
      message: 'O curso ou período selecionado não existe.'
    })
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      code: 'VINCULO_EXISTENTE',
      message: 'Não foi possível excluir a disciplina porque existem vínculos acadêmicos associados.'
    })
  }

  console.error('Erro no CRUD de disciplinas:', error)
  return res.status(500).json({ message: 'Não foi possível realizar a operação.' })
}


async function registroExiste(tabela, coluna, valor) {
  const [resultado] = await database.execute(
    `SELECT 1 FROM ${tabela} WHERE ${coluna} = ? LIMIT 1`,
    [valor]
  )
  return resultado.length > 0
}


async function possuiVinculos(codDisciplina) {
  const tabelas = ['ProfessorTurma', 'Matricula', 'Avaliacao']

  for (const tabela of tabelas) {
    const [existe] = await database.execute(
      `
        SELECT COUNT(*) AS quantidade
        FROM information_schema.tables
        WHERE table_schema = DATABASE() AND table_name = ?
      `,
      [tabela]
    )

    if (Number(existe[0].quantidade) === 0) continue

    const coluna = tabela === 'ProfessorTurma' || tabela === 'Matricula' || tabela === 'Avaliacao'
      ? 'codDisciplina'
      : 'codDisciplina'

    const [vinculo] = await database.execute(
      `SELECT 1 FROM ${tabela} WHERE ${coluna} = ? LIMIT 1`,
      [codDisciplina]
    )

    if (vinculo.length > 0) return true
  }

  return false
}


export async function listarOpcoes(req, res) {
  try {
    const [cursos] = await database.execute(
      'SELECT idCurso, nomeCurso FROM Curso ORDER BY nomeCurso'
    )
    const [periodos] = await database.execute(
      'SELECT idPeriodo, numeroPeriodo, nomePeriodo, idCurso FROM Periodo ORDER BY numeroPeriodo'
    )
    return res.status(200).json({ cursos, periodos })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function listarDisciplinas(req, res) {
  try {
    const [disciplinas] = await database.execute(
      `
        SELECT d.codDisciplina, d.nomeDisciplina, d.tipoDisciplina,
               d.cargaHoraria, d.idCurso, c.nomeCurso,
               d.idPeriodo, p.nomePeriodo
        FROM Disciplina d
        INNER JOIN Curso c ON c.idCurso = d.idCurso
        INNER JOIN Periodo p ON p.idPeriodo = d.idPeriodo
        ORDER BY d.nomeDisciplina
      `
    )
    return res.status(200).json({ disciplinas })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function buscarDisciplina(req, res) {
  try {
    const [disciplinas] = await database.execute(
      `
        SELECT d.codDisciplina, d.nomeDisciplina, d.tipoDisciplina,
               d.cargaHoraria, d.idCurso, c.nomeCurso,
               d.idPeriodo, p.nomePeriodo
        FROM Disciplina d
        INNER JOIN Curso c ON c.idCurso = d.idCurso
        INNER JOIN Periodo p ON p.idPeriodo = d.idPeriodo
        WHERE d.codDisciplina = ?
      `,
      [req.params.codDisciplina]
    )
    if (disciplinas.length === 0) return res.status(404).json({ message: 'Disciplina não encontrada.' })
    return res.status(200).json({ disciplina: disciplinas[0] })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function criarDisciplina(req, res) {
  const dados = validarDados(req.body)
  if (dados.erro) return res.status(400).json({ message: dados.erro })

  try {
    if (!await registroExiste('Curso', 'idCurso', dados.idCurso) || !await registroExiste('Periodo', 'idPeriodo', dados.idPeriodo)) {
      return res.status(400).json({ code: 'RELACIONAMENTO_INVALIDO', message: 'O curso ou período selecionado não existe.' })
    }

    const [periodos] = await database.execute('SELECT idCurso FROM Periodo WHERE idPeriodo = ?', [dados.idPeriodo])
    if (periodos[0].idCurso !== dados.idCurso) {
      return res.status(400).json({ code: 'PERIODO_CURSO_INVALIDO', message: 'O período selecionado não pertence ao curso escolhido.' })
    }

    await database.execute(
      `INSERT INTO Disciplina (codDisciplina, nomeDisciplina, tipoDisciplina, cargaHoraria, idPeriodo, idCurso) VALUES (?, ?, ?, ?, ?, ?)`,
      [dados.codDisciplina, dados.nomeDisciplina, dados.tipoDisciplina, dados.cargaHoraria, dados.idPeriodo, dados.idCurso]
    )
    const [disciplina] = await database.execute('SELECT * FROM Disciplina WHERE codDisciplina = ?', [dados.codDisciplina])
    return res.status(201).json({ disciplina: disciplina[0] })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function atualizarDisciplina(req, res) {
  const dados = validarDados({ ...req.body, codDisciplina: req.params.codDisciplina })
  if (dados.erro) return res.status(400).json({ message: dados.erro })

  try {
    if (!await registroExiste('Curso', 'idCurso', dados.idCurso) || !await registroExiste('Periodo', 'idPeriodo', dados.idPeriodo)) {
      return res.status(400).json({ code: 'RELACIONAMENTO_INVALIDO', message: 'O curso ou período selecionado não existe.' })
    }

    const [periodos] = await database.execute('SELECT idCurso FROM Periodo WHERE idPeriodo = ?', [dados.idPeriodo])
    if (periodos[0].idCurso !== dados.idCurso) {
      return res.status(400).json({ code: 'PERIODO_CURSO_INVALIDO', message: 'O período selecionado não pertence ao curso escolhido.' })
    }

    const [resultado] = await database.execute(
      `UPDATE Disciplina SET nomeDisciplina = ?, tipoDisciplina = ?, cargaHoraria = ?, idPeriodo = ?, idCurso = ? WHERE codDisciplina = ?`,
      [dados.nomeDisciplina, dados.tipoDisciplina, dados.cargaHoraria, dados.idPeriodo, dados.idCurso, req.params.codDisciplina]
    )
    if (resultado.affectedRows === 0) return res.status(404).json({ message: 'Disciplina não encontrada.' })
    return buscarDisciplina(req, res)
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function excluirDisciplina(req, res) {
  try {
    if (await possuiVinculos(req.params.codDisciplina)) {
      return res.status(409).json({ code: 'VINCULO_EXISTENTE', message: 'Não foi possível excluir a disciplina porque existem vínculos acadêmicos associados.' })
    }
    const [resultado] = await database.execute('DELETE FROM Disciplina WHERE codDisciplina = ?', [req.params.codDisciplina])
    if (resultado.affectedRows === 0) return res.status(404).json({ message: 'Disciplina não encontrada.' })
    return res.status(200).json({ message: 'Disciplina excluída com sucesso.' })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}
