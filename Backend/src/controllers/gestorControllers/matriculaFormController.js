import database from '../../config/database.js'

// PBI 08 | Aceite: matricular aluno em turma/disciplina compatíveis, bloquear duplicidade e permitir atualizar o status.


const statusValidos = [
  'CURSANDO',
  'APROVADO',
  'REPROVADO',
  'TRANCADO',
  'JUSTIFICADO'
]


// TRATAMENTO DE ERROS DO BANCO

function responderErroBanco(error, res) {

  if (error.code === 'ER_DUP_ENTRY') {

    return res.status(409).json({
      code: 'MATRICULA_DUPLICADA',
      message:
        'Este aluno já está matriculado nesta turma e disciplina.'
    })

  }


  if (error.code === 'ER_NO_REFERENCED_ROW_2') {

    return res.status(400).json({
      code: 'RELACIONAMENTO_INVALIDO',
      message:
        'Aluno, turma ou disciplina informados não existem.'
    })

  }


  if (error.code === 'ER_ROW_IS_REFERENCED_2') {

    return res.status(409).json({
      code: 'MATRICULA_VINCULADA',
      message:
        'Não foi possível excluir a matrícula porque existem registros acadêmicos vinculados.'
    })

  }


  console.error(
    'Erro no CRUD de matrículas:',
    error
  )


  return res.status(500).json({
    message:
      'Não foi possível realizar a operação.'
  })

}


// VALIDAR DADOS

function validarDados(body) {

  const idAluno =
    Number(body.idAluno)

  const idTurma =
    Number(body.idTurma)

  const codDisciplina =
    body.codDisciplina
      ?.trim()

  const statusMatricula =
    (
      body.statusMatricula ||
      'CURSANDO'
    )
      .trim()
      .toUpperCase()


  if (
    !Number.isInteger(idAluno) ||
    idAluno <= 0
  ) {

    return {
      erro:
        'Selecione um aluno válido.'
    }

  }


  if (
    !Number.isInteger(idTurma) ||
    idTurma <= 0
  ) {

    return {
      erro:
        'Selecione uma turma válida.'
    }

  }


  if (!codDisciplina) {

    return {
      erro:
        'Selecione uma disciplina.'
    }

  }


  if (
    !statusValidos.includes(
      statusMatricula
    )
  ) {

    return {
      erro:
        'Status de matrícula inválido.'
    }

  }


  return {
    idAluno,
    idTurma,
    codDisciplina,
    statusMatricula
  }

}


// VALIDAR RELACIONAMENTOS ACADÊMICOS

async function validarRelacionamentos(
  {
    idAluno,
    idTurma,
    codDisciplina
  }
) {

  const [alunos] =
    await database.execute(
      `
        SELECT
          idAluno,
          idCurso

        FROM Aluno

        WHERE idAluno = ?

        LIMIT 1
      `,
      [idAluno]
    )


  if (alunos.length === 0) {

    return {
      erro:
        'Aluno não encontrado.'
    }

  }


  const [turmas] =
    await database.execute(
      `
        SELECT
          idTurma,
          idCurso

        FROM Turma

        WHERE idTurma = ?

        LIMIT 1
      `,
      [idTurma]
    )


  if (turmas.length === 0) {

    return {
      erro:
        'Turma não encontrada.'
    }

  }


  const [disciplinas] =
    await database.execute(
      `
        SELECT
          codDisciplina,
          idCurso,
          idPeriodo

        FROM Disciplina

        WHERE codDisciplina = ?

        LIMIT 1
      `,
      [codDisciplina]
    )


  if (
    disciplinas.length === 0
  ) {

    return {
      erro:
        'Disciplina não encontrada.'
    }

  }


  const aluno =
    alunos[0]

  const turma =
    turmas[0]

  const disciplina =
    disciplinas[0]


  if (
    Number(aluno.idCurso) !==
    Number(turma.idCurso)
  ) {

    return {
      erro:
        'A turma selecionada não pertence ao curso do aluno.'
    }

  }


  if (
    Number(aluno.idCurso) !==
    Number(disciplina.idCurso)
  ) {

    return {
      erro:
        'A disciplina selecionada não pertence ao curso do aluno.'
    }

  }


  if (
    Number(turma.idCurso) !==
    Number(disciplina.idCurso)
  ) {

    return {
      erro:
        'A turma e a disciplina selecionadas pertencem a cursos diferentes.'
    }

  }


  return {
    aluno,
    turma,
    disciplina
  }

}


// OPÇÕES PARA OS SELECTS

export async function listarOpcoes(
  req,
  res
) {

  try {

    const [alunos] =
      await database.execute(
        `
          SELECT
            a.idAluno,
            a.nome,
            a.numeroMatricula,
            a.idCurso,
            c.nomeCurso,
            a.idPeriodo,
            p.nomePeriodo

          FROM Aluno a

          INNER JOIN Curso c
            ON c.idCurso = a.idCurso

          INNER JOIN Periodo p
            ON p.idPeriodo = a.idPeriodo

          ORDER BY a.nome ASC
        `
      )


    const [turmas] =
      await database.execute(
        `
          SELECT
            t.idTurma,
            t.localTurma,
            t.turnoTurma,
            t.idCurso,
            c.nomeCurso

          FROM Turma t

          INNER JOIN Curso c
            ON c.idCurso = t.idCurso

          ORDER BY
            c.nomeCurso ASC,
            t.idTurma ASC
        `
      )


    const [disciplinas] =
      await database.execute(
        `
          SELECT
            d.codDisciplina,
            d.nomeDisciplina,
            d.tipoDisciplina,
            d.idCurso,
            c.nomeCurso,
            d.idPeriodo,
            p.nomePeriodo

          FROM Disciplina d

          INNER JOIN Curso c
            ON c.idCurso = d.idCurso

          INNER JOIN Periodo p
            ON p.idPeriodo = d.idPeriodo

          ORDER BY
            c.nomeCurso ASC,
            d.nomeDisciplina ASC
        `
      )


    return res.status(200).json({

      alunos,

      turmas,

      disciplinas,

      status: statusValidos

    })


  } catch (error) {

    return responderErroBanco(
      error,
      res
    )

  }

}


// LISTAR MATRÍCULAS

export async function listarMatriculas(
  req,
  res
) {

  try {

    const [matriculas] =
      await database.execute(
        `
          SELECT
            m.idMatricula,
            m.dataMatricula,
            m.statusMatricula,

            m.idAluno,
            a.nome AS nomeAluno,
            a.numeroMatricula,

            m.codDisciplina,
            d.nomeDisciplina,

            m.idTurma,
            t.localTurma,
            t.turnoTurma,

            c.idCurso,
            c.nomeCurso

          FROM Matricula m

          INNER JOIN Aluno a
            ON a.idAluno = m.idAluno

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               m.codDisciplina

          INNER JOIN Turma t
            ON t.idTurma = m.idTurma

          INNER JOIN Curso c
            ON c.idCurso = a.idCurso

          ORDER BY
            a.nome ASC,
            d.nomeDisciplina ASC
        `
      )


    return res.status(200).json({
      matriculas
    })


  } catch (error) {

    return responderErroBanco(
      error,
      res
    )

  }

}


// BUSCAR MATRÍCULA POR ID

export async function buscarMatricula(
  req,
  res
) {

  try {

    const {
      idMatricula
    } =
      req.params


    const [matriculas] =
      await database.execute(
        `
          SELECT
            m.idMatricula,
            m.dataMatricula,
            m.statusMatricula,

            m.idAluno,
            a.nome AS nomeAluno,
            a.numeroMatricula,

            m.codDisciplina,
            d.nomeDisciplina,

            m.idTurma,
            t.localTurma,
            t.turnoTurma,

            c.idCurso,
            c.nomeCurso

          FROM Matricula m

          INNER JOIN Aluno a
            ON a.idAluno = m.idAluno

          INNER JOIN Disciplina d
            ON d.codDisciplina =
               m.codDisciplina

          INNER JOIN Turma t
            ON t.idTurma = m.idTurma

          INNER JOIN Curso c
            ON c.idCurso = a.idCurso

          WHERE m.idMatricula = ?

          LIMIT 1
        `,
        [idMatricula]
      )


    if (
      matriculas.length === 0
    ) {

      return res.status(404).json({
        message:
          'Matrícula não encontrada.'
      })

    }


    return res.status(200).json({
      matricula:
        matriculas[0]
    })


  } catch (error) {

    return responderErroBanco(
      error,
      res
    )

  }

}


// CRIAR MATRÍCULA

export async function criarMatricula(
  req,
  res
) {

  const dados =
    validarDados(
      req.body
    )


  if (dados.erro) {

    return res.status(400).json({
      message:
        dados.erro
    })

  }


  try {

    const relacionamentos =
      await validarRelacionamentos(
        dados
      )


    if (
      relacionamentos.erro
    ) {

      return res.status(400).json({
        message:
          relacionamentos.erro
      })

    }


    // VERIFICAR MATRÍCULA DUPLICADA

    const [existentes] =
      await database.execute(
        `
          SELECT idMatricula

          FROM Matricula

          WHERE idAluno = ?
            AND codDisciplina = ?
            AND idTurma = ?

          LIMIT 1
        `,
        [
          dados.idAluno,
          dados.codDisciplina,
          dados.idTurma
        ]
      )


    if (
      existentes.length > 0
    ) {

      return res.status(409).json({
        code:
          'MATRICULA_DUPLICADA',

        message:
          'Este aluno já está matriculado nesta turma e disciplina.'
      })

    }


    // CADASTRAR

    const [resultado] =
      await database.execute(
        `
          INSERT INTO Matricula
          (
            statusMatricula,
            idAluno,
            codDisciplina,
            idTurma
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          dados.statusMatricula,
          dados.idAluno,
          dados.codDisciplina,
          dados.idTurma
        ]
      )


    const [matriculas] =
      await database.execute(
        `
          SELECT
            idMatricula,
            dataMatricula,
            statusMatricula,
            idAluno,
            codDisciplina,
            idTurma

          FROM Matricula

          WHERE idMatricula = ?
        `,
        [
          resultado.insertId
        ]
      )


    return res.status(201).json({

      message:
        'Aluno matriculado com sucesso.',

      matricula:
        matriculas[0]

    })


  } catch (error) {

    return responderErroBanco(
      error,
      res
    )

  }

}


// ATUALIZAR MATRÍCULA

export async function atualizarMatricula(
  req,
  res
) {

  const {
    idMatricula
  } =
    req.params


  const dados =
    validarDados(
      req.body
    )


  if (dados.erro) {

    return res.status(400).json({
      message:
        dados.erro
    })

  }


  try {

    // VERIFICAR EXISTÊNCIA

    const [matriculasExistentes] =
      await database.execute(
        `
          SELECT idMatricula

          FROM Matricula

          WHERE idMatricula = ?

          LIMIT 1
        `,
        [
          idMatricula
        ]
      )


    if (
      matriculasExistentes.length ===
      0
    ) {

      return res.status(404).json({
        message:
          'Matrícula não encontrada.'
      })

    }


    const relacionamentos =
      await validarRelacionamentos(
        dados
      )


    if (
      relacionamentos.erro
    ) {

      return res.status(400).json({
        message:
          relacionamentos.erro
      })

    }


    // VERIFICAR DUPLICIDADE

    const [duplicadas] =
      await database.execute(
        `
          SELECT idMatricula

          FROM Matricula

          WHERE idAluno = ?
            AND codDisciplina = ?
            AND idTurma = ?
            AND idMatricula <> ?

          LIMIT 1
        `,
        [
          dados.idAluno,
          dados.codDisciplina,
          dados.idTurma,
          idMatricula
        ]
      )


    if (
      duplicadas.length > 0
    ) {

      return res.status(409).json({
        code:
          'MATRICULA_DUPLICADA',

        message:
          'Já existe outra matrícula com este aluno, turma e disciplina.'
      })

    }


    // ATUALIZAR

    await database.execute(
      `
        UPDATE Matricula

        SET
          statusMatricula = ?,
          idAluno = ?,
          codDisciplina = ?,
          idTurma = ?

        WHERE idMatricula = ?
      `,
      [
        dados.statusMatricula,
        dados.idAluno,
        dados.codDisciplina,
        dados.idTurma,
        idMatricula
      ]
    )


    return res.status(200).json({

      message:
        'Matrícula atualizada com sucesso.',

      matricula: {

        idMatricula:
          Number(
            idMatricula
          ),

        statusMatricula:
          dados.statusMatricula,

        idAluno:
          dados.idAluno,

        codDisciplina:
          dados.codDisciplina,

        idTurma:
          dados.idTurma

      }

    })


  } catch (error) {

    return responderErroBanco(
      error,
      res
    )

  }

}


// EXCLUIR MATRÍCULA

export async function excluirMatricula(
  req,
  res
) {

  try {

    const {
      idMatricula
    } =
      req.params


    const [resultado] =
      await database.execute(
        `
          DELETE FROM Matricula

          WHERE idMatricula = ?
        `,
        [
          idMatricula
        ]
      )


    if (
      resultado.affectedRows ===
      0
    ) {

      return res.status(404).json({
        message:
          'Matrícula não encontrada.'
      })

    }


    return res.status(200).json({
      message:
        'Matrícula excluída com sucesso.'
    })


  } catch (error) {

    return responderErroBanco(
      error,
      res
    )

  }

}