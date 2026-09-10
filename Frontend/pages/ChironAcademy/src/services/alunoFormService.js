const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getToken = () => {
    return sessionStorage.getItem('chiron_token')
}

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }
}

// =====================================================
// CADASTRAR ALUNO
// =====================================================

export const cadastrarAluno = async (dadosAluno) => {
    const resposta = await fetch(`${API_URL}/api/alunos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dadosAluno)
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao cadastrar aluno.')
    }

    return dados
}

// =====================================================
// LISTAR ALUNOS
// =====================================================

export const listarAlunos = async () => {
    const resposta = await fetch(`${API_URL}/api/alunos`, {
        method: 'GET',
        headers: getHeaders()
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao listar alunos.')
    }

    return dados
}

// =====================================================
// BUSCAR ALUNO
// =====================================================

export const buscarAluno = async (idAluno) => {
    const resposta = await fetch(`${API_URL}/api/alunos/${idAluno}`, {
        method: 'GET',
        headers: getHeaders()
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao buscar aluno.')
    }

    return dados
}

// =====================================================
// ATUALIZAR ALUNO
// =====================================================

export const atualizarAluno = async (idAluno, dadosAluno) => {
    const resposta = await fetch(`${API_URL}/api/alunos/${idAluno}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dadosAluno)
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao atualizar aluno.')
    }

    return dados
}

// =====================================================
// EXCLUIR ALUNO
// =====================================================

export const excluirAluno = async (idAluno) => {
    const resposta = await fetch(`${API_URL}/api/alunos/${idAluno}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao excluir aluno.')
    }

    return dados
}