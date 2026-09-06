import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail
} from 'lucide-react'

import logo from '../../assets/chiron-logo.png'

function RecuperarSenha() {

  const [email, setEmail] = useState('')
  const [chaveRecuperacao, setChaveRecuperacao] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  const [erro, setErro] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    setErro('')

    if (!email.trim()) {
      setErro('Informe o e-mail cadastrado.')
      return
    }

    if (!chaveRecuperacao.trim()) {
      setErro('Informe sua chave de recuperação.')
      return
    }

    if (novaSenha.length < 8) {
      setErro('A nova senha deve possuir pelo menos 8 caracteres.')
      return
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    console.log({
      email,
      chaveRecuperacao,
      novaSenha
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b border-border/60">

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">

          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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

      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">

        <section className="w-full max-w-md">

          <div className="mb-10 text-center">

            <img
              src={logo}
              alt="Logo ChironAcademy"
              className="mx-auto h-28 w-auto object-contain"
            />

            <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Recuperação de acesso
            </p>

            <h1
              className="
                mt-4
                font-[family-name:var(--font-display)]
                text-4xl
                tracking-tight
              "
            >
              Redefinir senha
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Informe seu e-mail e sua chave de recuperação para definir uma nova senha.
            </p>

          </div>

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

              {/* CHAVE DE RECUPERAÇÃO */}
              <div>

                <label
                  htmlFor="chaveRecuperacao"
                  className="mb-2 block text-sm font-medium"
                >
                  Chave de recuperação
                </label>

                <div className="relative">

                  <KeyRound
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
                    id="chaveRecuperacao"
                    type="text"
                    value={chaveRecuperacao}
                    onChange={(event) =>
                      setChaveRecuperacao(event.target.value)
                    }
                    placeholder="CHIRON-XXXX-XXXX-XXXX"
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
                      uppercase
                      tracking-wider
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

              {/* NOVA SENHA */}
              <div>

                <label
                  htmlFor="novaSenha"
                  className="mb-2 block text-sm font-medium"
                >
                  Nova senha
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
                    id="novaSenha"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(event) => setNovaSenha(event.target.value)}
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

              {/* CONFIRMAR NOVA SENHA */}
              <div>

                <label
                  htmlFor="confirmarNovaSenha"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirmar nova senha
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
                    id="confirmarNovaSenha"
                    type={mostrarConfirmacao ? 'text' : 'password'}
                    value={confirmarNovaSenha}
                    onChange={(event) =>
                      setConfirmarNovaSenha(event.target.value)
                    }
                    placeholder="Digite novamente sua nova senha"
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

              {/* BOTÃO */}
              <button
                type="submit"
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
                "
              >
                Redefinir senha
              </button>

            </form>

          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Após a recuperação, uma nova chave será gerada.
          </p>

        </section>

      </main>

    </div>
  )
}

export default RecuperarSenha