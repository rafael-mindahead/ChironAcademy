import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

import logo from '../../assets/chiron-logo.png'


function AcessoNegado() {

  return (

    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-background
        px-6
        text-foreground
      "
    >

      <div className="w-full max-w-md text-center">

        <img
          src={logo}
          alt="ChironAcademy"
          className="mx-auto h-24 w-auto"
        />


        <div
          className="
            mx-auto
            mt-8
            flex
            size-16
            items-center
            justify-center
            rounded-full
            bg-destructive/10
            text-destructive
          "
        >

          <ShieldX className="size-8" />

        </div>


        <h1
          className="
            mt-6
            font-[family-name:var(--font-display)]
            text-4xl
          "
        >
          Acesso negado
        </h1>


        <p
          className="
            mt-4
            text-sm
            leading-relaxed
            text-muted-foreground
          "
        >
          Seu perfil não possui permissão para acessar esta área do ChironAcademy.
        </p>


        <Link
          to="/sistema"

          className="
            mt-8
            inline-flex
            rounded-md
            bg-primary
            px-5
            py-3
            text-sm
            font-semibold
            text-primary-foreground
            transition
            hover:opacity-90
          "
        >
          Voltar ao sistema
        </Link>

      </div>

    </div>

  )

}


export default AcessoNegado