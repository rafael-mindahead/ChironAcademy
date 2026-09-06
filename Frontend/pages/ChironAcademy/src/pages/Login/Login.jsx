import { useState } from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail
} from 'lucide-react'

import logo from '../../assets/chiron-logo.png'

import {
  loginUsuario
} from '../../services/authService'


function Login() {

  const navigate = useNavigate()


  // ====================================================
  // ESTADOS DO FORMULÁRIO
  // ====================================================

  const [email, setEmail] =
    useState('')

  const [senha, setSenha] =
    useState('')

  const [mostrarSenha, setMostrarSenha] =
    useState(false)


  // ====================================================
  // ESTADOS DA INTERFACE
  // ====================================================

  const [erro, setErro] =
    useState('')

  const [carregando, setCarregando] =
    useState(false)


  // ====================================================
  // LOGIN
  // ====================================================

  async function handleSubmit(event) {

    event.preventDefault()

    setErro('')


    if (!email.trim()) {

      setErro(
        'Informe seu e-mail.'
      )

      return
    }


    if (!senha) {

      setErro(
        'Informe sua senha.'
      )

      return
    }


    try {

      setCarregando(true)


      const resposta =
        await loginUsuario(
          email,
          senha
        )


      // ================================================
      // SALVAR DADOS DA SESSÃO
      // ================================================

      sessionStorage.setItem(
        'chiron_token',
        resposta.token
      )


      sessionStorage.setItem(
        'chiron_usuario',
        JSON.stringify(
          resposta.usuario
        )
      )


      console.log(
        'Usuário autenticado:',
        resposta.usuario
      )


      // ================================================
      // REDIRECIONAMENTO TEMPORÁRIO
      // ================================================

      navigate('/sistema')


    } catch (error) {

      setErro(
        error.message
      )

    } finally {

      setCarregando(false)

    }

  }


  return (

    <div className="min-h-screen bg-background text-foreground">

      {/* =================================================
          HEADER
      ================================================== */}

      <header className="border-b border-border/60">

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-6xl
            items-center
            justify-between
            px-6
            py-5
          "
        >

          <Link
            to="/"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
          >

            <ArrowLeft className="size-4" />

            Voltar

          </Link>


          <img
            src={logo}
            alt="ChironAcademy"
            className="h-10 w-auto"
          />

        </div>

      </header>


      {/* =================================================
          CONTEÚDO
      ================================================== */}

      <main
        className="
          flex
          min-h-[calc(100vh-81px)]
          items-center
          justify-center
          px-6
          py-12
        "
      >

        <section className="w-full max-w-md">


          {/* ===============================================
              TÍTULO
          ================================================ */}

          <div className="mb-10 text-center">

            <img
              src={logo}
              alt="Logo ChironAcademy"
              className="
                mx-auto
                h-28
                w-auto
                object-contain
              "
            />


            <p
              className="
                mt-8
                text-xs
                font-medium
                uppercase
                tracking-[0.2em]
                text-primary
              "
            >
              Acesso ao sistema
            </p>


            <h1
              className="
                mt-4
                font-[family-name:var(--font-display)]
                text-4xl
                tracking-tight
              "
            >
              Bem-vindo de volta
            </h1>


            <p
              className="
                mt-3
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Entre com suas credenciais para acessar o ChironAcademy.
            </p>

          </div>


          {/* ===============================================
              CARD
          ================================================ */}

          <div
            className="
              rounded-xl
              border
              border-border
              bg-card
              p-6
              shadow-2xl
              md:p-8
            "
          >

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >


              {/* ===========================================
                  EMAIL
              ============================================ */}

              <div>

                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                  "
                >
                  E-mail
                </label>


                <div className="relative">

                  <Mail
                    className="
                      absolute
                      left-3
                      top-1/2
                      size-4
                      -translate-y-1/2
                      text-muted-foreground
                    "
                  />


                  <input
                    id="email"
                    type="email"

                    value={email}

                    onChange={
                      (event) =>
                        setEmail(
                          event.target.value
                        )
                    }

                    placeholder="seuemail@instituicao.com"

                    autoComplete="email"

                    required

                    className="
                      w-full
                      rounded-md
                      border
                      border-input
                      bg-background
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-foreground
                      outline-none
                      transition
                      placeholder:text-muted-foreground
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                    "
                  />

                </div>

              </div>


              {/* ===========================================
                  SENHA
              ============================================ */}

              <div>

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <label
                    htmlFor="senha"
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    Senha
                  </label>


                  <Link
                    to="/esqueci-senha"
                    className="
                      text-xs
                      font-medium
                      text-primary
                      transition
                      hover:opacity-80
                    "
                  >
                    Esqueceu sua senha?
                  </Link>

                </div>


                <div className="relative">

                  <LockKeyhole
                    className="
                      absolute
                      left-3
                      top-1/2
                      size-4
                      -translate-y-1/2
                      text-muted-foreground
                    "
                  />


                  <input
                    id="senha"

                    type={
                      mostrarSenha
                        ? 'text'
                        : 'password'
                    }

                    value={senha}

                    onChange={
                      (event) =>
                        setSenha(
                          event.target.value
                        )
                    }

                    placeholder="Digite sua senha"

                    autoComplete="current-password"

                    required

                    className="
                      w-full
                      rounded-md
                      border
                      border-input
                      bg-background
                      py-3
                      pl-10
                      pr-11
                      text-sm
                      text-foreground
                      outline-none
                      transition
                      placeholder:text-muted-foreground
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                    "
                  />


                  <button
                    type="button"

                    onClick={
                      () =>
                        setMostrarSenha(
                          !mostrarSenha
                        )
                    }

                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      transition-colors
                      hover:text-foreground
                    "

                    aria-label={
                      mostrarSenha
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                  >

                    {
                      mostrarSenha
                        ? (
                          <EyeOff className="size-4" />
                        )
                        : (
                          <Eye className="size-4" />
                        )
                    }

                  </button>

                </div>

              </div>


              {/* ===========================================
                  ERRO
              ============================================ */}

              {
                erro && (

                  <div
                    className="
                      rounded-md
                      border
                      border-destructive/30
                      bg-destructive/10
                      px-4
                      py-3
                      text-sm
                      text-destructive
                    "
                  >
                    {erro}
                  </div>

                )
              }


              {/* ===========================================
                  BOTÃO ENTRAR
              ============================================ */}

              <button
                type="submit"

                disabled={carregando}

                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  bg-primary
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-primary-foreground
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {
                  carregando
                    ? 'Entrando...'
                    : 'Entrar'
                }

              </button>

            </form>


            {/* ===============================================
                DIVISOR
            ================================================ */}

            <div
              className="
                my-7
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-px
                  flex-1
                  bg-border
                "
              />


              <span
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                ou
              </span>


              <div
                className="
                  h-px
                  flex-1
                  bg-border
                "
              />

            </div>


            {/* ===============================================
                CADASTRO
            ================================================ */}

            <div className="text-center">

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Ainda não possui uma conta?
              </p>


              <Link
                to="/cadastro"

                className="
                  mt-3
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-border
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-foreground
                  transition
                  hover:border-primary/50
                  hover:bg-secondary
                "
              >
                Criar conta
              </Link>

            </div>

          </div>


          {/* ===============================================
              FOOTER
          ================================================ */}

          <p
            className="
              mt-6
              text-center
              text-xs
              text-muted-foreground
            "
          >
            ChironAcademy — sistema de gestão acadêmica.
          </p>

        </section>

      </main>

    </div>

  )

}


export default Login