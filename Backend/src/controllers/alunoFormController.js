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

        if (!nome || !email || !numeroMatricula || !idCurso || !idPeriodo) {
            return res.status(400).json({
                mensagem: 'Nome, e-mail, matrícula, curso e período são obrigatórios.'
            })
        }

        // Validação do nome
        const nomeValido = /[A-Za-zÀ-ÿ]/.test(nome)

        if (!nomeValido) {
            return res.status(400).json({
                mensagem: 'O nome deve conter pelo menos uma letra.'
            })
        }

        // Validação do e-mail
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formatoEmail.test(email)) {
            return res.status(400).json({
                mensagem: 'Informe um e-mail válido.'
            })
        }

        // Verifica matrícula duplicada
        const [matriculaExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE numeroMatricula = ?',
            [numeroMatricula]
        )

        if (matriculaExistente.length > 0) {
            return res.status(400).json({
                mensagem: 'Já existe um aluno com essa matrícula.'
            })
        }

        // Verifica e-mail duplicado
        const [emailExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE email = ?',
            [email]
        )

        if (emailExistente.length > 0) {
            return res.status(400).json({
                mensagem: 'Já existe um aluno com esse e-mail.'
            })
        }

        // Verifica telefone duplicado
        if (telefone) {
            const [telefoneExistente] = await database.execute(
                'SELECT idAluno FROM Aluno WHERE telefone = ?',
                [telefone]
            )

            if (telefoneExistente.length > 0) {
                return res.status(400).json({
                    mensagem: 'Já existe um aluno com esse telefone.'
                })
            }
        }

        // Verifica se o curso existe
        const [curso] = await database.execute(
            'SELECT idCurso FROM Curso WHERE idCurso = ?',
            [idCurso]
        )

        if (curso.length === 0) {
            return res.status(404).json({
                mensagem: 'Curso não encontrado.'
            })
        }

        // Verifica se o período pertence ao curso
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

        // Cadastra o aluno
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

        // Verifica se o aluno existe
        const [alunoExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE idAluno = ?',
            [id]
        )

        if (alunoExistente.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            })
        }

        // Verifica campos obrigatórios
        if (!nome || !email || !numeroMatricula || !idCurso || !idPeriodo) {
            return res.status(400).json({
                mensagem: 'Nome, e-mail, matrícula, curso e período são obrigatórios.'
            })
        }

        // Validação do nome
        const nomeValido = /[A-Za-zÀ-ÿ]/.test(nome)

        if (!nomeValido) {
            return res.status(400).json({
                mensagem: 'O nome deve conter pelo menos uma letra.'
            })
        }

        // Validação do e-mail
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formatoEmail.test(email)) {
            return res.status(400).json({
                mensagem: 'Informe um e-mail válido.'
            })
        }

        // Verifica matrícula duplicada
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

        // Verifica e-mail duplicado
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

        // Verifica telefone duplicado
        if (telefone) {
            const [telefoneExistente] = await database.execute(
                `SELECT idAluno
                 FROM Aluno
                 WHERE telefone = ?
                 AND idAluno != ?`,
                [telefone, id]
            )

            if (telefoneExistente.length > 0) {
                return res.status(400).json({
                    mensagem: 'Já existe outro aluno com esse telefone.'
                })
            }
        }

        // Verifica se o curso existe
        const [curso] = await database.execute(
            'SELECT idCurso FROM Curso WHERE idCurso = ?',
            [idCurso]
        )

        if (curso.length === 0) {
            return res.status(404).json({
                mensagem: 'Curso não encontrado.'
            })
        }

        // Verifica se o período pertence ao curso
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

        // Atualiza o aluno
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

        const [alunoExistente] = await database.execute(
            'SELECT idAluno FROM Aluno WHERE idAluno = ?',
            [id]
        )

        if (alunoExistente.length === 0) {
            return res.status(404).json({
                mensagem: 'Aluno não encontrado.'
            })
        }

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