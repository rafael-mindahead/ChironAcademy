import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  cadastrarCurso,
  listarCursos,
  atualizarCurso,
  excluirCurso
} from '../../services/gestorServices/cursoFormService'


const MODALIDADES = [
  'Presencial',
  'EAD',
  'Híbrido'
]


const formInicial = {
  nomeCurso: '',
  modalidade: 'Presencial',
  duracaoSemestres: ''
}


function converterModalidadeParaAPI(modalidade) {

  const modalidades = {
    Presencial: 'PRESENCIAL',
    EAD: 'EAD',
    Híbrido: 'HIBRIDO'
  }

  return modalidades[modalidade]

}


function converterModalidadeParaTela(modalidade) {

  const modalidades = {
    PRESENCIAL: 'Presencial',
    EAD: 'EAD',
    HIBRIDO: 'Híbrido'
  }

  return modalidades[modalidade] || modalidade

}


function CursosPage() {

  const navigate =
    useNavigate()


  // ======================================================
  // ESTADOS
  // ======================================================

  const [form, setForm] =
    useState(formInicial)

  const [cursos, setCursos] =
    useState([])

  const [cursoEmEdicao, setCursoEmEdicao] =
    useState(null)

  const [cursoParaExcluir, setCursoParaExcluir] =
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
  // CARREGAR CURSOS
  // ======================================================

  useEffect(() => {

    async function carregarCursos() {

      try {

        const dados =
          await listarCursos()


        setCursos(dados)

      } catch (error) {

        mostrarToast(
          error.message ||
          'Não foi possível carregar os cursos.',
          'erro'
        )

      }

    }


    carregarCursos()

  }, [])


  // ======================================================
  // ALTERAR FORMULÁRIO
  // ======================================================

  function handleChange(evento) {

    const {
      name,
      value
    } = evento.target


    setForm(prev => ({
      ...prev,
      [name]: value
    }))

  }


  // ======================================================
  // REDEFINIR FORMULÁRIO
  // ======================================================

  function redefinirFormulario() {

    setForm(formInicial)

    setCursoEmEdicao(null)

  }


  // ======================================================
  // CADASTRAR / ATUALIZAR
  // ======================================================

  async function handleSubmit(evento) {

    evento.preventDefault()


    const nome =
      form.nomeCurso.trim()


    if (!nome) {

      mostrarToast(
        'O nome do curso é obrigatório.',
        'erro'
      )

      return

    }


    if (!/[A-Za-zÀ-ÿ]/.test(nome)) {

      mostrarToast(
        'O nome do curso deve conter pelo menos uma letra.',
        'erro'
      )

      return

    }


    if (
      !form.duracaoSemestres ||
      Number(form.duracaoSemestres) < 1
    ) {

      mostrarToast(
        'Informe uma duração válida.',
        'erro'
      )

      return

    }


    try {

      const modalidadeAPI =
        converterModalidadeParaAPI(
          form.modalidade
        )


      // ==================================================
      // ATUALIZAR
      // ==================================================

      if (cursoEmEdicao) {

        const resposta =
          await atualizarCurso(
            cursoEmEdicao.idCurso,
            nome,
            modalidadeAPI,
            form.duracaoSemestres
          )


        setCursos(
          cursos.map((curso) =>
            curso.idCurso ===
            cursoEmEdicao.idCurso
              ? resposta.curso
              : curso
          )
        )


        setCursoEmEdicao(null)


        mostrarToast(
          resposta.message ||
          'Curso atualizado com sucesso.'
        )

      }


      // ==================================================
      // CADASTRAR
      // ==================================================

      else {

        const resposta =
          await cadastrarCurso(
            nome,
            modalidadeAPI,
            form.duracaoSemestres
          )


        setCursos([
          ...cursos,
          resposta.curso
        ])


        mostrarToast(
          resposta.message ||
          'Curso cadastrado com sucesso.'
        )

      }


      setForm(formInicial)


    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível salvar o curso.',
        'erro'
      )

    }

  }


  // ======================================================
  // EDITAR
  // ======================================================

  function handleEditar(curso) {

    setCursoEmEdicao(curso)


    setForm({

      nomeCurso:
        curso.nomeCurso,

      modalidade:
        converterModalidadeParaTela(
          curso.modalidade
        ),

      duracaoSemestres:
        curso.duracaoSemestres

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

    if (!cursoParaExcluir) {
      return
    }


    try {

      await excluirCurso(
        cursoParaExcluir.idCurso
      )


      setCursos(
        cursos.filter(
          (curso) =>
            curso.idCurso !==
            cursoParaExcluir.idCurso
        )
      )


      setCursoParaExcluir(null)


      mostrarToast(
        'Curso excluído com sucesso.'
      )


    } catch (error) {

      mostrarToast(
        error.message ||
        'Não foi possível excluir o curso.',
        'erro'
      )

    }

  }


  // ======================================================
  // INTERFACE
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

              Cursos

            </h1>


            <p className="
              mt-2
              text-sm
              text-muted-foreground
            ">

              Gerencie os cursos cadastrados no sistema.

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

        <form
          onSubmit={handleSubmit}

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

          <div className="
            mb-6
          ">

            <h2 className="
              text-lg
              font-semibold
              text-card-foreground
            ">

              {cursoEmEdicao
                ? 'Editar curso'
                : 'Cadastrar curso'
              }

            </h2>


            <p className="
              mt-1
              text-sm
              text-muted-foreground
            ">

              {cursoEmEdicao
                ? 'Atualize as informações do curso.'
                : 'Preencha os dados para cadastrar um novo curso.'
              }

            </p>

          </div>


          <div className="
            grid
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          ">


            {/* ==================================================
                NOME
            ================================================== */}

            <div className="
              flex
              flex-col
              gap-2
              md:col-span-2
              lg:col-span-1
            ">

              <label
                htmlFor="nomeCurso"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Nome do curso

              </label>


              <input
                id="nomeCurso"
                name="nomeCurso"
                type="text"

                value={
                  form.nomeCurso
                }

                onChange={
                  handleChange
                }

                placeholder="Ex.: Engenharia de Software"

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
                MODALIDADE
            ================================================== */}

            <div className="
              flex
              flex-col
              gap-2
            ">

              <label
                htmlFor="modalidade"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Modalidade

              </label>


              <select
                id="modalidade"
                name="modalidade"

                value={
                  form.modalidade
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

                {MODALIDADES.map(
                  (modalidade) => (

                    <option
                      key={modalidade}
                      value={modalidade}
                    >

                      {modalidade}

                    </option>

                  )
                )}

              </select>

            </div>


            {/* ==================================================
                DURAÇÃO
            ================================================== */}

            <div className="
              flex
              flex-col
              gap-2
            ">

              <label
                htmlFor="duracaoSemestres"
                className="
                  text-sm
                  font-medium
                  text-foreground
                "
              >

                Duração (semestres)

              </label>


              <input
                id="duracaoSemestres"
                name="duracaoSemestres"
                type="number"

                min="1"
                max="20"

                value={
                  form.duracaoSemestres
                }

                onChange={
                  handleChange
                }

                placeholder="Ex.: 8"

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

          </div>


          {/* ==================================================
              BOTÕES
          ================================================== */}

          <div className="
            mt-7
            flex
            justify-end
            gap-3
          ">

            <button
              type="button"

              onClick={
                redefinirFormulario
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

              Redefinir

            </button>


            {cursoEmEdicao && (

              <button
                type="button"

                onClick={
                  redefinirFormulario
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

            )}


            <button
              type="submit"

              className="
                h-10
                rounded-lg
                bg-primary
                px-6
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition
                hover:opacity-90
                active:scale-[0.98]
              "
            >

              {cursoEmEdicao
                ? 'Atualizar curso'
                : 'Salvar curso'
              }

            </button>

          </div>

        </form>


        {/* ==================================================
            LISTA DE CURSOS
        ================================================== */}

        <div>

          <div className="
            mb-4
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

                Cursos cadastrados

              </h2>


              <p className="
                mt-1
                text-sm
                text-muted-foreground
              ">

                Consulte e gerencie os cursos cadastrados no sistema.

              </p>

            </div>


            <div className="
              text-sm
              text-muted-foreground
            ">

              {cursos.length}{' '}

              {cursos.length === 1
                ? 'curso cadastrado'
                : 'cursos cadastrados'
              }

            </div>

          </div>


          {/* ==================================================
              TABELA
          ================================================== */}

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
                text-sm
              ">

                <thead>

                  <tr className="
                    border-b
                    border-border
                    bg-secondary/30
                  ">

                    <th className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-muted-foreground
                    ">

                      Nome

                    </th>


                    <th className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-muted-foreground
                    ">

                      Modalidade

                    </th>


                    <th className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-muted-foreground
                    ">

                      Duração

                    </th>


                    <th className="
                      px-6
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-muted-foreground
                    ">

                      Ações

                    </th>

                  </tr>

                </thead>


                <tbody>

                  {cursos.length === 0 && (

                    <tr>

                      <td
                        colSpan={4}

                        className="
                          px-6
                          py-12
                          text-center
                          text-muted-foreground
                        "
                      >

                        <div className="
                          flex
                          flex-col
                          items-center
                          gap-2
                        ">

                          <span className="
                            text-base
                            font-medium
                            text-foreground
                          ">

                            Nenhum curso cadastrado

                          </span>


                          <span className="
                            text-sm
                          ">

                            Cadastre o primeiro curso usando o formulário acima.

                          </span>

                        </div>

                      </td>

                    </tr>

                  )}


                  {cursos.map((curso) => (

                    <tr
                      key={
                        curso.idCurso
                      }

                      className="
                        border-b
                        border-border/60
                        last:border-0
                        transition
                        hover:bg-secondary/20
                      "
                    >

                      <td className="
                        px-6
                        py-4
                        font-medium
                        text-foreground
                      ">

                        {curso.nomeCurso}

                      </td>


                      <td className="
                        px-6
                        py-4
                      ">

                        <span className="
                          inline-flex
                          items-center
                          rounded-full
                          border
                          border-border
                          bg-secondary/50
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-foreground
                        ">

                          {converterModalidadeParaTela(
                            curso.modalidade
                          )}

                        </span>

                      </td>


                      <td className="
                        px-6
                        py-4
                        text-muted-foreground
                      ">

                        {curso.duracaoSemestres}{' '}

                        {curso.duracaoSemestres === 1
                          ? 'semestre'
                          : 'semestres'
                        }

                      </td>


                      <td className="
                        px-6
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
                              handleEditar(curso)
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
                              setCursoParaExcluir(
                                curso
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

        </div>

      </div>


      {/* ==================================================
          MODAL DE EXCLUSÃO
      ================================================== */}

      {cursoParaExcluir && (

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

              Excluir curso

            </h2>


            <p className="
              mt-3
              text-sm
              leading-6
              text-muted-foreground
            ">

              Tem certeza de que deseja excluir o curso{' '}

              <span className="
                font-medium
                text-foreground
              ">

                "{cursoParaExcluir.nomeCurso}"

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
                  setCursoParaExcluir(null)
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


      {/* ==================================================
          TOAST
      ================================================== */}

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


export default CursosPage