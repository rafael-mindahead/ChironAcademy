import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  atualizarProfessor,
  criarProfessor,
  excluirProfessor,
  listarProfessores
} from '../../services/professorFormService'


const professorVazio = {
  nome: '',
  telefone: '',
  email: ''
}


function ProfessoresPage() {

  const navigate = useNavigate()

  // ======================================================
  // ESTADOS
  // ======================================================

  const [professores, setProfessores] =
    useState([])

  const [professorEmEdicao, setProfessorEmEdicao] =
    useState(null)

  const [professorParaExcluir, setProfessorParaExcluir] =
    useState(null)

  const [form, setForm] =
    useState(professorVazio)

  const [busca, setBusca] =
    useState('')

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
  // CARREGAR PROFESSORES
  // ======================================================

  useEffect(() => {
    carregarProfessores()
  }, [])


  async function carregarProfessores() {

    try {

      const dados =
        await listarProfessores()

      setProfessores(dados)

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível carregar os professores.',
        'erro'
      )
    }
  }


  // ======================================================
  // FILTRO DE BUSCA
  // ======================================================

  const professoresFiltrados =
    useMemo(() => {

      const termo =
        busca.trim().toLowerCase()

      if (!termo) {
        return professores
      }

      return professores.filter(
        professor =>
          professor.nome
            .toLowerCase()
            .includes(termo) ||

          professor.email
            .toLowerCase()
            .includes(termo)
      )

    }, [busca, professores])


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
  // LIMPAR / REDEFINIR FORMULÁRIO
  // ======================================================

  function limparFormulario() {

    setForm({
      ...professorVazio
    })

    setProfessorEmEdicao(null)
  }


  // ======================================================
  // VALIDAÇÃO
  // ======================================================

  function validarFormulario() {

    const nome =
      form.nome.trim()

    if (!nome) {

      mostrarToast(
        'O nome do professor é obrigatório.',
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


    const dadosProfessor = {

      nome:
        form.nome.trim(),

      telefone:
        form.telefone.trim(),

      email:
        form.email.trim()
    }


    try {

      // ==================================================
      // ATUALIZAR
      // ==================================================

      if (professorEmEdicao) {

        const data =
          await atualizarProfessor(
            professorEmEdicao.idProfessor,
            dadosProfessor
          )

        await carregarProfessores()

        mostrarToast(
          data.mensagem ||
          data.message ||
          'Professor atualizado com sucesso.'
        )
      }

      // ==================================================
      // CADASTRAR
      // ==================================================

      else {

        const data =
          await criarProfessor(
            dadosProfessor
          )

        await carregarProfessores()

        mostrarToast(
          data.mensagem ||
          data.message ||
          'Professor cadastrado com sucesso.'
        )
      }


      limparFormulario()

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível salvar o professor.',
        'erro'
      )
    }
  }


  // ======================================================
  // EDITAR
  // ======================================================

  function handleEditar(professor) {

    setProfessorEmEdicao(professor)

    setForm({

      nome:
        professor.nome,

      telefone:
        professor.telefone || '',

      email:
        professor.email
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

    if (!professorParaExcluir) {
      return
    }


    try {

      const data =
        await excluirProfessor(
          professorParaExcluir.idProfessor
        )


      setProfessores(prev =>
        prev.filter(
          professor =>
            professor.idProfessor !==
            professorParaExcluir.idProfessor
        )
      )


      mostrarToast(
        data.mensagem ||
        data.message ||
        'Professor excluído com sucesso.'
      )

    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível excluir o professor.',
        'erro'
      )
    }


    setProfessorParaExcluir(null)
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
              Professores
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-muted-foreground
              "
            >
              Cadastre e gerencie os professores do sistema.
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
              {professorEmEdicao
                ? 'Editar professor'
                : 'Cadastrar professor'}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {professorEmEdicao
                ? 'Atualize as informações do professor.'
                : 'Preencha as informações para cadastrar um novo professor.'}
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {/* ==================================================
                NOME
            ================================================== */}

            <div
              className="
                flex
                flex-col
                gap-2
                md:col-span-2
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


            {/* ==================================================
                TELEFONE
            ================================================== */}

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


            {/* ==================================================
                E-MAIL
            ================================================== */}

            <div
              className="
                flex
                flex-col
                gap-2
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
                placeholder="Ex.: professor@email.com"
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

              {professorEmEdicao && (

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
                {professorEmEdicao
                  ? 'Atualizar professor'
                  : 'Cadastrar professor'}
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
                Professores cadastrados
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Consulte e gerencie os professores cadastrados.
              </p>

            </div>


            <div
              className="
                text-sm
                text-muted-foreground
              "
            >
              {professoresFiltrados.length}{' '}
              {professoresFiltrados.length === 1
                ? 'cadastro'
                : 'cadastros'}
            </div>

          </div>


          {/* ==================================================
              BUSCA
          ================================================== */}

          <div
            className="
              mb-5
              flex
              justify-end
            "
          >

            <input
              type="text"
              value={busca}
              onChange={
                event =>
                  setBusca(event.target.value)
              }
              placeholder="Buscar por nome ou e-mail"
              className="
                h-11
                w-full
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
                sm:w-80
              "
            />

          </div>


          {/* SEM PROFESSORES */}

          {professores.length === 0 && (

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
                Nenhum professor cadastrado
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-muted-foreground
                "
              >
                Ainda não existem professores cadastrados.
              </p>

            </div>

          )}


          {/* TABELA */}

          {professoresFiltrados.length > 0 && (

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
                    min-w-[800px]
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
                        Telefone
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

                    {professoresFiltrados.map(
                      professor => (

                        <tr
                          key={
                            professor.idProfessor
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
                            {professor.nome}
                          </td>


                          <td
                            className="
                              px-5
                              py-4
                              text-sm
                              text-foreground
                            "
                          >
                            {professor.telefone}
                          </td>


                          <td
                            className="
                              px-5
                              py-4
                              text-sm
                              text-muted-foreground
                            "
                          >
                            {professor.email}
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
                                  handleEditar(
                                    professor
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
                                  setProfessorParaExcluir(
                                    professor
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

                      )
                    )}

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

      {professorParaExcluir && (

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
              Excluir professor
            </h2>


            <p
              className="
                mt-3
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Tem certeza de que deseja excluir o professor{' '}

              <span
                className="
                  font-medium
                  text-foreground
                "
              >
                "{professorParaExcluir.nome}"
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
                  setProfessorParaExcluir(null)
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


export default ProfessoresPage