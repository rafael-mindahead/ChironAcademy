const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


function obterToken() {

  const token =
    sessionStorage.getItem(
      'chiron_token'
    )

  if (!token) {

    throw new Error(
      'Token de autenticação não encontrado.'
    )

  }

  return token
}


async function request(
  caminho,
  {
    method = 'GET',
    body = null,
    autenticado = true,
    tokenOverride = null
  } = {}
) {

  const headers = {}


  if (body !== null) {

    headers['Content-Type'] =
      'application/json'

  }


  if (autenticado) {

    const token =
      tokenOverride ||
      obterToken()

    headers.Authorization =
      `Bearer ${token}`

  }


  const response =
    await fetch(
      `${API_URL}${caminho}`,
      {
        method,
        headers,

        body:
          body !== null
            ? JSON.stringify(body)
            : undefined
      }
    )


  const texto =
    await response.text()


  let data = null


  if (texto) {

    try {

      data =
        JSON.parse(texto)

    } catch {

      data =
        texto

    }

  }


  return {

    ok:
      response.ok,

    status:
      response.status,

    data

  }

}


function garantir(
  condicao,
  mensagem
) {

  if (!condicao) {

    throw new Error(mensagem)

  }

}


export async function executarTestesIntegracao(
  onUpdate = () => {}
) {

  const resultados = []

  const recursos = {

    idCurso:
      null,

    idPeriodo:
      null,

    idAluno:
      null

  }


  const sufixo =
    `${Date.now()}`


  const nomeCurso =
    `TEST Curso ${sufixo}`


  const matricula =
    `TEST${sufixo}`


  const emailAluno =
    `test.${sufixo}@chiron.local`


  function publicar(resultado) {

    resultados.push(
      resultado
    )

    onUpdate(
      [...resultados]
    )

  }


  function pular(
    grupo,
    nome,
    motivo
  ) {

    publicar({

      grupo,
      nome,

      status:
        'SKIP',

      detalhe:
        motivo,

      duracaoMs:
        0

    })

  }


  async function executar(
    grupo,
    nome,
    teste
  ) {

    const inicio =
      performance.now()


    try {

      const detalhe =
        await teste()


      publicar({

        grupo,
        nome,

        status:
          'PASS',

        detalhe:
          detalhe ||
          'Teste concluído.',

        duracaoMs:
          Math.round(
            performance.now() -
            inicio
          )

      })


      return true


    } catch (error) {

      publicar({

        grupo,
        nome,

        status:
          'FAIL',

        detalhe:
          error.message,

        duracaoMs:
          Math.round(
            performance.now() -
            inicio
          )

      })


      return false

    }

  }


  try {

    // ==================================================
    // INFRAESTRUTURA
    // ==================================================

    await executar(
      'Infraestrutura',
      'Backend Health',
      async () => {

        const resposta =
          await request(
            '/api/health',
            {
              autenticado:
                false
            }
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        garantir(
          resposta.data?.status === 'ok',
          'Backend não retornou status ok.'
        )


        return 'API online.'

      }
    )


    await executar(
      'Infraestrutura',
      'Database Health',
      async () => {

        const resposta =
          await request(
            '/api/database/health',
            {
              autenticado:
                false
            }
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        garantir(
          resposta.data?.status === 'ok',
          'Banco não retornou status ok.'
        )


        return `MySQL conectado em ${resposta.data.database}.`

      }
    )


    // ==================================================
    // AUTENTICAÇÃO
    // ==================================================

    const authOk =
      await executar(
        'Autenticação',
        'JWT /me',
        async () => {

          const resposta =
            await request(
              '/api/auth/me'
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data?.usuario?.perfil ===
              'GESTOR',
            'O usuário autenticado não possui perfil GESTOR.'
          )


          return (
            `${resposta.data.usuario.email} autenticado como GESTOR.`
          )

        }
      )


    await executar(
      'Segurança',
      'Token inválido bloqueado',
      async () => {

        const resposta =
          await request(
            '/api/cursos',
            {
              tokenOverride:
                'TOKEN_INVALIDO_CHIRON'
            }
          )


        garantir(
          resposta.status === 401,
          `Era esperado 401, recebido ${resposta.status}.`
        )


        return 'API rejeitou JWT inválido corretamente.'

      }
    )


    if (!authOk) {

      pular(
        'Cursos',
        'CRUD de Cursos',
        'Autenticação do gestor falhou.'
      )

      return gerarResumo(
        resultados
      )

    }


    // ==================================================
    // CURSOS
    // ==================================================

    const cursoCriado =
      await executar(
        'Cursos',
        'Criar curso',
        async () => {

          const resposta =
            await request(
              '/api/cursos',
              {

                method:
                  'POST',

                body: {

                  nomeCurso,

                  modalidade:
                    'PRESENCIAL',

                  duracaoSemestres:
                    8

                }

              }
            )


          garantir(
            resposta.status === 201,
            `Status esperado 201, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data?.curso?.idCurso,
            'A API não retornou idCurso.'
          )


          recursos.idCurso =
            resposta.data.curso.idCurso


          return (
            `Curso temporário criado com ID ${recursos.idCurso}.`
          )

        }
      )


    if (cursoCriado) {

      await executar(
        'Cursos',
        'Listar cursos',
        async () => {

          const resposta =
            await request(
              '/api/cursos'
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            Array.isArray(
              resposta.data
            ),
            'A listagem não retornou um array.'
          )


          garantir(
            resposta.data.some(
              curso =>
                Number(
                  curso.idCurso
                ) ===
                Number(
                  recursos.idCurso
                )
            ),
            'Curso temporário não apareceu na listagem.'
          )


          return 'Curso encontrado na listagem.'

        }
      )


      await executar(
        'Cursos',
        'Buscar curso por ID',
        async () => {

          const resposta =
            await request(
              `/api/cursos/${recursos.idCurso}`
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data?.nomeCurso ===
              nomeCurso,
            'Nome do curso retornado é diferente do esperado.'
          )


          return 'Consulta individual funcionando.'

        }
      )


      await executar(
        'Cursos',
        'Atualizar curso',
        async () => {

          const resposta =
            await request(
              `/api/cursos/${recursos.idCurso}`,
              {

                method:
                  'PUT',

                body: {

                  nomeCurso,

                  modalidade:
                    'HIBRIDO',

                  duracaoSemestres:
                    9

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          return 'Curso atualizado para HIBRIDO / 9 semestres.'

        }
      )


      await executar(
        'Cursos',
        'Bloquear curso duplicado',
        async () => {

          const resposta =
            await request(
              '/api/cursos',
              {

                method:
                  'POST',

                body: {

                  nomeCurso,

                  modalidade:
                    'HIBRIDO',

                  duracaoSemestres:
                    9

                }

              }
            )


          garantir(
            resposta.status === 400,
            `Era esperado 400, recebido ${resposta.status}.`
          )


          return 'Duplicidade bloqueada corretamente.'

        }
      )

    } else {

      pular(
        'Cursos',
        'Listagem / leitura / atualização',
        'Criação do curso falhou.'
      )

    }


    // ==================================================
    // PERÍODOS
    // ==================================================

    let periodoCriado =
      false


    if (recursos.idCurso) {

      periodoCriado =
        await executar(
          'Períodos',
          'Criar período',
          async () => {

            const resposta =
              await request(
                '/api/periodos',
                {

                  method:
                    'POST',

                  body: {

                    numeroPeriodo:
                      2,

                    nomePeriodo:
                      'TEST Período',

                    idCurso:
                      recursos.idCurso

                  }

                }
              )


            garantir(
              resposta.status === 201,
              `Status esperado 201, recebido ${resposta.status}.`
            )


            garantir(
              resposta.data?.periodo?.idPeriodo,
              'A API não retornou idPeriodo.'
            )


            recursos.idPeriodo =
              resposta.data.periodo.idPeriodo


            return (
              `Período criado com ID ${recursos.idPeriodo}.`
            )

          }
        )

    } else {

      pular(
        'Períodos',
        'Criar período',
        'Curso temporário não disponível.'
      )

    }


    if (periodoCriado) {

      await executar(
        'Períodos',
        'Listar períodos do curso',
        async () => {

          const resposta =
            await request(
              `/api/periodos?curso=${recursos.idCurso}`
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data.some(
              periodo =>
                Number(
                  periodo.idPeriodo
                ) ===
                Number(
                  recursos.idPeriodo
                )
            ),
            'Período não encontrado na listagem.'
          )


          return 'Relação Curso → Período confirmada.'

        }
      )


      await executar(
        'Períodos',
        'Atualizar período',
        async () => {

          const resposta =
            await request(
              `/api/periodos/${recursos.idPeriodo}`,
              {

                method:
                  'PUT',

                body: {

                  numeroPeriodo:
                    3,

                  nomePeriodo:
                    'TEST Período Atualizado',

                  idCurso:
                    recursos.idCurso

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          return 'Período atualizado corretamente.'

        }
      )


      await executar(
        'Integridade',
        'Bloquear exclusão de curso com período',
        async () => {

          const resposta =
            await request(
              `/api/cursos/${recursos.idCurso}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 400,
            `Era esperado 400, recebido ${resposta.status}.`
          )


          return 'Curso protegido por vínculo com período.'

        }
      )

    }


    // ==================================================
    // ALUNOS
    // ==================================================

    let alunoCriado =
      false


    if (
      recursos.idCurso &&
      recursos.idPeriodo
    ) {

      alunoCriado =
        await executar(
          'Alunos',
          'Criar aluno',
          async () => {

            const resposta =
              await request(
                '/api/alunos',
                {

                  method:
                    'POST',

                  body: {

                    nome:
                      'TEST Aluno Chiron',

                    telefone:
                      null,

                    email:
                      emailAluno,

                    numeroMatricula:
                      matricula,

                    idCurso:
                      recursos.idCurso,

                    idPeriodo:
                      recursos.idPeriodo

                  }

                }
              )


            garantir(
              resposta.status === 201,
              `Status esperado 201, recebido ${resposta.status}.`
            )


            garantir(
              resposta.data?.idAluno,
              'A API não retornou idAluno.'
            )


            recursos.idAluno =
              resposta.data.idAluno


            return (
              `Aluno criado com ID ${recursos.idAluno}.`
            )

          }
        )

    } else {

      pular(
        'Alunos',
        'Criar aluno',
        'Curso ou período temporário não disponível.'
      )

    }


    if (alunoCriado) {

      await executar(
        'Alunos',
        'Buscar aluno',
        async () => {

          const resposta =
            await request(
              `/api/alunos/${recursos.idAluno}`
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data?.numeroMatricula ===
              matricula,
            'Matrícula retornada é diferente da esperada.'
          )


          return 'Consulta individual funcionando.'

        }
      )


      await executar(
        'Alunos',
        'Atualizar aluno',
        async () => {

          const resposta =
            await request(
              `/api/alunos/${recursos.idAluno}`,
              {

                method:
                  'PUT',

                body: {

                  nome:
                    'TEST Aluno Atualizado',

                  telefone:
                    null,

                  email:
                    emailAluno,

                  numeroMatricula:
                    matricula,

                  idCurso:
                    recursos.idCurso,

                  idPeriodo:
                    recursos.idPeriodo

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          return 'Aluno atualizado corretamente.'

        }
      )


      await executar(
        'Alunos',
        'Bloquear matrícula duplicada',
        async () => {

          const resposta =
            await request(
              '/api/alunos',
              {

                method:
                  'POST',

                body: {

                  nome:
                    'TEST Aluno Duplicado',

                  telefone:
                    null,

                  email:
                    `duplicado.${sufixo}@chiron.local`,

                  numeroMatricula:
                    matricula,

                  idCurso:
                    recursos.idCurso,

                  idPeriodo:
                    recursos.idPeriodo

                }

              }
            )


          garantir(
            resposta.status === 400,
            `Era esperado 400, recebido ${resposta.status}.`
          )


          return 'Matrícula duplicada bloqueada.'

        }
      )


      await executar(
        'Integridade',
        'Bloquear exclusão de período com aluno',
        async () => {

          const resposta =
            await request(
              `/api/periodos/${recursos.idPeriodo}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 400,
            `Era esperado 400, recebido ${resposta.status}.`
          )


          return 'Período protegido por vínculo com aluno.'

        }
      )


      await executar(
        'Limpeza',
        'Excluir aluno temporário',
        async () => {

          const id =
            recursos.idAluno


          const resposta =
            await request(
              `/api/alunos/${id}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idAluno =
            null


          return 'Aluno temporário removido.'

        }
      )


      await executar(
        'Alunos',
        'Confirmar exclusão do aluno',
        async () => {

          const resposta =
            await request(
              `/api/alunos/${recursos.idAluno || '999999999'}`
            )


          garantir(
            resposta.status === 404,
            `Era esperado 404, recebido ${resposta.status}.`
          )


          return 'Aluno não encontrado após exclusão.'

        }
      )

    }


    // ==================================================
    // LIMPEZA DO PERÍODO
    // ==================================================

    if (recursos.idPeriodo) {

      await executar(
        'Limpeza',
        'Excluir período temporário',
        async () => {

          const resposta =
            await request(
              `/api/periodos/${recursos.idPeriodo}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idPeriodo =
            null


          return 'Período temporário removido.'

        }
      )

    }


    // ==================================================
    // LIMPEZA DO CURSO
    // ==================================================

    if (recursos.idCurso) {

      await executar(
        'Limpeza',
        'Excluir curso temporário',
        async () => {

          const resposta =
            await request(
              `/api/cursos/${recursos.idCurso}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idCurso =
            null


          return 'Curso temporário removido.'

        }
      )

    }


  } finally {

    // ==================================================
    // LIMPEZA DE SEGURANÇA
    // ==================================================

    try {

      if (recursos.idAluno) {

        await request(
          `/api/alunos/${recursos.idAluno}`,
          {
            method:
              'DELETE'
          }
        )

      }

    } catch {
      // limpeza silenciosa
    }


    try {

      if (recursos.idPeriodo) {

        await request(
          `/api/periodos/${recursos.idPeriodo}`,
          {
            method:
              'DELETE'
          }
        )

      }

    } catch {
      // limpeza silenciosa
    }


    try {

      if (recursos.idCurso) {

        await request(
          `/api/cursos/${recursos.idCurso}`,
          {
            method:
              'DELETE'
          }
        )

      }

    } catch {
      // limpeza silenciosa
    }

  }


  return gerarResumo(
    resultados
  )

}


function gerarResumo(
  resultados
) {

  return {

    resultados,

    total:
      resultados.length,

    pass:
      resultados.filter(
        item =>
          item.status === 'PASS'
      ).length,

    fail:
      resultados.filter(
        item =>
          item.status === 'FAIL'
      ).length,

    skip:
      resultados.filter(
        item =>
          item.status === 'SKIP'
      ).length

  }

}