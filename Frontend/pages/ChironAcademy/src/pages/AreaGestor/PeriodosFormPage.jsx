import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  cadastrarPeriodo,
  listarPeriodos,
  atualizarPeriodo,
  excluirPeriodo
} from '../../services/periodoFormService.js'

import {
  listarCursos
} from '../../services/cursoFormService.js'


function PeriodosPage() {

  const navigate = useNavigate()


  // ======================================================
  // ESTADOS
  // ======================================================

  const [periodos, setPeriodos] =
    useState([])

  const [cursos, setCursos] =
    useState([])

  const [form, setForm] =
    useState({
      numeroPeriodo: '',
      nomePeriodo: '',
      idCurso: ''
    })

  const [periodoEmEdicao, setPeriodoEmEdicao] =
    useState(null)

  const [periodoParaExcluir, setPeriodoParaExcluir] =
    useState(null)

  const [toast, setToast] =
    useState(null)


  // ======================================================
  // TOAST
  // ======================================================

  useEffect(() => {

    if (!toast) {
      return
    }

    const temporizador =
      setTimeout(() => {
        setToast(null)
      }, 4000)

    return () =>
      clearTimeout(temporizador)

  }, [toast])


  function mostrarToast(
    mensagem,
    tipo = 'sucesso'
  ) {

    setToast({
      mensagem,
      tipo
    })

  }


  // ======================================================
  // CARREGAR DADOS
  // ======================================================

  useEffect(() => {

    async function carregarDados() {

      try {

        const [
          periodosData,
          cursosData
        ] = await Promise.all([
          listarPeriodos(),
          listarCursos()
        ])

        setPeriodos(periodosData)
        setCursos(cursosData)

      } catch (error) {

        mostrarToast(
          error.message ||
          'Não foi possível carregar os dados.',
          'erro'
        )

      }

    }

    carregarDados()

  }, [])


  // ======================================================
  // ALTERAÇÃO DO FORMULÁRIO
  // ======================================================

  function handleChange(event) {

    const {
      name,
      value
    } = event.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))

  }


  // ======================================================
  // LIMPAR FORMULÁRIO
  // ======================================================

  function limparFormulario() {

    setForm({
      numeroPeriodo: '',
      nomePeriodo: '',
      idCurso: ''
    })

    setPeriodoEmEdicao(null)

  }


  // ======================================================
  // VALIDAÇÃO
  // ======================================================

  function validarFormulario() {

    if (
      form.numeroPeriodo === '' ||
      form.numeroPeriodo === null ||
      form.numeroPeriodo === undefined
    ) {

      mostrarToast(
        'O número do período é obrigatório.',
        'erro'
      )

      return false

    }


    const numero =
      Number(form.numeroPeriodo)


    if (
      !Number.isInteger(numero)
    ) {

      mostrarToast(
        'O número do período deve ser um número inteiro.',
        'erro'
      )

      return false

    }


    if (numero < 1) {

      mostrarToast(
        'O número do período deve ser maior que zero.',
        'erro'
      )

      return false

    }


    const nome =
      form.nomePeriodo.trim()


    if (!nome) {

      mostrarToast(
        'O nome do período é obrigatório.',
        'erro'
      )

      return false

    }


    // Impede nomes compostos somente por números
    if (/^\d+$/.test(nome)) {

      mostrarToast(
        'O nome do período não pode conter apenas números.',
        'erro'
      )

      return false

    }


    if (!form.idCurso) {

      mostrarToast(
        'Selecione um curso.',
        'erro'
      )

      return false

    }


    return true

  }


  // ======================================================
  // CADASTRAR / ATUALIZAR
  // ======================================================

  async function handleSubmit(event) {

    event.preventDefault()


    if (!validarFormulario()) {
      return
    }


    const numero =
      Number(form.numeroPeriodo)

    const nome =
      form.nomePeriodo.trim()

    const idCurso =
      Number(form.idCurso)


    try {

      // ==================================================
      // ATUALIZAÇÃO
      // ==================================================

      if (periodoEmEdicao) {

        const data =
          await atualizarPeriodo(
            periodoEmEdicao.idPeriodo,
            numero,
            nome,
            idCurso
          )


        const cursoSelecionado =
          cursos.find(
            curso =>
              curso.idCurso === idCurso
          )


        setPeriodos(prev =>
          prev.map(periodo =>

            periodo.idPeriodo ===
            periodoEmEdicao.idPeriodo

              ? {
                  ...periodo,
                  ...data.periodo,
                  nomeCurso:
                    cursoSelecionado?.nomeCurso || ''
                }

              : periodo

          )
        )


        mostrarToast(
          data.message ||
          'Período atualizado com sucesso.'
        )


        limparFormulario()

        return

      }


      // ==================================================
      // CADASTRO
      // ==================================================

      const data =
        await cadastrarPeriodo(
          numero,
          nome,
          idCurso
        )


      const cursoSelecionado =
        cursos.find(
          curso =>
            curso.idCurso === idCurso
        )


      setPeriodos(prev => [

        ...prev,

        {
          ...data.periodo,
          nomeCurso:
            cursoSelecionado?.nomeCurso || ''
        }

      ])


      mostrarToast(
        data.message ||
        'Período cadastrado com sucesso.'
      )


      limparFormulario()

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível salvar o período.',
        'erro'
      )

    }

  }


  // ======================================================
  // EDITAR
  // ======================================================

  function handleEditar(periodo) {

    setPeriodoEmEdicao(periodo)

    setForm({

      numeroPeriodo:
        periodo.numeroPeriodo,

      nomePeriodo:
        periodo.nomePeriodo,

      idCurso:
        periodo.idCurso

    })


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // ======================================================
  // EXCLUIR
  // ======================================================

  async function confirmarExclusao() {

    if (!periodoParaExcluir) {
      return
    }


    try {

      const data =
        await excluirPeriodo(
          periodoParaExcluir.idPeriodo
        )


      setPeriodos(prev =>
        prev.filter(
          periodo =>
            periodo.idPeriodo !==
            periodoParaExcluir.idPeriodo
        )
      )


      mostrarToast(
        data.message ||
        'Período excluído com sucesso.'
      )

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível excluir o período.',
        'erro'
      )

    }


    setPeriodoParaExcluir(null)

  }


  // ======================================================
  // FORMATAÇÃO
  // ======================================================

  function formatarPeriodo(numero) {

    return `${numero}º Período`

  }


  // ======================================================
  // TELA
  // ======================================================

  return (

    <div className="
      min-h-screen
      bg-background
      px-6
      py-10
      lg:px-10
    ">

      <div className="
        mx-auto
        max-w-7xl
      ">


        {/* ==================================================
            CABEÇALHO
        ================================================== */}

        <div className="
          mb-8
          flex
          items-start
          justify-between
          gap-4
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
              tracking-tight
              text-foreground
            ">

              Períodos Acadêmicos

            </h1>

            <p className="
              mt-2
              text-sm
              text-muted-foreground
            ">

              Cadastre e gerencie os períodos acadêmicos dos cursos.

            </p>

          </div>


          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor')
            }

            className="
              h-10
              rounded-lg
              border
              border-border
              px-4
              text-sm
              font-medium
              text-foreground
              transition
              hover:bg-secondary
            "
          >

            ← Voltar ao menu

          </button>

        </div>


        {/* ==================================================
            FORMULÁRIO
        ================================================== */}

        <div className="
          mb-10
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          shadow-sm
        ">

          <div>

            <h2 className="
              text-xl
              font-semibold
              text-card-foreground
            ">

              {periodoEmEdicao
                ? 'Editar período'
                : 'Cadastrar período'
              }

            </h2>

            <p className="
              mt-1
              text-sm
              text-muted-foreground
            ">

              {periodoEmEdicao
                ? 'Atualize as informações do período acadêmico.'
                : 'Preencha as informações para cadastrar um novo período.'
              }

            </p>

          </div>


          <form
            onSubmit={handleSubmit}

            className="
              mt-6
              grid
              gap-5
              md:grid-cols-3
            "
          >


            {/* ==================================================
                NÚMERO
            ================================================== */}

            <div className="
              flex
              flex-col
              gap-2
            ">

              <label
                htmlFor="numeroPeriodo"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Número do período

              </label>

              <input
                id="numeroPeriodo"
                name="numeroPeriodo"
                type="number"
                min="1"
                step="1"
                value={
                  form.numeroPeriodo
                }
                onChange={
                  handleChange
                }
                placeholder="Ex.: 1"

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              />

            </div>


            {/* ==================================================
                NOME
            ================================================== */}

            <div className="
              flex
              flex-col
              gap-2
            ">

              <label
                htmlFor="nomePeriodo"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Nome do período

              </label>

              <input
                id="nomePeriodo"
                name="nomePeriodo"
                type="text"
                value={
                  form.nomePeriodo
                }
                onChange={
                  handleChange
                }
                placeholder="Ex.: 1º Semestre"

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              />

            </div>


            {/* ==================================================
                CURSO
            ================================================== */}

            <div className="
              flex
              flex-col
              gap-2
            ">

              <label
                htmlFor="idCurso"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Curso

              </label>

              <select
                id="idCurso"
                name="idCurso"
                value={
                  form.idCurso
                }
                onChange={
                  handleChange
                }

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              >

                <option value="">
                  Selecione um curso
                </option>

                {cursos.map(curso => (

                  <option
                    key={curso.idCurso}
                    value={curso.idCurso}
                  >

                    {curso.nomeCurso}

                  </option>

                ))}

              </select>

            </div>


            {/* ==================================================
                BOTÕES
            ================================================== */}

            <div className="
              flex
              items-end
              justify-end
              gap-3
              md:col-span-3
            ">

              {periodoEmEdicao && (

                <button
                  type="button"

                  onClick={
                    limparFormulario
                  }

                  className="
                    h-11
                    rounded-lg
                    border
                    border-border
                    px-5
                    text-sm
                    font-medium
                    text-foreground
                    transition
                    hover:bg-secondary
                  "
                >

                  Cancelar

                </button>

              )}


              <button
                type="submit"

                className="
                  h-11
                  rounded-lg
                  bg-primary
                  px-6
                  text-sm
                  font-semibold
                  text-primary-foreground
                  shadow-sm
                  transition
                  hover:opacity-90
                "
              >

                {periodoEmEdicao
                  ? 'Atualizar período'
                  : 'Cadastrar período'
                }

              </button>

            </div>

          </form>

        </div>


        {/* ==================================================
            LISTAGEM
        ================================================== */}

        <div>

          <div className="
            mb-5
            flex
            items-end
            justify-between
            gap-4
          ">

            <div>

              <h2 className="
                text-xl
                font-semibold
                text-foreground
              ">

                Períodos cadastrados

              </h2>

              <p className="
                mt-1
                text-sm
                text-muted-foreground
              ">

                Consulte e gerencie os períodos vinculados aos cursos.

              </p>

            </div>


            <div className="
              text-sm
              text-muted-foreground
            ">

              {periodos.length}{' '}

              {periodos.length === 1
                ? 'cadastro'
                : 'cadastros'
              }

            </div>

          </div>


          {/* ==================================================
              SEM PERÍODOS
          ================================================== */}

          {periodos.length === 0 && (

            <div className="
              rounded-2xl
              border
              border-border
              bg-card
              p-12
              text-center
              shadow-sm
            ">

              <h3 className="
                text-base
                font-semibold
                text-foreground
              ">

                Nenhum período cadastrado

              </h3>

              <p className="
                mt-2
                text-sm
                text-muted-foreground
              ">

                Ainda não existem períodos acadêmicos cadastrados.

              </p>

            </div>

          )}


          {/* ==================================================
              TABELA
          ================================================== */}

          {periodos.length > 0 && (

            <div className="
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              shadow-sm
            ">

              <div className="
                overflow-x-auto
              ">

                <table className="
                  w-full
                  min-w-[700px]
                  border-collapse
                ">

                  <thead>

                    <tr className="
                      border-b
                      border-border
                      bg-secondary/40
                    ">

                      <th className="
                        px-5
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      ">

                        Número

                      </th>

                      <th className="
                        px-5
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      ">

                        Nome

                      </th>

                      <th className="
                        px-5
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-foreground
                      ">

                        Curso

                      </th>

                      <th className="
                        px-5
                        py-4
                        text-right
                        text-sm
                        font-semibold
                        text-foreground
                      ">

                        Ações

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {periodos
                      .slice()
                      .sort(
                        (a, b) =>
                          a.numeroPeriodo -
                          b.numeroPeriodo
                      )
                      .map(periodo => (

                        <tr
                          key={
                            periodo.idPeriodo
                          }

                          className="
                            border-b
                            border-border
                            last:border-b-0
                            hover:bg-secondary/20
                          "
                        >

                          {/* NÚMERO */}

                          <td className="
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-foreground
                          ">

                            {formatarPeriodo(
                              periodo.numeroPeriodo
                            )}

                          </td>


                          {/* NOME */}

                          <td className="
                            px-5
                            py-4
                            text-sm
                            text-foreground
                          ">

                            {periodo.nomePeriodo}

                          </td>


                          {/* CURSO */}

                          <td className="
                            px-5
                            py-4
                            text-sm
                            text-muted-foreground
                          ">

                            {periodo.nomeCurso}

                          </td>


                          {/* AÇÕES */}

                          <td className="
                            px-5
                            py-4
                          ">

                            <div className="
                              flex
                              justify-end
                              gap-2
                            ">

                              <button
                                type="button"

                                onClick={() =>
                                  handleEditar(
                                    periodo
                                  )
                                }

                                className="
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-sm
                                  font-medium
                                  text-primary
                                  transition
                                  hover:bg-primary/10
                                "
                              >

                                Editar

                              </button>


                              <button
                                type="button"

                                onClick={() =>
                                  setPeriodoParaExcluir(
                                    periodo
                                  )
                                }

                                className="
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-sm
                                  font-medium
                                  text-destructive
                                  transition
                                  hover:bg-destructive/10
                                "
                              >

                                Excluir

                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* ======================================================
          MODAL DE EXCLUSÃO
      ====================================================== */}

      {periodoParaExcluir && (

        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/60
          p-4
          backdrop-blur-sm
        ">

          <div className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-2xl
          ">

            <h2 className="
              text-lg
              font-semibold
              text-card-foreground
            ">

              Excluir período

            </h2>


            <p className="
              mt-3
              text-sm
              leading-6
              text-muted-foreground
            ">

              Tem certeza de que deseja excluir o período{' '}

              <span className="
                font-medium
                text-foreground
              ">

                "{periodoParaExcluir.nomePeriodo}"

              </span>

              {' '}do curso{' '}

              <span className="
                font-medium
                text-foreground
              ">

                "{periodoParaExcluir.nomeCurso}"

              </span>

              ?

            </p>


            <div className="
              mt-6
              flex
              justify-end
              gap-3
            ">

              <button
                type="button"

                onClick={() =>
                  setPeriodoParaExcluir(null)
                }

                className="
                  h-10
                  rounded-lg
                  border
                  border-border
                  px-5
                  text-sm
                  font-medium
                  text-foreground
                  transition
                  hover:bg-secondary
                "
              >

                Cancelar

              </button>


              <button
                type="button"

                onClick={
                  confirmarExclusao
                }

                className="
                  h-10
                  rounded-lg
                  bg-destructive
                  px-5
                  text-sm
                  font-semibold
                  text-destructive-foreground
                  transition
                  hover:opacity-90
                "
              >

                Excluir

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          TOAST
      ====================================================== */}

      {toast && (

        <div
          className="
            fixed
            bottom-5
            right-5
            z-50
            flex
            max-w-sm
            items-center
            rounded-xl
            border
            border-border
            bg-card
            px-4
            py-3
            text-sm
            text-foreground
            shadow-xl
          "

          style={{
            borderLeftWidth: '4px',

            borderLeftColor:
              toast.tipo === 'erro'
                ? 'var(--color-destructive)'
                : 'var(--color-primary)'
          }}
        >

          {toast.mensagem}

        </div>

      )}

    </div>

  )

}


export default PeriodosPage