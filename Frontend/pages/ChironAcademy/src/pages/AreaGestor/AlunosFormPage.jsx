import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  cadastrarAluno,
  listarAlunos,
  atualizarAluno,
  excluirAluno
} from '../../services/gestorServices/alunoFormService'


const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'


function AlunosFormPage() {

  const navigate =
    useNavigate()


  // ======================================================
  // ESTADOS
  // ======================================================

  const [alunos, setAlunos] =
    useState([])

  const [cursos, setCursos] =
    useState([])

  const [periodos, setPeriodos] =
    useState([])


  const [alunoEmEdicao, setAlunoEmEdicao] =
    useState(null)

  const [alunoParaExcluir, setAlunoParaExcluir] =
    useState(null)


  const [form, setForm] =
    useState({
      nome: '',
      telefone: '',
      email: '',
      numeroMatricula: '',
      idCurso: '',
      idPeriodo: ''
    })


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

    carregarDados()

  }, [])


  async function carregarDados() {

    await Promise.all([
      carregarCursos(),
      carregarAlunos()
    ])

  }


  async function carregarAlunos() {

    try {

      const dados =
        await listarAlunos()

      setAlunos(dados)

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível carregar os alunos.',
        'erro'
      )

    }

  }


  async function carregarCursos() {

    try {

      const token =
        sessionStorage.getItem('chiron_token')


      const resposta =
        await fetch(
          `${API_URL}/api/cursos`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )


      const dados =
        await resposta.json()


      if (!resposta.ok) {

        throw new Error(
          dados.mensagem ||
          dados.message ||
          'Erro ao carregar cursos.'
        )

      }


      setCursos(dados)

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível carregar os cursos.',
        'erro'
      )

    }

  }


  async function carregarPeriodos(cursoId) {

    try {

      const token =
        sessionStorage.getItem('chiron_token')


      const resposta =
        await fetch(
          `${API_URL}/api/periodos?curso=${cursoId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )


      const dados =
        await resposta.json()


      if (!resposta.ok) {

        throw new Error(
          dados.mensagem ||
          dados.message ||
          'Erro ao carregar períodos.'
        )

      }


      setPeriodos(dados)

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível carregar os períodos.',
        'erro'
      )

    }

  }


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


  function handleCursoChange(event) {

    const valor =
      event.target.value


    setForm(prev => ({
      ...prev,
      idCurso: valor,
      idPeriodo: ''
    }))


    if (valor) {

      carregarPeriodos(valor)

    } else {

      setPeriodos([])

    }

  }


  // ======================================================
  // LIMPAR / REDEFINIR FORMULÁRIO
  // ======================================================

  function limparFormulario() {

    setForm({
      nome: '',
      telefone: '',
      email: '',
      numeroMatricula: '',
      idCurso: '',
      idPeriodo: ''
    })


    setPeriodos([])

    setAlunoEmEdicao(null)

  }


  // ======================================================
  // VALIDAÇÃO
  // ======================================================

  function validarFormulario() {

    const nome =
      form.nome.trim()


    if (!nome) {

      mostrarToast(
        'O nome do aluno é obrigatório.',
        'erro'
      )

      return false

    }


    const email =
      form.email.trim()


    if (!email) {

      mostrarToast(
        'O e-mail é obrigatório.',
        'erro'
      )

      return false

    }


    const formatoEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/


    if (!formatoEmail.test(email)) {

      mostrarToast(
        'Informe um e-mail válido.',
        'erro'
      )

      return false

    }


    if (!form.numeroMatricula.trim()) {

      mostrarToast(
        'A matrícula é obrigatória.',
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


    if (!form.idPeriodo) {

      mostrarToast(
        'Selecione um período acadêmico.',
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


    const dadosAluno = {

      nome:
        form.nome.trim(),

      telefone:
        form.telefone.trim(),

      email:
        form.email.trim(),

      numeroMatricula:
        form.numeroMatricula.trim(),

      idCurso:
        Number(form.idCurso),

      idPeriodo:
        Number(form.idPeriodo)

    }


    try {

      // ==================================================
      // ATUALIZAR
      // ==================================================

      if (alunoEmEdicao) {

        const data =
          await atualizarAluno(
            alunoEmEdicao.idAluno,
            dadosAluno
          )


        await carregarAlunos()


        mostrarToast(
          data.mensagem ||
          data.message ||
          'Aluno atualizado com sucesso.'
        )

      }

      // ==================================================
      // CADASTRAR
      // ==================================================

      else {

        const data =
          await cadastrarAluno(
            dadosAluno
          )


        await carregarAlunos()


        mostrarToast(
          data.mensagem ||
          data.message ||
          'Aluno cadastrado com sucesso.'
        )

      }


      limparFormulario()


    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível salvar o aluno.',
        'erro'
      )

    }

  }


  // ======================================================
  // EDITAR
  // ======================================================

  function handleEditar(aluno) {

    setAlunoEmEdicao(aluno)


    setForm({

      nome:
        aluno.nome,

      telefone:
        aluno.telefone || '',

      email:
        aluno.email,

      numeroMatricula:
        aluno.numeroMatricula,

      idCurso:
        String(aluno.idCurso),

      idPeriodo:
        String(aluno.idPeriodo)

    })


    carregarPeriodos(
      aluno.idCurso
    )


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  }


  // ======================================================
  // EXCLUIR
  // ======================================================

  async function confirmarExclusao() {

    if (!alunoParaExcluir) {
      return
    }


    try {

      const data =
        await excluirAluno(
          alunoParaExcluir.idAluno
        )


      setAlunos(prev =>
        prev.filter(
          aluno =>
            aluno.idAluno !==
            alunoParaExcluir.idAluno
        )
      )


      mostrarToast(
        data.mensagem ||
        data.message ||
        'Aluno excluído com sucesso.'
      )


    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível excluir o aluno.',
        'erro'
      )

    }


    setAlunoParaExcluir(null)

  }


  // ======================================================
  // INTERFACE
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-background
        px-6
        py-10
        lg:px-10
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >


        {/* ==================================================
            CABEÇALHO
        ================================================== */}

        <div
          className="
            mb-8
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-foreground
              "
            >

              Alunos

            </h1>


            <p
              className="
                mt-2
                text-sm
                text-muted-foreground
              "
            >

              Cadastre e gerencie os alunos do sistema.

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

        <div
          className="
            mb-10
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
            lg:p-8
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-card-foreground
              "
            >

              {alunoEmEdicao
                ? 'Editar aluno'
                : 'Cadastrar aluno'}

            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >

              {alunoEmEdicao
                ? 'Atualize as informações do aluno.'
                : 'Preencha as informações para cadastrar um novo aluno.'}

            </p>

          </div>


          <form
            onSubmit={handleSubmit}

            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
          >


            {/* NOME */}

            <div
              className="
                flex
                flex-col
                gap-2
                md:col-span-2
                lg:col-span-2
              "
            >

              <label
                htmlFor="nome"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Nome

              </label>


              <input
                id="nome"
                name="nome"
                type="text"

                value={
                  form.nome
                }

                onChange={
                  handleChange
                }

                placeholder="Ex.: João da Silva"

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  placeholder:text-muted-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              />

            </div>


            {/* TELEFONE */}

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              <label
                htmlFor="telefone"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Telefone

              </label>


              <input
                id="telefone"
                name="telefone"
                type="text"

                value={
                  form.telefone
                }

                onChange={
                  handleChange
                }

                placeholder="Ex.: (41) 99999-9999"

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  placeholder:text-muted-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              />

            </div>


            {/* E-MAIL */}

            <div
              className="
                flex
                flex-col
                gap-2
                md:col-span-2
              "
            >

              <label
                htmlFor="email"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                E-mail

              </label>


              <input
                id="email"
                name="email"
                type="email"

                value={
                  form.email
                }

                onChange={
                  handleChange
                }

                placeholder="Ex.: aluno@email.com"

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  placeholder:text-muted-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              />

            </div>


            {/* MATRÍCULA */}

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              <label
                htmlFor="numeroMatricula"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Matrícula

              </label>


              <input
                id="numeroMatricula"
                name="numeroMatricula"
                type="text"

                value={
                  form.numeroMatricula
                }

                onChange={
                  handleChange
                }

                placeholder="Ex.: 202600123"

                className="
                  h-11
                  rounded-lg
                  border
                  border-input
                  bg-background
                  px-3
                  text-sm
                  text-foreground
                  placeholder:text-muted-foreground
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/20
                "
              />

            </div>


            {/* CURSO */}

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

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
                  handleCursoChange
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
                    key={
                      curso.idCurso
                    }

                    value={
                      curso.idCurso
                    }
                  >

                    {curso.nomeCurso}

                  </option>

                ))}

              </select>

            </div>


            {/* PERÍODO */}

            <div
              className="
                flex
                flex-col
                gap-2
              "
            >

              <label
                htmlFor="idPeriodo"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Período acadêmico

              </label>


              <select
                id="idPeriodo"
                name="idPeriodo"

                value={
                  form.idPeriodo
                }

                onChange={
                  handleChange
                }

                disabled={
                  !form.idCurso
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <option value="">
                  Selecione um período
                </option>


                {periodos.map(periodo => (

                  <option
                    key={
                      periodo.idPeriodo
                    }

                    value={
                      periodo.idPeriodo
                    }
                  >

                    {periodo.numeroPeriodo}
                    º - {periodo.nomePeriodo}

                  </option>

                ))}

              </select>

            </div>


            {/* ==================================================
                BOTÕES
            ================================================== */}

            <div
              className="
                flex
                items-end
                justify-end
                gap-3
                md:col-span-2
                lg:col-span-3
              "
            >

              {/* REDEFINIR */}

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

                Redefinir

              </button>


              {/* CANCELAR EDIÇÃO */}

              {alunoEmEdicao && (

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


              {/* CADASTRAR / ATUALIZAR */}

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

                {alunoEmEdicao
                  ? 'Atualizar aluno'
                  : 'Cadastrar aluno'}

              </button>

            </div>

          </form>

        </div>


        {/* ==================================================
            LISTAGEM
        ================================================== */}

        <div>

          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-semibold
                  text-foreground
                "
              >

                Alunos cadastrados

              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >

                Consulte e gerencie os alunos cadastrados.

              </p>

            </div>


            <div
              className="
                text-sm
                text-muted-foreground
              "
            >

              {alunos.length}{' '}

              {alunos.length === 1
                ? 'cadastro'
                : 'cadastros'}

            </div>

          </div>


          {/* SEM ALUNOS */}

          {alunos.length === 0 && (

            <div
              className="
                rounded-2xl
                border
                border-border
                bg-card
                p-12
                text-center
                shadow-sm
              "
            >

              <h3
                className="
                  text-base
                  font-semibold
                  text-foreground
                "
              >

                Nenhum aluno cadastrado

              </h3>


              <p
                className="
                  mt-2
                  text-sm
                  text-muted-foreground
                "
              >

                Ainda não existem alunos cadastrados.

              </p>

            </div>

          )}


          {/* TABELA */}

          {alunos.length > 0 && (

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
                shadow-sm
              "
            >

              <div
                className="
                  overflow-x-auto
                "
              >

                <table
                  className="
                    w-full
                    min-w-[1000px]
                    border-collapse
                  "
                >

                  <thead>

                    <tr
                      className="
                        border-b
                        border-border
                        bg-secondary/40
                      "
                    >

                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >

                        Nome

                      </th>


                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >

                        Matrícula

                      </th>


                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >

                        E-mail

                      </th>


                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >

                        Curso

                      </th>


                      <th
                        className="
                          px-5
                          py-4
                          text-left
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >

                        Período

                      </th>


                      <th
                        className="
                          px-5
                          py-4
                          text-right
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >

                        Ações

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {alunos.map(aluno => (

                      <tr
                        key={
                          aluno.idAluno
                        }

                        className="
                          border-b
                          border-border
                          last:border-b-0
                          hover:bg-secondary/20
                        "
                      >

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            font-medium
                            text-foreground
                          "
                        >

                          {aluno.nome}

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-foreground
                          "
                        >

                          {aluno.numeroMatricula}

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-muted-foreground
                          "
                        >

                          {aluno.email}

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-foreground
                          "
                        >

                          {aluno.nomeCurso}

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-muted-foreground
                          "
                        >

                          {aluno.numeroPeriodo}
                          º - {aluno.nomePeriodo}

                        </td>


                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex
                              justify-end
                              gap-2
                            "
                          >

                            <button
                              type="button"

                              onClick={() =>
                                handleEditar(aluno)
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
                                setAlunoParaExcluir(
                                  aluno
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

      {alunoParaExcluir && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              shadow-2xl
            "
          >

            <h2
              className="
                text-lg
                font-semibold
                text-card-foreground
              "
            >

              Excluir aluno

            </h2>


            <p
              className="
                mt-3
                text-sm
                leading-6
                text-muted-foreground
              "
            >

              Tem certeza de que deseja excluir o aluno{' '}

              <span
                className="
                  font-medium
                  text-foreground
                "
              >

                "{alunoParaExcluir.nome}"

              </span>

              ?

            </p>


            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >

              <button
                type="button"

                onClick={() =>
                  setAlunoParaExcluir(null)
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


export default AlunosFormPage