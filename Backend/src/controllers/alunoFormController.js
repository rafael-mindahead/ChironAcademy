import database from '../config/database.js'

// =====================================================
// CADASTRAR ALUNO
// =====================================================

export const cadastrarAluno = async (req, res) => {
    try {
        const {
            nome,
            telefone,
            email,
            numeroMatricula,
            idCurso,
            idPeriodo
        } = req.body

        // Validação dos campos obrigatórios
        if (!nome || !email || !numeroMatricula || !idCurso || !idPeriodo) {
            return res.status(400).json({
                mensagem: 'Nome, e-mail, matrícula, curso e período são obrigatórios.'
            })
        }

        // Validar formato do e-mail
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formatoEmail.test(email)) {
            return res.status(400).json({
                mensagem: 'Informe um e-mail válido.'
            })
        }

        // Verificar se a matrícula já existe
        const [matriculaExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE numeroMatricula = ?',
            [numeroMatricula]
        )

        if (matriculaExistente.length > 0) {
            return res.status(400).json({
                mensagem: 'Já existe um aluno com essa matrícula.'
            })
        }

        // Verificar se o e-mail já existe
        const [emailExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE email = ?',
            [email]
        )

        if (emailExistente.length > 0) {
            return res.status(400).json({
                mensagem: 'Já existe um aluno com esse e-mail.'
            })
        }

        // Verificar se o curso existe
        const [curso] = await database.execute(
            'SELECT idCurso FROM Curso WHERE idCurso = ?',
            [idCurso]
        )

        if (curso.length === 0) {
            return res.status(404).json({
                mensagem: 'Curso não encontrado.'
            })
        }

        // Verificar se o período existe e pertence ao curso
        const [periodo] = await database.execute(
            'SELECT idPeriodo FROM Periodo WHERE idPeriodo = ? AND idCurso = ?',
            [idPeriodo, idCurso]
        )

        if (periodo.length === 0) {
            return res.status(400).json({
                mensagem: 'O período informado não pertence ao curso selecionado.'
            })
        }

        // Inserir aluno
        const [resultado] = await database.execute(
            `INSERT INTO Aluno
            (nome, telefone, email, numeroMatricula, idCurso, idPeriodo)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                nome,
                telefone || null,
                email,
                numeroMatricula,
                idCurso,
                idPeriodo
            ]
        )

        return res.status(201).json({
            mensagem: 'Aluno cadastrado com sucesso.',
            idAluno: resultado.insertId
        })

    } catch (erro) {
        console.error('Erro ao cadastrar aluno:', erro)

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar aluno.'
        })
    }
}


// =====================================================
// LISTAR ALUNOS
// =====================================================

export const listarAlunos = async (req, res) => {
    try {
        const [alunos] = await database.execute(
            `SELECT
                a.idAluno,
                a.nome,
                a.telefone,
                a.email,
                a.numeroMatricula,
                a.idCurso,
                c.nomeCurso,
                a.idPeriodo,
                p.numeroPeriodo,
                p.nomePeriodo
            FROM Aluno a
            INNER JOIN Curso c ON a.idCurso = c.idCurso
            INNER JOIN Periodo p ON a.idPeriodo = p.idPeriodo
            ORDER BY a.nome`
        )

        return res.status(200).json(alunos)

    } catch (erro) {
        console.error('Erro ao listar alunos:', erro)

        return res.status(500).json({
            mensagem: 'Erro ao listar alunos.'
        })
    }
}

// =====================================================
// BUSCAR ALUNO
// =====================================================

export const buscarAluno = async (req, res) => {
    try {
        const { id } = req.params

        // Validar se o ID foi informado
        if (!id) {
            return res.status(400).json({
                mensagem: 'ID do aluno é obrigatório.'
            })
        }

        const [alunos] = await database.execute(
            `SELECT
                a.idAluno,
                a.nome,
                a.telefone,
                a.email,
                a.numeroMatricula,
                a.idCurso,
                c.nomeCurso,
                a.idPeriodo,
                p.numeroPeriodo,
                p.nomePeriodo
            FROM Aluno a
            INNER JOIN Curso c ON a.idCurso = c.idCurso
            INNER JOIN Periodo p ON a.idPeriodo = p.idPeriodo
            WHERE a.idAluno = ?`,
            [id]
        )

        // Verificar se o aluno existe
        if (alunos.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            })
        }

        return res.status(200).json(alunos[0])

    } catch (erro) {
        console.error('Erro ao buscar aluno:', erro)

        return res.status(500).json({
            mensagem: 'Erro ao buscar aluno.'
        })
    }
}

// =====================================================
// ATUALIZAR ALUNO
// =====================================================

export const atualizarAluno = async (req, res) => {
    try {
        const { id } = req.params

        const {
            nome,
            telefone,
            email,
            numeroMatricula,
            idCurso,
            idPeriodo
        } = req.body

        // Verificar se o aluno existe
        const [alunoExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE idAluno = ?',
            [id]
        )

        if (alunoExistente.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            })
        }

        // Validação dos campos obrigatórios
        if (!nome || !email || !numeroMatricula || !idCurso || !idPeriodo) {
            return res.status(400).json({
                mensagem: 'Nome, e-mail, matrícula, curso e período são obrigatórios.'
            })
        }

        // Validar formato do e-mail
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formatoEmail.test(email)) {
            return res.status(400).json({
                mensagem: 'Informe um e-mail válido.'
            })
        }

        // Verificar se a matrícula pertence a outro aluno
        const [matriculaExistente] = await database.execute(
            `SELECT idAluno
             FROM Aluno
             WHERE numeroMatricula = ?
             AND idAluno != ?`,
            [numeroMatricula, id]
        )

        if (matriculaExistente.length > 0) {
            return res.status(400).json({
                mensagem: 'Já existe outro aluno com essa matrícula.'
            })
        }

        // Verificar se o e-mail pertence a outro aluno
        const [emailExistente] = await database.execute(
            `SELECT idAluno
             FROM Aluno
             WHERE email = ?
             AND idAluno != ?`,
            [email, id]
        )

        if (emailExistente.length > 0) {
            return res.status(400).json({
                mensagem: 'Já existe outro aluno com esse e-mail.'
            })
        }

        // Verificar se o curso existe
        const [curso] = await database.execute(
            'SELECT idCurso FROM Curso WHERE idCurso = ?',
            [idCurso]
        )

        if (curso.length === 0) {
            return res.status(404).json({
                mensagem: 'Curso não encontrado.'
            })
        }

        // Verificar se o período existe e pertence ao curso
        const [periodo] = await database.execute(
            `SELECT idPeriodo
             FROM Periodo
             WHERE idPeriodo = ?
             AND idCurso = ?`,
            [idPeriodo, idCurso]
        )

        if (periodo.length === 0) {
            return res.status(400).json({
                mensagem: 'O período informado não pertence ao curso selecionado.'
            })
        }

        // Atualizar aluno
        await database.execute(
            `UPDATE Aluno
             SET nome = ?,
                 telefone = ?,
                 email = ?,
                 numeroMatricula = ?,
                 idCurso = ?,
                 idPeriodo = ?
             WHERE idAluno = ?`,
            [
                nome,
                telefone || null,
                email,
                numeroMatricula,
                idCurso,
                idPeriodo,
                id
            ]
        )

        return res.status(200).json({
            mensagem: 'Aluno atualizado com sucesso.'
        })

    } catch (erro) {
        console.error('Erro ao atualizar aluno:', erro)

        return res.status(500).json({
            mensagem: 'Erro ao atualizar aluno.'
        })
    }
}

// =====================================================
// EXCLUIR ALUNO
// =====================================================

export const excluirAluno = async (req, res) => {
    try {
        const { id } = req.params

        // Verificar se o aluno existe
        const [alunoExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE idAluno = ?',
            [id]
        )

        if (alunoExistente.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            })
        }

        // Excluir aluno
        await database.execute(
            'DELETE FROM Aluno WHERE idAluno = ?',
            [id]
        )

        return res.status(200).json({
            mensagem: 'Aluno excluído com sucesso.'
        })

    } catch (erro) {
        console.error('Erro ao excluir aluno:', erro)

        return res.status(500).json({
            mensagem: 'Erro ao excluir aluno.'
        })
    }
}