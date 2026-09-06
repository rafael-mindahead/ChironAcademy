import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  LogOut,
  UserRound
} from 'lucide-react'

import logo
  from '../../assets/chiron-logo.png'

import {
  obterUsuarioAtual
} from '../../services/authService'


function AreaInterna() {

  const navigate =
    useNavigate()


  const [usuario, setUsuario] =
    useState(null)

  const [carregando, setCarregando] =
    useState(true)


  // ====================================================
  // VALIDAR SESSÃO
  // ====================================================

  useEffect(
    () => {

      async function carregarUsuario() {

        try {

          const resposta =
            await obterUsuarioAtual()


          setUsuario(
            resposta.usuario
          )


          sessionStorage.setItem(
            'chiron_usuario',
            JSON.stringify(
              resposta.usuario
            )
          )


        } catch (error) {

          console.error(
            'Sessão inválida:',
            error
          )


          sessionStorage.removeItem(
            'chiron_token'
          )

          sessionStorage.removeItem(
            'chiron_usuario'
          )


          navigate(
            '/login',
            {
              replace: true
            }
          )


        } finally {

          setCarregando(false)

        }

      }


      carregarUsuario()

    },

    [navigate]
  )


  // ====================================================
  // LOGOUT
  // ====================================================

  function handleLogout() {

    sessionStorage.removeItem(
      'chiron_token'
    )

    sessionStorage.removeItem(
      'chiron_usuario'
    )


    navigate(
      '/login',
      {
        replace: true
      }
    )

  }


  // ====================================================
  // LOADING
  // ====================================================

  if (carregando) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          text-muted-foreground
        "
      >
        Carregando...
      </div>

    )

  }


  if (!usuario) {

    return null

  }


  // ====================================================
  // TELA
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >

      <header
        className="
          border-b
          border-border/60
        "
      >

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

          <img
            src={logo}
            alt="ChironAcademy"
            className="h-10 w-auto"
          />


          <button
            type="button"

            onClick={handleLogout}

            className="
              flex
              items-center
              gap-2
              rounded-md
              border
              border-border
              px-4
              py-2
              text-sm
              font-medium
              text-muted-foreground
              transition
              hover:bg-secondary
              hover:text-foreground
            "
          >

            <LogOut className="size-4" />

            Sair

          </button>

        </div>

      </header>


      <main
        className="
          mx-auto
          w-full
          max-w-6xl
          px-6
          py-12
        "
      >

        <div
          className="
            rounded-xl
            border
            border-border
            bg-card
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                size-12
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-primary
              "
            >

              <UserRound className="size-6" />

            </div>


            <div>

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Usuário autenticado
              </p>


              <h1
                className="
                  mt-1
                  text-2xl
                  font-semibold
                "
              >
                Bem-vindo ao ChironAcademy
              </h1>

            </div>

          </div>


          <div
            className="
              mt-8
              grid
              gap-4
              border-t
              border-border
              pt-6
              md:grid-cols-2
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                E-mail
              </p>


              <p className="mt-2 text-sm">

                {usuario.email}

              </p>

            </div>


            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                Perfil
              </p>


              <p
                className="
                  mt-2
                  text-sm
                  text-primary
                "
              >

                {usuario.perfil}

              </p>

            </div>

          </div>


          <div
            className="
              mt-8
              rounded-lg
              border
              border-border
              bg-background
              p-5
            "
          >

            <p
              className="
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Sua sessão foi validada pelo servidor.
              As funcionalidades acadêmicas serão adicionadas
              conforme os PBIs da Sprint 1.
            </p>

          </div>

        </div>

      </main>

    </div>

  )

}


export default AreaInterna