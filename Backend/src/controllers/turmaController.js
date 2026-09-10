import database from '../config/database.js'


const turnosValidos = ['MANHA', 'TARDE', 'NOITE']


function validarDados(body) {
  const localTurma = body.localTurma?.trim()
  const turnoTurma = body.turnoTurma?.trim()?.toUpperCase()
  const idCurso = Number(body.idCurso)

  if (!localTurma || !turnoTurma || !idCurso) {
    return { erro: 'Local, turno e curso são obrigatórios.' }
  }

  if (!turnosValidos.includes(turnoTurma)) {
    return { erro: 'Turno da turma inválido.' }
  }

  return { localTurma, turnoTurma, idCurso }
}


function responderErroBanco(error, res) {
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ code: 'CURSO_INVALIDO', message: 'O curso selecionado não existe.' })
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ code: 'VINCULO_EXISTENTE', message: 'Não foi possível excluir a turma porque existem vínculos acadêmicos associados.' })
  }
  console.error('Erro no CRUD de turmas:', error)
  return res.status(500).json({ message: 'Não foi possível realizar a operação.' })
}


async function possuiVinculos(idTurma) {
  for (const tabela of ['ProfessorTurma', 'Matricula', 'Avaliacao']) {
    const [existe] = await database.execute(
      `SELECT COUNT(*) AS quantidade FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`,
      [tabela]
    )
    if (Number(existe[0].quantidade) === 0) continue
    const [vinculo] = await database.execute(`SELECT 1 FROM ${tabela} WHERE idTurma = ? LIMIT 1`, [idTurma])
    if (vinculo.length > 0) return true
  }
  return false
}


export async function listarOpcoes(req, res) {
  try {
    const [cursos] = await database.execute('SELECT idCurso, nomeCurso FROM Curso ORDER BY nomeCurso')
    return res.status(200).json({ cursos })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function listarTurmas(req, res) {
  try {
    const [turmas] = await database.execute(
      `SELECT t.idTurma, t.localTurma, t.turnoTurma, t.idCurso, c.nomeCurso FROM Turma t INNER JOIN Curso c ON c.idCurso = t.idCurso ORDER BY t.idTurma DESC`
    )
    return res.status(200).json({ turmas })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function buscarTurma(req, res) {
  try {
    const [turmas] = await database.execute(
      `SELECT t.idTurma, t.localTurma, t.turnoTurma, t.idCurso, c.nomeCurso FROM Turma t INNER JOIN Curso c ON c.idCurso = t.idCurso WHERE t.idTurma = ?`,
      [req.params.idTurma]
    )
    if (turmas.length === 0) return res.status(404).json({ message: 'Turma não encontrada.' })
    return res.status(200).json({ turma: turmas[0] })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function criarTurma(req, res) {
  const dados = validarDados(req.body)
  if (dados.erro) return res.status(400).json({ message: dados.erro })
  try {
    const [resultado] = await database.execute(
      'INSERT INTO Turma (localTurma, turnoTurma, idCurso) VALUES (?, ?, ?)',
      [dados.localTurma, dados.turnoTurma, dados.idCurso]
    )
    return buscarTurma({ params: { idTurma: resultado.insertId } }, res)
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function atualizarTurma(req, res) {
  const dados = validarDados(req.body)
  if (dados.erro) return res.status(400).json({ message: dados.erro })
  try {
    const [resultado] = await database.execute(
      'UPDATE Turma SET localTurma = ?, turnoTurma = ?, idCurso = ? WHERE idTurma = ?',
      [dados.localTurma, dados.turnoTurma, dados.idCurso, req.params.idTurma]
    )
    if (resultado.affectedRows === 0) {
      const [existente] = await database.execute('SELECT idTurma FROM Turma WHERE idTurma = ?', [req.params.idTurma])
      if (existente.length === 0) return res.status(404).json({ message: 'Turma não encontrada.' })
    }
    return buscarTurma(req, res)
  } catch (error) {
    return responderErroBanco(error, res)
  }
}


export async function excluirTurma(req, res) {
  try {
    if (await possuiVinculos(req.params.idTurma)) {
      return res.status(409).json({ code: 'VINCULO_EXISTENTE', message: 'Não foi possível excluir a turma porque existem vínculos acadêmicos associados.' })
    }
    const [resultado] = await database.execute('DELETE FROM Turma WHERE idTurma = ?', [req.params.idTurma])
    if (resultado.affectedRows === 0) return res.status(404).json({ message: 'Turma não encontrada.' })
    return res.status(200).json({ message: 'Turma excluída com sucesso.' })
  } catch (error) {
    return responderErroBanco(error, res)
  }
}
