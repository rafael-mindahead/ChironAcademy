import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cadastrarUsuario } from '../../services/authService'
import {
    ArrowLeft,
    Check,
    Copy,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    Mail
} from 'lucide-react'

import logo from '../../assets/chiron-logo.png'

function Cadastro() {

    const [carregando, setCarregando] = useState(false)

    const [chaveRecuperacao, setChaveRecuperacao] =
    useState(null)

    const [copiado, setCopiado] =
    useState(false)

    const [confirmouChave, setConfirmouChave] =
    useState(false)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  const [erro, setErro] = useState('')

  async function handleSubmit(event) {



    event.preventDefault()

    setErro('')

    if (senha !== confirmarSenha) {

        setErro('As senhas não coincidem.')

        return
    }


    if (senha.length < 8) {

        setErro(
        'A senha deve possuir pelo menos 8 caracteres.'
        )

        return
    }


    try {

        setCarregando(true)


        const resposta =
        await cadastrarUsuario(
            email,
            senha
        )


        setChaveRecuperacao(
        resposta.recoveryKey
        )
    } catch (error) {


        setErro(error.message)


    } finally {


        setCarregando(false)
    }
}
async function copiarChave() {

  try {

    await navigator.clipboard.writeText(
      chaveRecuperacao
    )

    setCopiado(true)


    setTimeout(() => {
      setCopiado(false)
    }, 2000)


  } catch {

    setErro(
      'Não foi possível copiar a chave automaticamente.'
    )

  }
}
if (chaveRecuperacao) {

  return (
    <div className="min-h-screen bg-background text-foreground">

      <main className="flex min-h-screen items-center justify-center px-6 py-12">

        <section className="w-full max-w-lg">

          <div className="mb-10 text-center">

            <img
              src={logo}
              alt="ChironAcademy"
              className="mx-auto h-28 w-auto object-contain"
            />

            <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Conta criada
            </p>

            <h1
              className="
                mt-4
                font-[family-name:var(--font-display)]
                text-4xl
                tracking-tight
              "
            >
              Guarde sua chave
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Esta chave será necessária caso você esqueça sua senha.
            </p>

          </div>


          <div className="rounded-xl border border-border bg-card p-6 shadow-2xl md:p-8">

            <div
              className="
                rounded-lg
                border
                border-primary/30
                bg-primary/5
                p-5
              "
            >

              <div className="mb-4 flex items-center gap-2">

                <KeyRound className="size-5 text-primary" />

                <span className="text-sm font-semibold">
                  Sua chave de recuperação
                </span>

              </div>


              <div
                className="
                  break-all
                  rounded-md
                  border
                  border-border
                  bg-background
                  p-4
                  text-center
                  font-mono
                  text-sm
                  tracking-wider
                  text-primary
                "
              >
                {chaveRecuperacao}
              </div>


              <button
                type="button"
                onClick={copiarChave}
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-border
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-secondary
                "
              >

                {
                  copiado
                    ? (
                      <>
                        <Check className="size-4" />
                        Copiado
                      </>
                    )
                    : (
                      <>
                        <Copy className="size-4" />
                        Copiar chave
                      </>
                    )
                }

              </button>

            </div>


            <label className="mt-6 flex cursor-pointer items-start gap-3">

              <input
                type="checkbox"
                checked={confirmouChave}
                onChange={(event) =>
                  setConfirmouChave(
                    event.target.checked
                  )
                }
                className="mt-1"
              />

              <span className="text-sm text-muted-foreground">
                Confirmo que salvei minha chave de recuperação em um local seguro.
              </span>

            </label>


            <Link
              to="/login"
              className={`
                mt-6
                flex
                w-full
                items-center
                justify-center
                rounded-md
                px-4
                py-3
                text-sm
                font-semibold
                transition

                ${
                  confirmouChave
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'pointer-events-none bg-secondary text-muted-foreground opacity-50'
                }
              `}
            >
              Continuar para login
            </Link>

          </div>

        </section>

      </main>

    </div>
  )
}

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* HEADER */}
      <header className="border-b border-border/60">

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">

          <Link
            to="/login"
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

      {/* CONTEÚDO */}
      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">

        <section className="w-full max-w-md">

          {/* CABEÇALHO */}
          <div className="mb-10 text-center">

            <img
              src={logo}
              alt="Logo ChironAcademy"
              className="mx-auto h-28 w-auto object-contain"
            />

            <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Criar conta
            </p>

            <h1
              className="
                mt-4
                font-[family-name:var(--font-display)]
                text-4xl
                tracking-tight
              "
            >
              Acesse o ChironAcademy
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Cadastre suas credenciais para acessar sua conta acadêmica.
            </p>

          </div>

          {/* CARD */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-2xl md:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* EMAIL */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
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
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seuemail@instituicao.com"
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

              {/* SENHA */}
              <div>

                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-medium"
                >
                  Senha
                </label>

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
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Mínimo de 8 caracteres"
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
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-muted-foreground
                      transition-colors
                      hover:text-foreground
                    "
                  >

                    {
                      mostrarSenha
                        ? <EyeOff className="size-4" />
                        : <Eye className="size-4" />
                    }

                  </button>

                </div>

              </div>

              {/* CONFIRMAR SENHA */}
              <div>

                <label
                  htmlFor="confirmarSenha"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirmar senha
                </label>

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
                    id="confirmarSenha"
                    type={mostrarConfirmacao ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(event) =>
                      setConfirmarSenha(event.target.value)
                    }
                    placeholder="Digite novamente sua senha"
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
                    onClick={() =>
                      setMostrarConfirmacao(!mostrarConfirmacao)
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
                  >

                    {
                      mostrarConfirmacao
                        ? <EyeOff className="size-4" />
                        : <Eye className="size-4" />
                    }

                  </button>

                </div>

              </div>

              {/* ERRO */}
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

              {/* INFORMAÇÃO SOBRE RECUPERAÇÃO */}
              <div
                className="
                  flex
                  gap-3
                  rounded-lg
                  border
                  border-primary/20
                  bg-primary/5
                  p-4
                "
              >

                <KeyRound
                  className="
                    mt-0.5
                    size-5
                    shrink-0
                    text-primary
                  "
                />

                <div>

                  <p className="text-sm font-medium">
                    Chave de recuperação
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Após o cadastro, o sistema irá gerar uma chave de
                    recuperação única. Guarde-a em um local seguro.
                  </p>

                </div>

              </div>

              {/* CADASTRAR */}
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
            {carregando ? 'Criando conta...' : 'Criar conta'}
                </button>

            </form>

            <div className="mt-7 border-t border-border pt-6 text-center">

              <p className="text-sm text-muted-foreground">
                Já possui uma conta?
              </p>

              <Link
                to="/login"
                className="
                  mt-2
                  inline-block
                  text-sm
                  font-medium
                  text-primary
                  transition
                  hover:opacity-80
                "
              >
                Entrar no ChironAcademy
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Cadastro