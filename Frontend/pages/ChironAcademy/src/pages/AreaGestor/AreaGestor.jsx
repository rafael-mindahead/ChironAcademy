import {
  useNavigate
} from 'react-router-dom'

import AreaInterna from '../AreaInterna/AreaInterna.jsx'


function AreaGestor() {

  const navigate =
    useNavigate()


  return (

    <AreaInterna>

      <div>

        <h2
          className="
            text-xl
            font-semibold
            text-foreground
          "
        >
          Gestão acadêmica
        </h2>


        <div
          className="
            mt-6
            grid
            gap-4
            md:grid-cols-2
          "
        >

          {/* ====================================================
              CURSOS
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/cursos')
            }

            className="
              rounded-xl
              border
              border-border
              bg-background
              p-5
              text-left
              transition
              hover:bg-secondary
            "
          >

            <h3
              className="
                font-semibold
                text-foreground
              "
            >
              Cursos
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastrar e gerenciar cursos.
            </p>

          </button>


          {/* ====================================================
              PERÍODOS ACADÊMICOS
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/periodos')
            }

            className="
              rounded-xl
              border
              border-border
              bg-background
              p-5
              text-left
              transition
              hover:bg-secondary
            "
          >

            <h3
              className="
                font-semibold
                text-foreground
              "
            >
              Períodos acadêmicos
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastrar e gerenciar períodos dos cursos.
            </p>

          </button>

        </div>

      </div>

    </AreaInterna>

  )

}


export default AreaGestor