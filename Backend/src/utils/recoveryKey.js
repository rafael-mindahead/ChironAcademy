import crypto from 'crypto'

export function gerarChaveRecuperacao() {

    const valorAleatorio = crypto
        .randomBytes(16)
        .toString('hex')
        .toUpperCase()

    const grupos = valorAleatorio.match(/.{1,4}/g)

    const chave = `CHIRON-${grupos.join('-')}`

    return chave
}


export function gerarHashChaveRecuperacao(chave) {

    if (typeof chave !== 'string') {
        throw new Error(
            'A chave de recuperação precisa ser uma string.'
        )
    }

    return crypto
        .createHash('sha256')
        .update(chave)
        .digest('hex')
}