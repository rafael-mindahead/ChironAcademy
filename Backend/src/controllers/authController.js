import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import database from '../config/database.js'

import {
  gerarChaveRecuperacao,
  gerarHashChaveRecuperacao
} from '../utils/recoveryKey.js'


// ======================================================
// CADASTRAR USUÁRIO
// ======================================================

export async function registrarUsuario(req, res) {

  try {

    const { email, senha } = req.body


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (!email || !senha) {

      return res.status(400).json({
        message: 'E-mail e senha são obrigatórios.'
      })

    }


    const emailNormalizado = email
      .trim()
      .toLowerCase()


    if (senha.length < 8) {

      return res.status(400).json({
        message:
          'A senha deve possuir pelo menos 8 caracteres.'
      })

    }


    // ==================================================
    // VERIFICAR SE JÁ EXISTE UMA CONTA
    // ==================================================

    const [usuariosExistentes] = await database.execute(
      `
        SELECT idUsuario
        FROM Usuario
        WHERE email = ?
        LIMIT 1
      `,
      [emailNormalizado]
    )


    if (usuariosExistentes.length > 0) {

      return res.status(409).json({
        message:
          'Já existe uma conta cadastrada com este e-mail.'
      })

    }


    // ==================================================
    // VERIFICAR PROFESSOR
    // ==================================================

    const [professores] = await database.execute(
      `
        SELECT idProfessor
        FROM Professor
        WHERE LOWER(email) = ?
        LIMIT 1
      `,
      [emailNormalizado]
    )


    // ==================================================
    // VERIFICAR ALUNO
    // ==================================================

    const [alunos] = await database.execute(
      `
        SELECT idAluno
        FROM Aluno
        WHERE LOWER(email) = ?
        LIMIT 1
      `,
      [emailNormalizado]
    )


    // ==================================================
    // EVITAR DOIS VÍNCULOS NO MESMO E-MAIL
    // ==================================================

    if (
      professores.length > 0 &&
      alunos.length > 0
    ) {

      return res.status(409).json({
        message:
          'O e-mail possui mais de um vínculo acadêmico. Procure a administração.'
      })

    }


    // ==================================================
    // DEFINIR PERFIL
    // ==================================================

    let perfil = null


    if (professores.length > 0) {

      perfil = 'PROFESSOR'

    }


    if (alunos.length > 0) {

      perfil = 'ALUNO'

    }


    if (!perfil) {

      return res.status(403).json({
        message:
          'Este e-mail não possui vínculo acadêmico autorizado.'
      })

    }


    // ==================================================
    // HASH DA SENHA
    // ==================================================

    const senhaHash = await bcrypt.hash(
      senha,
      12
    )


    // ==================================================
    // CHAVE DE RECUPERAÇÃO
    // ==================================================

    const recoveryKey =
      gerarChaveRecuperacao()


    const recoveryTokenHash =
      gerarHashChaveRecuperacao(
        recoveryKey
      )


    // ==================================================
    // INSERT
    // ==================================================

    const [resultado] = await database.execute(
      `
        INSERT INTO Usuario
        (
          email,
          senhaHash,
          perfil,
          recoveryTokenHash
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        emailNormalizado,
        senhaHash,
        perfil,
        recoveryTokenHash
      ]
    )


    return res.status(201).json({

      message:
        'Conta criada com sucesso.',

      usuario: {

        idUsuario:
          resultado.insertId,

        email:
          emailNormalizado,

        perfil:
          perfil

      },

      recoveryKey,

      aviso:
        'Guarde sua chave de recuperação em local seguro. Ela será exibida apenas neste momento.'

    })


  } catch (error) {

    console.error(
      'Erro ao registrar usuário:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível criar a conta.'
    })

  }

}


// ======================================================
// LOGIN
// ======================================================

export async function loginUsuario(req, res) {

  try {

    const { email, senha } = req.body


    if (!email || !senha) {

      return res.status(400).json({
        message:
          'E-mail e senha são obrigatórios.'
      })

    }


    const emailNormalizado = email
      .trim()
      .toLowerCase()


    const [usuarios] = await database.execute(
      `
        SELECT
          idUsuario,
          email,
          senhaHash,
          perfil,
          ativo
        FROM Usuario
        WHERE email = ?
        LIMIT 1
      `,
      [emailNormalizado]
    )


    if (usuarios.length === 0) {

      return res.status(401).json({
        message:
          'E-mail ou senha inválidos.'
      })

    }


    const usuario =
      usuarios[0]


    if (!usuario.ativo) {

      return res.status(403).json({
        message:
          'Esta conta está desativada.'
      })

    }


    const senhaValida =
      await bcrypt.compare(
        senha,
        usuario.senhaHash
      )


    if (!senhaValida) {

      return res.status(401).json({
        message:
          'E-mail ou senha inválidos.'
      })

    }


    if (!process.env.JWT_SECRET) {

      console.error(
        'JWT_SECRET não está configurado.'
      )


      return res.status(500).json({
        message:
          'Erro de configuração do servidor.'
      })

    }


    const token = jwt.sign(
      {
        email:
          usuario.email,

        perfil:
          usuario.perfil
      },

      process.env.JWT_SECRET,

      {
        subject:
          String(usuario.idUsuario),

        expiresIn:
          '8h'
      }
    )


    return res.status(200).json({

      message:
        'Login realizado com sucesso.',

      usuario: {

        idUsuario:
          usuario.idUsuario,

        email:
          usuario.email,

        perfil:
          usuario.perfil

      },

      token

    })


  } catch (error) {

    console.error(
      'Erro ao realizar login:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível realizar o login.'
    })

  }

}


// ======================================================
// RECUPERAR SENHA
// ======================================================

export async function recuperarSenha(req, res) {

  try {

    const {
      email,
      chaveRecuperacao,
      novaSenha
    } = req.body


    // ==================================================
    // VALIDAÇÕES
    // ==================================================

    if (
      !email ||
      !chaveRecuperacao ||
      !novaSenha
    ) {

      return res.status(400).json({
        message:
          'E-mail, chave de recuperação e nova senha são obrigatórios.'
      })

    }


    if (novaSenha.length < 8) {

      return res.status(400).json({
        message:
          'A nova senha deve possuir pelo menos 8 caracteres.'
      })

    }


    const emailNormalizado =
      email
        .trim()
        .toLowerCase()


    const chaveNormalizada =
      chaveRecuperacao
        .trim()
        .toUpperCase()


    // ==================================================
    // BUSCAR USUÁRIO
    // ==================================================

    const [usuarios] = await database.execute(
      `
        SELECT
          idUsuario,
          email,
          recoveryTokenHash,
          ativo
        FROM Usuario
        WHERE email = ?
        LIMIT 1
      `,
      [emailNormalizado]
    )


    if (usuarios.length === 0) {

      return res.status(401).json({
        message:
          'E-mail ou chave de recuperação inválidos.'
      })

    }


    const usuario =
      usuarios[0]


    if (!usuario.ativo) {

      return res.status(403).json({
        message:
          'Esta conta está desativada.'
      })

    }


    // ==================================================
    // HASH DA CHAVE INFORMADA
    // ==================================================

    const hashInformado =
      gerarHashChaveRecuperacao(
        chaveNormalizada
      )


    // ==================================================
    // COMPARAÇÃO SEGURA
    // ==================================================

    const hashInformadoBuffer =
      Buffer.from(
        hashInformado,
        'hex'
      )


    const hashSalvoBuffer =
      Buffer.from(
        usuario.recoveryTokenHash,
        'hex'
      )


    let chaveValida = false


    if (
      hashInformadoBuffer.length ===
      hashSalvoBuffer.length
    ) {

      chaveValida =
        crypto.timingSafeEqual(
          hashInformadoBuffer,
          hashSalvoBuffer
        )

    }


    if (!chaveValida) {

      return res.status(401).json({
        message:
          'E-mail ou chave de recuperação inválidos.'
      })

    }


    // ==================================================
    // NOVA SENHA
    // ==================================================

    const novaSenhaHash =
      await bcrypt.hash(
        novaSenha,
        12
      )


    // ==================================================
    // GERAR NOVA CHAVE
    // ==================================================

    const novaRecoveryKey =
      gerarChaveRecuperacao()


    const novoRecoveryTokenHash =
      gerarHashChaveRecuperacao(
        novaRecoveryKey
      )


    // ==================================================
    // ATUALIZAR USUÁRIO
    // ==================================================

    await database.execute(
      `
        UPDATE Usuario

        SET
          senhaHash = ?,
          recoveryTokenHash = ?

        WHERE idUsuario = ?
      `,
      [
        novaSenhaHash,
        novoRecoveryTokenHash,
        usuario.idUsuario
      ]
    )


    // ==================================================
    // RESPOSTA
    // ==================================================

    return res.status(200).json({

      message:
        'Senha redefinida com sucesso.',

      recoveryKey:
        novaRecoveryKey,

      aviso:
        'Sua chave de recuperação anterior foi invalidada. Guarde a nova chave em local seguro.'

    })


  } catch (error) {

    console.error(
      'Erro ao recuperar senha:',
      error
    )


    return res.status(500).json({
      message:
        'Não foi possível redefinir a senha.'
    })

  }

}