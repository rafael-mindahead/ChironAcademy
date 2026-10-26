const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


function obterTokenGestor() {

  const token =
    sessionStorage.getItem(
      'chiron_token'
    )


  if (!token) {

    throw new Error(
      'Token do gestor não encontrado.'
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


  if (
    body !== null
  ) {

    headers['Content-Type'] =
      'application/json'

  }


  if (
    autenticado
  ) {

    const token =
      tokenOverride ||
      obterTokenGestor()


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


export async function executarTestesPbi0812(
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
      null,

    idMatricula:
      null,

    idAvaliacao:
      null,

    idAula:
      null,

    tokenProfessor:
      null,

    usuarioProfessorCriado:
      false,

    notaCriada:
      false,

    frequenciaCriada:
      false

  }


  const sufixo =
    `${Date.now()}`


  const emailProfessor =
    `professor.test.${sufixo}@chiron.local`


  const emailAluno =
    `aluno.pbi.${sufixo}@chiron.local`


  const numeroMatricula =
    `PBI${sufixo}`


  const codDisciplina =
    `PBI${sufixo.slice(-8)}`


  const senhaProfessor =
    'Professor@Test123'


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
    // PREPARAÇÃO
    // ==================================================

    await executar(
      'Preparação 08-12',
      'Criar curso temporário',

      async () => {

        const resposta =
          await request(
            '/api/cursos',
            {

              method:
                'POST',

              body: {

                nomeCurso:
                  `PBI Curso ${sufixo}`,

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


        recursos.idCurso =
          resposta.data
            ?.curso
            ?.idCurso


        garantir(
          recursos.idCurso,
          'idCurso não retornado.'
        )


        return (
          `Curso ${recursos.idCurso} criado.`
        )

      }
    )


    await executar(
      'Preparação 08-12',
      'Criar período temporário',

      async () => {

        const resposta =
          await request(
            '/api/periodos',
            {

              method:
                'POST',

              body: {

                numeroPeriodo:
                  6,

                nomePeriodo:
                  'PBI Período Teste',

                idCurso:
                  recursos.idCurso

              }

            }
          )


        garantir(
          resposta.status === 201,
          `Status esperado 201, recebido ${resposta.status}.`
        )


        recursos.idPeriodo =
          resposta.data
            ?.periodo
            ?.idPeriodo


        garantir(
          recursos.idPeriodo,
          'idPeriodo não retornado.'
        )


        return (
          `Período ${recursos.idPeriodo} criado.`
        )

      }
    )


    await executar(
      'Preparação 08-12',
      'Criar aluno temporário',

      async () => {

        const resposta =
          await request(
            '/api/alunos',
            {

              method:
                'POST',

              body: {

                nome:
                  'PBI Aluno Teste',

                telefone:
                  null,

                email:
                  emailAluno,

                numeroMatricula,

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


        recursos.idAluno =
          resposta.data
            ?.idAluno


        garantir(
          recursos.idAluno,
          'idAluno não retornado.'
        )


        return (
          `Aluno ${recursos.idAluno} criado.`
        )

      }
    )


    await executar(
      'Preparação 08-12',
      'Criar professor temporário',

      async () => {

        const resposta =
          await request(
            '/api/professores',
            {

              method:
                'POST',

              body: {

                nome:
                  'PBI Professor Teste',

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


        recursos.idProfessor =
          resposta.data
            ?.professor
            ?.idProfessor


        garantir(
          recursos.idProfessor,
          'idProfessor não retornado.'
        )


        return (
          `Professor ${recursos.idProfessor} criado.`
        )

      }
    )


    await executar(
      'Preparação 08-12',
      'Criar disciplina temporária',

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
                  'PBI Disciplina Teste',

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


        recursos.codDisciplina =
          codDisciplina


        return (
          `Disciplina ${codDisciplina} criada.`
        )

      }
    )


    await executar(
      'Preparação 08-12',
      'Criar turma temporária',

      async () => {

        const resposta =
          await request(
            '/api/turmas',
            {

              method:
                'POST',

              body: {

                localTurma:
                  'PBI Sala Teste',

                turnoTurma:
                  'NOITE',

                idCurso:
                  recursos.idCurso

              }

            }
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        recursos.idTurma =
          resposta.data
            ?.turma
            ?.idTurma


        garantir(
          recursos.idTurma,
          'idTurma não retornado.'
        )


        return (
          `Turma ${recursos.idTurma} criada.`
        )

      }
    )


    await executar(
      'Preparação 08-12',
      'Criar vínculo acadêmico',

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
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        recursos.idVinculo =
          resposta.data
            ?.vinculo
            ?.idProfessorTurma


        garantir(
          recursos.idVinculo,
          'idProfessorTurma não retornado.'
        )


        return (
          `Vínculo ${recursos.idVinculo} criado.`
        )

      }
    )


    // ==================================================
    // PBI 08 - MATRÍCULAS
    // ==================================================

    await executar(
      'PBI 08 - Matrículas',
      'Matricular aluno',

      async () => {

        const resposta =
          await request(
            '/api/matriculas',
            {

              method:
                'POST',

              body: {

                idAluno:
                  recursos.idAluno,

                idTurma:
                  recursos.idTurma,

                codDisciplina:
                  recursos.codDisciplina,

                statusMatricula:
                  'CURSANDO'

              }

            }
          )


        garantir(
          resposta.status === 201,
          `Status esperado 201, recebido ${resposta.status}.`
        )


        recursos.idMatricula =
          resposta.data
            ?.matricula
            ?.idMatricula


        garantir(
          recursos.idMatricula,
          'idMatricula não retornado.'
        )


        return (
          `Matrícula ${recursos.idMatricula} criada.`
        )

      }
    )


    await executar(
      'PBI 08 - Matrículas',
      'Listar matrícula criada',

      async () => {

        const resposta =
          await request(
            '/api/matriculas'
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        garantir(
          resposta.data
            ?.matriculas
            ?.some(
              item =>
                Number(
                  item.idMatricula
                ) ===
                Number(
                  recursos.idMatricula
                )
            ),
          'Matrícula não encontrada.'
        )


        return (
          'Matrícula encontrada na listagem.'
        )

      }
    )


    await executar(
      'PBI 08 - Matrículas',
      'Bloquear matrícula duplicada',

      async () => {

        const resposta =
          await request(
            '/api/matriculas',
            {

              method:
                'POST',

              body: {

                idAluno:
                  recursos.idAluno,

                idTurma:
                  recursos.idTurma,

                codDisciplina:
                  recursos.codDisciplina,

                statusMatricula:
                  'CURSANDO'

              }

            }
          )


        garantir(
          resposta.status === 409,
          `Era esperado 409, recebido ${resposta.status}.`
        )


        return (
          'Duplicidade bloqueada corretamente.'
        )

      }
    )


    await executar(
      'PBI 08 - Matrículas',
      'Atualizar status da matrícula',

      async () => {

        const resposta =
          await request(
            `/api/matriculas/${recursos.idMatricula}`,
            {

              method:
                'PUT',

              body: {

                idAluno:
                  recursos.idAluno,

                idTurma:
                  recursos.idTurma,

                codDisciplina:
                  recursos.codDisciplina,

                statusMatricula:
                  'TRANCADO'

              }

            }
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        garantir(
          resposta.data
            ?.matricula
            ?.statusMatricula ===
            'TRANCADO',
          'Status não foi atualizado.'
        )


        return (
          'Status alterado para TRANCADO.'
        )

      }
    )


    await executar(
      'PBI 08 - Matrículas',
      'Restaurar matrícula para cursando',

      async () => {

        const resposta =
          await request(
            `/api/matriculas/${recursos.idMatricula}`,
            {

              method:
                'PUT',

              body: {

                idAluno:
                  recursos.idAluno,

                idTurma:
                  recursos.idTurma,

                codDisciplina:
                  recursos.codDisciplina,

                statusMatricula:
                  'CURSANDO'

              }

            }
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        return (
          'Matrícula restaurada para CURSANDO.'
        )

      }
    )


    // ==================================================
    // CONTA DO PROFESSOR
    // ==================================================

    await executar(
      'Autenticação Professor',
      'Criar conta do professor',

      async () => {

        const resposta =
          await request(
            '/api/auth/register',
            {

              method:
                'POST',

              autenticado:
                false,

              body: {

                email:
                  emailProfessor,

                senha:
                  senhaProfessor

              }

            }
          )


        garantir(
          resposta.status === 201,
          `Status esperado 201, recebido ${resposta.status}.`
        )


        garantir(
          resposta.data
            ?.usuario
            ?.perfil ===
            'PROFESSOR',
          'Perfil PROFESSOR não atribuído.'
        )


        recursos.usuarioProfessorCriado =
          true


        return (
          'Conta PROFESSOR criada.'
        )

      }
    )


    await executar(
      'Autenticação Professor',
      'Login do professor',

      async () => {

        const resposta =
          await request(
            '/api/auth/login',
            {

              method:
                'POST',

              autenticado:
                false,

              body: {

                email:
                  emailProfessor,

                senha:
                  senhaProfessor

              }

            }
          )


        garantir(
          resposta.status === 200,
          `Status esperado 200, recebido ${resposta.status}.`
        )


        recursos.tokenProfessor =
          resposta.data
            ?.token


        garantir(
          recursos.tokenProfessor,
          'Token do professor não retornado.'
        )


        return (
          'Professor autenticado.'
        )

      }
    )


    if (
      recursos.tokenProfessor
    ) {

      await executar(
        'Segurança',
        'Professor bloqueado nas rotas de gestor',

        async () => {

          const resposta =
            await request(
              '/api/cursos',
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
            )


          garantir(
            resposta.status === 403,
            `Era esperado 403, recebido ${resposta.status}.`
          )


          return (
            'Professor não acessou recurso de GESTOR.'
          )

        }
      )


      // ================================================
      // PBI 09
      // ================================================

      await executar(
        'PBI 09 - Turmas do Professor',
        'Listar turmas sob responsabilidade',

        async () => {

          const resposta =
            await request(
              '/api/professor/turmas',
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
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
                    turma.idProfessorTurma
                  ) ===
                  Number(
                    recursos.idVinculo
                  )
              ),
            'Turma vinculada não encontrada.'
          )


          return (
            'Turma do professor localizada.'
          )

        }
      )


      await executar(
        'PBI 09 - Turmas do Professor',
        'Consultar turma e alunos',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}`,
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.alunos
              ?.some(
                aluno =>
                  Number(
                    aluno.idMatricula
                  ) ===
                  Number(
                    recursos.idMatricula
                  )
              ),
            'Aluno matriculado não encontrado na turma.'
          )


          return (
            'Turma e aluno retornados corretamente.'
          )

        }
      )


      await executar(
        'PBI 09 - Turmas do Professor',
        'Gestor bloqueado na área do professor',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}`
            )


          garantir(
            resposta.status === 403,
            `Era esperado 403, recebido ${resposta.status}.`
          )


          return (
            'Separação de perfis confirmada.'
          )

        }
      )


      // ================================================
      // PBI 10
      // ================================================

      await executar(
        'PBI 10 - Avaliações',
        'Criar avaliação',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes`,
              {

                method:
                  'POST',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  titulo:
                    'PBI Avaliação Teste',

                  descricao:
                    'Avaliação temporária da suíte.',

                  dataAvaliacao:
                    '2026-09-20',

                  valorMaximo:
                    10

                }

              }
            )


          garantir(
            resposta.status === 201,
            `Status esperado 201, recebido ${resposta.status}.`
          )


          recursos.idAvaliacao =
            resposta.data
              ?.avaliacao
              ?.idAvaliacao


          garantir(
            recursos.idAvaliacao,
            'idAvaliacao não retornado.'
          )


          return (
            `Avaliação ${recursos.idAvaliacao} criada.`
          )

        }
      )


      await executar(
        'PBI 10 - Avaliações',
        'Listar avaliações',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes`,
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.avaliacoes
              ?.some(
                avaliacao =>
                  Number(
                    avaliacao.idAvaliacao
                  ) ===
                  Number(
                    recursos.idAvaliacao
                  )
              ),
            'Avaliação não encontrada.'
          )


          return (
            'Avaliação encontrada na listagem.'
          )

        }
      )


      await executar(
        'PBI 10 - Avaliações',
        'Atualizar avaliação',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  titulo:
                    'PBI Avaliação Atualizada',

                  descricao:
                    'Avaliação alterada pela suíte.',

                  dataAvaliacao:
                    '2026-09-21',

                  valorMaximo:
                    10

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.avaliacao
              ?.titulo ===
              'PBI Avaliação Atualizada',
            'Avaliação não foi atualizada.'
          )


          return (
            'Avaliação atualizada corretamente.'
          )

        }
      )


      // ================================================
      // PBI 11
      // ================================================

      await executar(
        'PBI 11 - Notas',
        'Consultar diário de notas',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}/notas`,
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.alunos
              ?.some(
                aluno =>
                  Number(
                    aluno.idMatricula
                  ) ===
                  Number(
                    recursos.idMatricula
                  )
              ),
            'Aluno não apareceu no diário de notas.'
          )


          return (
            'Diário carregado com aluno matriculado.'
          )

        }
      )


      await executar(
        'PBI 11 - Notas',
        'Registrar nota',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}/notas/${recursos.idMatricula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  valor:
                    8.5,

                  observacao:
                    'Nota criada pela suíte.'

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            Number(
              resposta.data
                ?.nota
                ?.valor
            ) === 8.5,
            'Valor da nota incorreto.'
          )


          recursos.notaCriada =
            true


          return (
            'Nota 8.5 registrada.'
          )

        }
      )


      await executar(
        'PBI 11 - Notas',
        'Atualizar nota',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}/notas/${recursos.idMatricula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  valor:
                    9,

                  observacao:
                    'Nota atualizada.'

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            Number(
              resposta.data
                ?.nota
                ?.valor
            ) === 9,
            'Nota não foi atualizada.'
          )


          return (
            'Nota atualizada para 9.'
          )

        }
      )


      await executar(
        'PBI 11 - Notas',
        'Bloquear nota acima do máximo',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}/notas/${recursos.idMatricula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  valor:
                    11

                }

              }
            )


          garantir(
            resposta.status === 400,
            `Era esperado 400, recebido ${resposta.status}.`
          )


          return (
            'Nota acima do limite bloqueada.'
          )

        }
      )


      await executar(
        'PBI 11 - Notas',
        'Excluir nota',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}/notas/${recursos.idMatricula}`,
              {

                method:
                  'DELETE',

                tokenOverride:
                  recursos.tokenProfessor

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.notaCriada =
            false


          return (
            'Nota removida.'
          )

        }
      )


      // ================================================
      // PBI 12
      // ================================================

      await executar(
        'PBI 12 - Frequência',
        'Criar aula',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas`,
              {

                method:
                  'POST',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  dataAula:
                    '2026-09-22',

                  conteudo:
                    'Aula criada pela suíte de testes.'

                }

              }
            )


          garantir(
            resposta.status === 201,
            `Status esperado 201, recebido ${resposta.status}.`
          )


          recursos.idAula =
            resposta.data
              ?.aula
              ?.idAula


          garantir(
            recursos.idAula,
            'idAula não retornado.'
          )


          return (
            `Aula ${recursos.idAula} criada.`
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Listar aulas',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas`,
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.aulas
              ?.some(
                aula =>
                  Number(
                    aula.idAula
                  ) ===
                  Number(
                    recursos.idAula
                  )
              ),
            'Aula não encontrada.'
          )


          return (
            'Aula encontrada na listagem.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Atualizar aula',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  dataAula:
                    '2026-09-23',

                  conteudo:
                    'Conteúdo atualizado pela suíte.'

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          return (
            'Aula atualizada.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Consultar chamada',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}/frequencias`,
              {
                tokenOverride:
                  recursos.tokenProfessor
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.alunos
              ?.some(
                aluno =>
                  Number(
                    aluno.idMatricula
                  ) ===
                  Number(
                    recursos.idMatricula
                  )
              ),
            'Aluno não apareceu na chamada.'
          )


          return (
            'Aluno disponível para chamada.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Registrar presença',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}/frequencias/${recursos.idMatricula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  statusFrequencia:
                    'PRESENTE',

                  observacao:
                    'Presença registrada pela suíte.'

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.frequencia
              ?.statusFrequencia ===
              'PRESENTE',
            'Presença não foi registrada.'
          )


          recursos.frequenciaCriada =
            true


          return (
            'Presença registrada.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Atualizar para falta',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}/frequencias/${recursos.idMatricula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  statusFrequencia:
                    'FALTA',

                  observacao:
                    'Status atualizado.'

                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          garantir(
            resposta.data
              ?.frequencia
              ?.statusFrequencia ===
              'FALTA',
            'Frequência não foi atualizada.'
          )


          return (
            'Frequência atualizada para FALTA.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Bloquear status inválido',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}/frequencias/${recursos.idMatricula}`,
              {

                method:
                  'PUT',

                tokenOverride:
                  recursos.tokenProfessor,

                body: {

                  statusFrequencia:
                    'ATRASADO'

                }

              }
            )


          garantir(
            resposta.status === 400,
            `Era esperado 400, recebido ${resposta.status}.`
          )


          return (
            'Status inválido bloqueado.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Remover frequência',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}/frequencias/${recursos.idMatricula}`,
              {

                method:
                  'DELETE',

                tokenOverride:
                  recursos.tokenProfessor

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.frequenciaCriada =
            false


          return (
            'Frequência removida.'
          )

        }
      )


      await executar(
        'PBI 12 - Frequência',
        'Excluir aula',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}`,
              {

                method:
                  'DELETE',

                tokenOverride:
                  recursos.tokenProfessor

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idAula =
            null


          return (
            'Aula temporária removida.'
          )

        }
      )

    } else {

      pular(
        'PBI 09-12',
        'Testes do professor',
        'Não foi possível autenticar o professor temporário.'
      )

    }


    // ==================================================
    // LIMPEZA
    // ==================================================

    if (
      recursos.idAvaliacao
    ) {

      await executar(
        'Limpeza 08-12',
        'Excluir avaliação temporária',

        async () => {

          const resposta =
            await request(
              `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}`,
              {

                method:
                  'DELETE',

                tokenOverride:
                  recursos.tokenProfessor

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idAvaliacao =
            null


          return (
            'Avaliação removida.'
          )

        }
      )

    }


    if (
      recursos.idMatricula
    ) {

      await executar(
        'Limpeza 08-12',
        'Excluir matrícula temporária',

        async () => {

          const resposta =
            await request(
              `/api/matriculas/${recursos.idMatricula}`,
              {
                method:
                  'DELETE'
              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.idMatricula =
            null


          return (
            'Matrícula removida.'
          )

        }
      )

    }


    if (
      recursos.idVinculo
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Vínculo removido.'
          )

        }
      )

    }


    if (
      recursos.usuarioProfessorCriado
    ) {

      await executar(
        'Limpeza 08-12',
        'Excluir conta temporária do professor',

        async () => {

          const resposta =
            await request(
              '/api/auth/test/usuario-temporario',
              {

                method:
                  'DELETE',

                body: {
                  email:
                    emailProfessor
                }

              }
            )


          garantir(
            resposta.status === 200,
            `Status esperado 200, recebido ${resposta.status}.`
          )


          recursos.usuarioProfessorCriado =
            false


          return (
            'Conta temporária removida.'
          )

        }
      )

    }


    if (
      recursos.idProfessor
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Professor removido.'
          )

        }
      )

    }


    if (
      recursos.idTurma
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Turma removida.'
          )

        }
      )

    }


    if (
      recursos.codDisciplina
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Disciplina removida.'
          )

        }
      )

    }


    if (
      recursos.idAluno
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Aluno removido.'
          )

        }
      )

    }


    if (
      recursos.idPeriodo
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Período removido.'
          )

        }
      )

    }


    if (
      recursos.idCurso
    ) {

      await executar(
        'Limpeza 08-12',
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
            'Curso removido.'
          )

        }
      )

    }


  } finally {

    // Limpeza silenciosa de segurança.

    try {

      if (
        recursos.frequenciaCriada &&
        recursos.idAula &&
        recursos.idMatricula &&
        recursos.tokenProfessor
      ) {

        await request(
          `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}/frequencias/${recursos.idMatricula}`,
          {
            method:
              'DELETE',

            tokenOverride:
              recursos.tokenProfessor
          }
        )

      }

    } catch {}


    try {

      if (
        recursos.idAula &&
        recursos.tokenProfessor
      ) {

        await request(
          `/api/professor/turmas/${recursos.idVinculo}/aulas/${recursos.idAula}`,
          {
            method:
              'DELETE',

            tokenOverride:
              recursos.tokenProfessor
          }
        )

      }

    } catch {}


    try {

      if (
        recursos.notaCriada &&
        recursos.idAvaliacao &&
        recursos.idMatricula &&
        recursos.tokenProfessor
      ) {

        await request(
          `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}/notas/${recursos.idMatricula}`,
          {
            method:
              'DELETE',

            tokenOverride:
              recursos.tokenProfessor
          }
        )

      }

    } catch {}


    try {

      if (
        recursos.idAvaliacao &&
        recursos.tokenProfessor
      ) {

        await request(
          `/api/professor/turmas/${recursos.idVinculo}/avaliacoes/${recursos.idAvaliacao}`,
          {
            method:
              'DELETE',

            tokenOverride:
              recursos.tokenProfessor
          }
        )

      }

    } catch {}


    try {

      if (
        recursos.idMatricula
      ) {

        await request(
          `/api/matriculas/${recursos.idMatricula}`,
          {
            method:
              'DELETE'
          }
        )

      }

    } catch {}


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

    } catch {}


    try {

      if (
        recursos.usuarioProfessorCriado
      ) {

        await request(
          '/api/auth/test/usuario-temporario',
          {

            method:
              'DELETE',

            body: {
              email:
                emailProfessor
            }

          }
        )

      }

    } catch {}


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

    } catch {}


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

    } catch {}


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

    } catch {}


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

    } catch {}


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

    } catch {}


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

    } catch {}

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