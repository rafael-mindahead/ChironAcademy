import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  Pencil,
  Plus,
  Trash2
} from 'lucide-react'

import {
  atualizarAula,
  criarAula,
  excluirAula,
  listarAulas
} from '../../services/professorServices/frequenciaProfessorService.js'


const formularioVazio = {
  dataAula: '',
  conteudo: ''
}


function FrequenciaProfessorPage() {

  const {
    idProfessorTurma
  } =
    useParams()


  const navigate =
    useNavigate()


  const [
    aulas,
    setAulas
  ] =
    useState([])


  const [
    turma,
    setTurma
  ] =
    useState(null)


  const [
    formulario,
    setFormulario
  ] =
    useState(
      formularioVazio
    )


  const [
    aulaEmEdicao,
    setAulaEmEdicao
  ] =
    useState(null)


  const [
    carregando,
    setCarregando
  ] =
    useState(true)


  const [
    salvando,
    setSalvando
  ] =
    useState(false)


  const [
    erro,
    setErro
  ] =
    useState('')


  const [
    mensagem,
    setMensagem
  ] =
    useState('')


  useEffect(
    () => {

      carregar()

    },
    [
      idProfessorTurma
    ]
  )


  async function carregar() {

    try {

      setCarregando(
        true
      )

      setErro('')


      const dados =
        await listarAulas(
          idProfessorTurma
        )


      setTurma(
        dados.turma
      )


      setAulas(
        dados.aulas ||
        []
      )


    } catch (error) {

      setErro(
        error.message
      )


    } finally {

      setCarregando(
        false
      )

    }

  }


  function campo(
    nome,
    valor
  ) {

    setFormulario(
      atual => ({

        ...atual,

        [nome]:
          valor

      })
    )

  }


  function limpar() {

    setFormulario(
      formularioVazio
    )

    setAulaEmEdicao(
      null
    )

    setErro('')

  }


  function editar(
    aula
  ) {

    setAulaEmEdicao(
      aula
    )


    setFormulario({

      dataAula:
        String(
          aula.dataAula
        ).slice(
          0,
          10
        ),

      conteudo:
        aula.conteudo ||
        ''

    })


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  function toast(
    texto
  ) {

    setMensagem(
      texto
    )


    window.setTimeout(
      () =>
        setMensagem(''),
      3500
    )

  }


  async function salvar(
    event
  ) {

    event.preventDefault()


    if (
      !formulario.dataAula
    ) {

      setErro(
        'A data da aula é obrigatória.'
      )

      return

    }


    try {

      setSalvando(
        true
      )

      setErro('')


      if (
        aulaEmEdicao
      ) {

        await atualizarAula(
          idProfessorTurma,
          aulaEmEdicao.idAula,
          formulario
        )


        toast(
          'Aula atualizada com sucesso.'
        )


      } else {

        await criarAula(
          idProfessorTurma,
          formulario
        )


        toast(
          'Aula criada com sucesso.'
        )

      }


      limpar()

      await carregar()


    } catch (error) {

      setErro(
        error.message
      )


    } finally {

      setSalvando(
        false
      )

    }

  }


  async function remover(
    aula
  ) {

    const confirmar =
      window.confirm(
        'Excluir esta aula e suas frequências?'
      )


    if (!confirmar) {
      return
    }


    try {

      await excluirAula(
        idProfessorTurma,
        aula.idAula
      )


      toast(
        'Aula excluída.'
      )


      await carregar()


    } catch (error) {

      setErro(
        error.message
      )

    }

  }


  function formatarData(
    data
  ) {

    const valor =
      String(data)
        .slice(
          0,
          10
        )


    const [
      ano,
      mes,
      dia
    ] =
      valor.split('-')


    return `${dia}/${mes}/${ano}`

  }


  return (

    <div
      className="
        min-h-screen
        bg-background
        px-6
        py-10
        text-foreground
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        <button
          type="button"

          onClick={() =>
            navigate(
              `/sistema/professor/turmas/${idProfessorTurma}`
            )
          }

          className="
            mb-6
            flex
            items-center
            gap-2
            text-sm
            text-muted-foreground
          "
        >

          <ArrowLeft
            className="
              size-4
            "
          />

          Voltar para turma

        </button>


        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-6
          "
        >

          <p
            className="
              text-sm
              text-primary
            "
          >
            Frequência
          </p>


          <h1
            className="
              mt-2
              text-3xl
              font-semibold
            "
          >
            {
              turma?.nomeDisciplina ||
              'Aulas da turma'
            }
          </h1>


          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            {
              turma?.nomeCurso
            }
          </p>

        </section>


        <section
          className="
            mt-8
            rounded-2xl
            border
            border-border
            bg-card
            p-6
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >

            <Plus
              className="
                size-5
                text-primary
              "
            />


            <h2
              className="
                text-xl
                font-semibold
              "
            >
              {
                aulaEmEdicao
                  ? 'Editar aula'
                  : 'Nova aula'
              }
            </h2>

          </div>


          <form
            onSubmit={
              salvar
            }

            className="
              space-y-5
            "
          >

            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >

              <label>

                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  Data *
                </span>


                <input
                  type="date"

                  required

                  value={
                    formulario.dataAula
                  }

                  onChange={
                    event =>
                      campo(
                        'dataAula',
                        event.target.value
                      )
                  }

                  className="campo"
                />

              </label>


              <label>

                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  Conteúdo
                </span>


                <input
                  value={
                    formulario.conteudo
                  }

                  onChange={
                    event =>
                      campo(
                        'conteudo',
                        event.target.value
                      )
                  }

                  maxLength={
                    500
                  }

                  className="campo"

                  placeholder="Ex.: Introdução a orientação a objetos"
                />

              </label>

            </div>


            {
              erro && (

                <p
                  className="
                    text-sm
                    text-destructive
                  "
                >
                  {erro}
                </p>

              )
            }


            <div
              className="
                flex
                justify-end
                gap-3
                border-t
                border-border
                pt-5
              "
            >

              <button
                type="button"

                onClick={
                  limpar
                }

                className="
                  botao-secundario
                "
              >
                Redefinir
              </button>


              <button
                type="submit"

                disabled={
                  salvando
                }

                className="
                  botao-principal
                "
              >
                {
                  salvando
                    ? 'Salvando...'
                    : aulaEmEdicao
                      ? 'Atualizar aula'
                      : 'Criar aula'
                }
              </button>

            </div>

          </form>

        </section>


        <section
          className="
            mt-8
          "
        >

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Aulas cadastradas
          </h2>


          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            {
              aulas.length
            } aula(s)
          </p>


          {
            carregando
              ? (

                <p
                  className="
                    mt-6
                    text-sm
                    text-muted-foreground
                  "
                >
                  Carregando...
                </p>

              )
              : aulas.length === 0
                ? (

                  <div
                    className="
                      mt-5
                      flex
                      min-h-48
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-dashed
                      border-border
                      bg-card
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Nenhuma aula cadastrada.
                  </div>

                )
                : (

                  <div
                    className="
                      mt-5
                      grid
                      gap-4
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >

                    {
                      aulas.map(
                        aula => (

                          <article
                            key={
                              aula.idAula
                            }

                            className="
                              rounded-2xl
                              border
                              border-border
                              bg-card
                              p-5
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-xs
                                    text-primary
                                  "
                                >
                                  AULA
                                </p>


                                <h3
                                  className="
                                    mt-1
                                    font-semibold
                                  "
                                >
                                  {
                                    formatarData(
                                      aula.dataAula
                                    )
                                  }
                                </h3>

                              </div>


                              <CalendarDays
                                className="
                                  size-5
                                  text-muted-foreground
                                "
                              />

                            </div>


                            <p
                              className="
                                mt-4
                                min-h-10
                                text-sm
                                text-muted-foreground
                              "
                            >
                              {
                                aula.conteudo ||
                                'Sem conteúdo informado.'
                              }
                            </p>


                            <div
                              className="
                                mt-4
                                grid
                                grid-cols-3
                                gap-2
                                text-center
                                text-xs
                              "
                            >

                              <Resumo
                                titulo="Presentes"
                                valor={
                                  aula.presentes ||
                                  0
                                }
                              />


                              <Resumo
                                titulo="Faltas"
                                valor={
                                  aula.faltas ||
                                  0
                                }
                              />


                              <Resumo
                                titulo="Justif."
                                valor={
                                  aula.justificadas ||
                                  0
                                }
                              />

                            </div>


                            <button
                              type="button"

                              onClick={() =>
                                navigate(
                                  `/sistema/professor/turmas/${idProfessorTurma}/aulas/${aula.idAula}/frequencia`
                                )
                              }

                              className="
                                mt-5
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-md
                                border
                                border-primary/30
                                bg-primary/5
                                px-3
                                py-2
                                text-sm
                                text-primary
                              "
                            >

                              <CheckSquare
                                className="
                                  size-4
                                "
                              />

                              Fazer chamada

                            </button>


                            <div
                              className="
                                mt-3
                                flex
                                justify-end
                                gap-2
                              "
                            >

                              <button
                                type="button"

                                onClick={() =>
                                  editar(
                                    aula
                                  )
                                }

                                className="
                                  flex
                                  items-center
                                  gap-2
                                  rounded-md
                                  border
                                  border-border
                                  px-3
                                  py-2
                                  text-sm
                                "
                              >

                                <Pencil
                                  className="
                                    size-4
                                  "
                                />

                                Editar

                              </button>


                              <button
                                type="button"

                                onClick={() =>
                                  remover(
                                    aula
                                  )
                                }

                                className="
                                  flex
                                  items-center
                                  gap-2
                                  rounded-md
                                  border
                                  border-destructive/30
                                  px-3
                                  py-2
                                  text-sm
                                  text-destructive
                                "
                              >

                                <Trash2
                                  className="
                                    size-4
                                  "
                                />

                                Excluir

                              </button>

                            </div>

                          </article>

                        )
                      )
                    }

                  </div>

                )
          }

        </section>

      </div>


      {
        mensagem && (

          <div
            className="
              fixed
              bottom-5
              right-5
              rounded-md
              border
              border-primary/30
              bg-card
              px-4
              py-3
              text-sm
            "
          >
            {mensagem}
          </div>

        )
      }

    </div>

  )

}


function Resumo({
  titulo,
  valor
}) {

  return (

    <div
      className="
        rounded-md
        bg-secondary
        p-2
      "
    >

      <p
        className="
          font-semibold
        "
      >
        {valor}
      </p>


      <p
        className="
          text-muted-foreground
        "
      >
        {titulo}
      </p>

    </div>

  )

}


export default FrequenciaProfessorPage