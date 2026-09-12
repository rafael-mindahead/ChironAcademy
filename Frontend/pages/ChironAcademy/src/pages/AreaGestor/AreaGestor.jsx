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
            lg:grid-cols-3
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


          {/* ====================================================
              ALUNOS
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/alunos')
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
              Alunos
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastrar e gerenciar alunos.
            </p>

          </button>


          {/* ====================================================
              PROFESSORES
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/professores')
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
              Professores
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastrar e gerenciar professores.
            </p>

          </button>


          {/* ====================================================
              DISCIPLINAS
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/disciplinas')
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
              Disciplinas
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastrar e gerenciar as disciplinas atreladas aos cursos.
            </p>

          </button>


          {/* ====================================================
              TURMAS
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/turmas')
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
              Turmas
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Cadastrar e gerenciar turmas.
            </p>

          </button>


          {/* ====================================================
              VÍNCULOS
          ==================================================== */}

          <button
            type="button"

            onClick={() =>
              navigate('/sistema/gestor/vinculos')
            }

            className="
              rounded-xl
              border-2
              border-primary
              bg-primary/5
              p-5
              text-left
              shadow-sm
              transition
              hover:bg-primary/10
            "
          >

            <h3
              className="
                font-semibold
                text-foreground
              "
            >
              Vínculos
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Vincular professores, turmas e disciplinas.
            </p>

          </button>

        </div>

      </div>

    </AreaInterna>

  )

}


export default AreaGestor
