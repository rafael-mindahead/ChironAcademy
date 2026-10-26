import {
  executarTestesPbi0812
} from './devPbiTestService.js'

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

    throw new Error(
      mensagem
    )

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
      null,

    idProfessor:
      null,

    codDisciplina:
      null,

    idTurma:
      null,

    idVinculo:
      null

  }


  const sufixo =
    `${Date.now()}`


  const nomeCurso =
    `TEST Curso ${sufixo}`


  const matricula =
    `TEST${sufixo}`


  const emailAluno =
    `aluno.${sufixo}@chiron.local`


  const emailProfessor =
    `professor.${sufixo}@chiron.local`


  const codDisciplina =
    `T${sufixo.slice(-10)}`


  function publicar(
    resultado
  ) {

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


        return (
          `MySQL conectado em ${resposta.data.database}.`
        )

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
            resposta.data
              ?.usuario
              ?.perfil === 'GESTOR',

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


        return (
          'API rejeitou JWT inválido corretamente.'
        )

      }
    )


    if (!authOk) {

      pular(
        'Sistema',
        'Testes acadêmicos',
        'Autenticação do gestor falhou.'
      )


      return gerarResumo(
        todosResultados
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
            resposta.data
              ?.curso
              ?.idCurso,

            'A API não retornou idCurso.'
          )


          recursos.idCurso =
            resposta.data
              .curso
              .idCurso


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


          return (
            'Curso encontrado na listagem.'
          )

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
            resposta.data
              ?.nomeCurso ===
              nomeCurso,

            'Nome do curso retornado é diferente.'
          )


          return (
            'Consulta individual funcionando.'
          )

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


          return (
            'Curso atualizado corretamente.'
          )

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


          return (
            'Duplicidade bloqueada corretamente.'
          )

        }
      )

    }


    // ==================================================
    // PERÍODOS
    // ==================================================

    if (
      recursos.idCurso
    ) {

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
            resposta.data
              ?.periodo
              ?.idPeriodo,

            'A API não retornou idPeriodo.'
          )


          recursos.idPeriodo =
            resposta.data
              .periodo
              .idPeriodo


          return (
            `Período criado com ID ${recursos.idPeriodo}.`
          )

        }
      )

    }


    if (
      recursos.idPeriodo
    ) {

      await executar(
        'Períodos',
        'Listar períodos',

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

            'Período não encontrado.'
          )


          return (
            'Relação Curso → Período confirmada.'
          )

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


          return (
            'Período atualizado corretamente.'
          )

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


          return (
            'Curso protegido por período vinculado.'
          )

        }
      )

    }


    // ==================================================
    // ALUNOS
    // ==================================================

    if (
      recursos.idCurso &&
      recursos.idPeriodo
    ) {

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

    }


    if (
      recursos.idAluno
    ) {

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
            resposta.data
              ?.numeroMatricula ===
              matricula,

            'Matrícula retornada é diferente.'
          )


          return (
            'Consulta individual funcionando.'
          )

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


          return (
            'Aluno atualizado corretamente.'
          )

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
                    'TEST Duplicado',

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


          return (
            'Matrícula duplicada bloqueada.'
          )

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


          return (
            'Período protegido por aluno vinculado.'
          )

        }
      )

    }


    // ==================================================
    // PROFESSORES
    // ==================================================

    await executar(
      'Professores',
      'Criar professor',

      async () => {

        const resposta =
          await request(
            '/api/professores',
            {

              method:
                'POST',

              body: {

                nome:
                  'TEST Professor Chiron',

                telefone:
                  null,

                email:
                  emailProfessor

              }

            }
          )


        garantir(
          resposta.status === 201,
          `Status esperado 201, recebido ${resposta.status}.`
        )


        garantir(
          resposta.data
            ?.professor
            ?.idProfessor,

          'A API não retornou idProfessor.'
        )


        recursos.idProfessor =
          resposta.data
            .professor
            .idProfessor


        return (
          `Professor criado com ID ${recursos.idProfessor}.`
        )

      }
    )


    if (
      recursos.idProfessor
    ) {

      await executar(
        'Professores',
        'Listar professores',

        async () => {

          const resposta =
            await request(
              '/api/professores'
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            Array.isArray(
              resposta.data
                ?.professores
            ),

            'A API não retornou professores.'
          )


          garantir(
            resposta.data
              .professores
              .some(
                professor =>
                  Number(
                    professor.idProfessor
                  ) ===
                  Number(
                    recursos.idProfessor
                  )
              ),

            'Professor temporário não encontrado.'
          )


          return (
            'Professor encontrado na listagem.'
          )

        }
      )


      await executar(
        'Professores',
        'Buscar professor',

        async () => {

          const resposta =
            await request(
              `/api/professores/${recursos.idProfessor}`
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.professor
              ?.email ===
              emailProfessor,

            'Professor retornado é diferente.'
          )


          return (
            'Consulta individual funcionando.'
          )

        }
      )


      await executar(
        'Professores',
        'Atualizar professor',

        async () => {

          const resposta =
            await request(
              `/api/professores/${recursos.idProfessor}`,
              {

                method:
                  'PUT',

                body: {

                  nome:
                    'TEST Professor Atualizado',

                  telefone:
                    '41999990000',

                  email:
                    emailProfessor

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.professor
              ?.nome ===
              'TEST Professor Atualizado',

            'Professor não foi atualizado.'
          )


          return (
            'Professor atualizado corretamente.'
          )

        }
      )


      await executar(
        'Professores',
        'Bloquear e-mail duplicado',

        async () => {

          const resposta =
            await request(
              '/api/professores',
              {

                method:
                  'POST',

                body: {

                  nome:
                    'TEST Professor Duplicado',

                  telefone:
                    null,

                  email:
                    emailProfessor

                }

              }
            )


          garantir(
            resposta.status === 409,
            `Era esperado 409, recebido ${resposta.status}.`
          )


          return (
            'E-mail duplicado bloqueado.'
          )

        }
      )

    }


    // ==================================================
    // DISCIPLINAS
    // ==================================================

    if (
      recursos.idCurso &&
      recursos.idPeriodo
    ) {

      await executar(
        'Disciplinas',
        'Criar disciplina',

        async () => {

          const resposta =
            await request(
              '/api/disciplinas',
              {

                method:
                  'POST',

                body: {

                  codDisciplina,

                  nomeDisciplina:
                    'TEST Engenharia de Software',

                  tipoDisciplina:
                    'OBRIGATORIA',

                  cargaHoraria:
                    80,

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
            resposta.data
              ?.disciplina
              ?.codDisciplina ===
              codDisciplina,

            'Disciplina criada com código inesperado.'
          )


          recursos.codDisciplina =
            codDisciplina


          return (
            `Disciplina ${codDisciplina} criada.`
          )

        }
      )

    }


    if (
      recursos.codDisciplina
    ) {

      await executar(
        'Disciplinas',
        'Listar disciplinas',

        async () => {

          const resposta =
            await request(
              '/api/disciplinas'
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.disciplinas
              ?.some(
                disciplina =>
                  disciplina.codDisciplina ===
                  recursos.codDisciplina
              ),

            'Disciplina não encontrada.'
          )


          return (
            'Disciplina encontrada na listagem.'
          )

        }
      )


      await executar(
        'Disciplinas',
        'Atualizar disciplina',

        async () => {

          const resposta =
            await request(
              `/api/disciplinas/${recursos.codDisciplina}`,
              {

                method:
                  'PUT',

                body: {

                  nomeDisciplina:
                    'TEST Disciplina Atualizada',

                  tipoDisciplina:
                    'OPTATIVA',

                  cargaHoraria:
                    60,

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


          garantir(
            resposta.data
              ?.disciplina
              ?.tipoDisciplina ===
              'OPTATIVA',

            'Disciplina não foi atualizada.'
          )


          return (
            'Disciplina atualizada corretamente.'
          )

        }
      )


      await executar(
        'Disciplinas',
        'Bloquear código duplicado',

        async () => {

          const resposta =
            await request(
              '/api/disciplinas',
              {

                method:
                  'POST',

                body: {

                  codDisciplina:
                    recursos.codDisciplina,

                  nomeDisciplina:
                    'TEST Duplicada',

                  tipoDisciplina:
                    'OBRIGATORIA',

                  cargaHoraria:
                    40,

                  idCurso:
                    recursos.idCurso,

                  idPeriodo:
                    recursos.idPeriodo

                }

              }
            )


          garantir(
            resposta.status === 409,
            `Era esperado 409, recebido ${resposta.status}.`
          )


          return (
            'Código duplicado bloqueado.'
          )

        }
      )

    }


    // ==================================================
    // TURMAS
    // ==================================================

    if (
      recursos.idCurso
    ) {

      await executar(
        'Turmas',
        'Criar turma',

        async () => {

          const resposta =
            await request(
              '/api/turmas',
              {

                method:
                  'POST',

                body: {

                  localTurma:
                    `TEST Sala ${sufixo.slice(-4)}`,

                  turnoTurma:
                    'NOITE',

                  idCurso:
                    recursos.idCurso

                }

              }
            )


          // O controller atual retorna buscarTurma(),
          // por isso o status é 200.
          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.turma
              ?.idTurma,

            'A API não retornou idTurma.'
          )


          recursos.idTurma =
            resposta.data
              .turma
              .idTurma


          return (
            `Turma criada com ID ${recursos.idTurma}.`
          )

        }
      )

    }


    if (
      recursos.idTurma
    ) {

      await executar(
        'Turmas',
        'Listar turmas',

        async () => {

          const resposta =
            await request(
              '/api/turmas'
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.turmas
              ?.some(
                turma =>
                  Number(
                    turma.idTurma
                  ) ===
                  Number(
                    recursos.idTurma
                  )
              ),

            'Turma não encontrada.'
          )


          return (
            'Turma encontrada na listagem.'
          )

        }
      )


      await executar(
        'Turmas',
        'Atualizar turma',

        async () => {

          const resposta =
            await request(
              `/api/turmas/${recursos.idTurma}`,
              {

                method:
                  'PUT',

                body: {

                  localTurma:
                    'TEST Laboratório 42',

                  turnoTurma:
                    'TARDE',

                  idCurso:
                    recursos.idCurso

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.turma
              ?.turnoTurma ===
              'TARDE',

            'Turma não foi atualizada.'
          )


          return (
            'Turma atualizada corretamente.'
          )

        }
      )

    }


    // ==================================================
    // VÍNCULOS
    // ==================================================

    if (
      recursos.idProfessor &&
      recursos.idTurma &&
      recursos.codDisciplina
    ) {

      await executar(
        'Vínculos',
        'Criar vínculo Professor → Turma → Disciplina',

        async () => {

          const resposta =
            await request(
              '/api/vinculos',
              {

                method:
                  'POST',

                body: {

                  idProfessor:
                    recursos.idProfessor,

                  idTurma:
                    recursos.idTurma,

                  codDisciplina:
                    recursos.codDisciplina

                }

              }
            )


          // O controller retorna buscarVinculo(),
          // portanto atualmente responde 200.
          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.vinculo
              ?.idProfessorTurma,

            'A API não retornou idProfessorTurma.'
          )


          recursos.idVinculo =
            resposta.data
              .vinculo
              .idProfessorTurma


          return (
            `Vínculo criado com ID ${recursos.idVinculo}.`
          )

        }
      )

    }


    if (
      recursos.idVinculo
    ) {

      await executar(
        'Vínculos',
        'Listar vínculos',

        async () => {

          const resposta =
            await request(
              '/api/vinculos'
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.vinculos
              ?.some(
                vinculo =>
                  Number(
                    vinculo.idProfessorTurma
                  ) ===
                  Number(
                    recursos.idVinculo
                  )
              ),

            'Vínculo não encontrado.'
          )


          return (
            'Vínculo encontrado na listagem.'
          )

        }
      )


      await executar(
        'Vínculos',
        'Buscar vínculo',

        async () => {

          const resposta =
            await request(
              `/api/vinculos/${recursos.idVinculo}`
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            Number(
              resposta.data
                ?.vinculo
                ?.idProfessor
            ) ===
            Number(
              recursos.idProfessor
            ),

            'Professor do vínculo é diferente.'
          )


          return (
            'Relacionamento completo confirmado.'
          )

        }
      )


      await executar(
        'Vínculos',
        'Bloquear vínculo duplicado',

        async () => {

          const resposta =
            await request(
              '/api/vinculos',
              {

                method:
                  'POST',

                body: {

                  idProfessor:
                    recursos.idProfessor,

                  idTurma:
                    recursos.idTurma,

                  codDisciplina:
                    recursos.codDisciplina

                }

              }
            )


          garantir(
            resposta.status === 409,
            `Era esperado 409, recebido ${resposta.status}.`
          )


          return (
            'Vínculo duplicado bloqueado.'
          )

        }
      )


      // ==================================================
      // INTEGRIDADE DO VÍNCULO
      // ==================================================

      await executar(
        'Integridade',
        'Bloquear exclusão de professor vinculado',

        async () => {

          const resposta =
            await request(
              `/api/professores/${recursos.idProfessor}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 409,
            `Era esperado 409, recebido ${resposta.status}.`
          )


          return (
            'Professor protegido por vínculo.'
          )

        }
      )


      await executar(
        'Integridade',
        'Bloquear exclusão de turma vinculada',

        async () => {

          const resposta =
            await request(
              `/api/turmas/${recursos.idTurma}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 409,
            `Era esperado 409, recebido ${resposta.status}.`
          )


          return (
            'Turma protegida por vínculo.'
          )

        }
      )


      await executar(
        'Integridade',
        'Bloquear exclusão de disciplina vinculada',

        async () => {

          const resposta =
            await request(
              `/api/disciplinas/${recursos.codDisciplina}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 409,
            `Era esperado 409, recebido ${resposta.status}.`
          )


          return (
            'Disciplina protegida por vínculo.'
          )

        }
      )

    }


    // ==================================================
    // LIMPEZA
    // ==================================================

    if (
      recursos.idVinculo
    ) {

      await executar(
        'Limpeza',
        'Excluir vínculo temporário',

        async () => {

          const resposta =
            await request(
              `/api/vinculos/${recursos.idVinculo}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idVinculo =
            null


          return (
            'Vínculo temporário removido.'
          )

        }
      )

    }


    if (
      recursos.idProfessor
    ) {

      await executar(
        'Limpeza',
        'Excluir professor temporário',

        async () => {

          const resposta =
            await request(
              `/api/professores/${recursos.idProfessor}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idProfessor =
            null


          return (
            'Professor temporário removido.'
          )

        }
      )

    }


    if (
      recursos.idTurma
    ) {

      await executar(
        'Limpeza',
        'Excluir turma temporária',

        async () => {

          const resposta =
            await request(
              `/api/turmas/${recursos.idTurma}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idTurma =
            null


          return (
            'Turma temporária removida.'
          )

        }
      )

    }


    if (
      recursos.codDisciplina
    ) {

      await executar(
        'Limpeza',
        'Excluir disciplina temporária',

        async () => {

          const resposta =
            await request(
              `/api/disciplinas/${recursos.codDisciplina}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.codDisciplina =
            null


          return (
            'Disciplina temporária removida.'
          )

        }
      )

    }


    if (
      recursos.idAluno
    ) {

      await executar(
        'Limpeza',
        'Excluir aluno temporário',

        async () => {

          const resposta =
            await request(
              `/api/alunos/${recursos.idAluno}`,
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


          return (
            'Aluno temporário removido.'
          )

        }
      )

    }


    if (
      recursos.idPeriodo
    ) {

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


          return (
            'Período temporário removido.'
          )

        }
      )

    }


    if (
      recursos.idCurso
    ) {

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


          return (
            'Curso temporário removido.'
          )

        }
      )

    }


  } finally {

    // ==================================================
    // LIMPEZA DE SEGURANÇA
    // ==================================================

    // Ordem inversa das dependências:
    //
    // Vínculo
    // Aluno
    // Disciplina
    // Turma
    // Professor
    // Período
    // Curso


    try {

      if (
        recursos.idVinculo
      ) {

        await request(
          `/api/vinculos/${recursos.idVinculo}`,
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

      if (
        recursos.idAluno
      ) {

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

      if (
        recursos.codDisciplina
      ) {

        await request(
          `/api/disciplinas/${recursos.codDisciplina}`,
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

      if (
        recursos.idTurma
      ) {

        await request(
          `/api/turmas/${recursos.idTurma}`,
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

      if (
        recursos.idProfessor
      ) {

        await request(
          `/api/professores/${recursos.idProfessor}`,
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

      if (
        recursos.idPeriodo
      ) {

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

      if (
        recursos.idCurso
      ) {

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
  const resultadoPbis =
  await executarTestesPbi0812(
    novosResultados => {

      onUpdate([
        ...resultados,
        ...novosResultados
      ])

    }
  )


const todosResultados = [
  ...resultados,
  ...resultadoPbis.resultados
]
  return gerarResumo(
    todosResultados   
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