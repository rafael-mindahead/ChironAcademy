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

export const listarOpcoes = async () => {
    const resposta = await fetch(`${API_URL}/api/vinculos/opcoes`, {
        method: 'GET',
        headers: getHeaders()
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao carregar as opções.')
    }

    return dados
}

export const listarVinculos = async () => {
    const resposta = await fetch(`${API_URL}/api/vinculos`, {
        method: 'GET',
        headers: getHeaders()
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao listar vínculos.')
    }

    return dados
}

export const buscarVinculo = async (idProfessorTurma) => {
    const resposta = await fetch(
        `${API_URL}/api/vinculos/${idProfessorTurma}`,
        {
            method: 'GET',
            headers: getHeaders()
        }
    )

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar vínculo.')
    }

    return dados
}

export const criarVinculo = async (dadosVinculo) => {
    const resposta = await fetch(`${API_URL}/api/vinculos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dadosVinculo)
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao criar vínculo.')
    }

    return dados
}

export const excluirVinculo = async (idProfessorTurma) => {
    const resposta = await fetch(
        `${API_URL}/api/vinculos/${idProfessorTurma}`,
        {
            method: 'DELETE',
            headers: getHeaders()
        }
    )

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao excluir vínculo.')
    }

    return dados
}