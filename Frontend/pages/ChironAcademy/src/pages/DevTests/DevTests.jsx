import {
  useState
} from 'react'

import {
  FlaskConical,
  Play,
  CircleCheck,
  CircleX,
  CircleMinus,
  LoaderCircle,
  Server,
  Database,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react'

import {
  Link
} from 'react-router-dom'

import {
  executarTestesIntegracao
} from '../../services/devTestService.js'


function DevTests() {

  const [
    executando,
    setExecutando
  ] =
    useState(false)


  const [
    resultados,
    setResultados
  ] =
    useState([])


  const [
    resumo,
    setResumo
  ] =
    useState(null)


  const [
    erroGeral,
    setErroGeral
  ] =
    useState('')


  async function executarTudo() {

    if (executando) {
      return
    }


    setExecutando(true)

    setResultados([])

    setResumo(null)

    setErroGeral('')


    try {

      const resultadoFinal =
        await executarTestesIntegracao(
          novosResultados => {

            setResultados(
              novosResultados
            )

          }
        )


      setResumo(
        resultadoFinal
      )


    } catch (error) {

      setErroGeral(
        error.message ||
        'Não foi possível executar os testes.'
      )


    } finally {

      setExecutando(false)

    }

  }


  const totalPass =
    resultados.filter(
      item =>
        item.status === 'PASS'
    ).length


  const totalFail =
    resultados.filter(
      item =>
        item.status === 'FAIL'
    ).length


  const totalSkip =
    resultados.filter(
      item =>
        item.status === 'SKIP'
    ).length


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
          border-border
          bg-card
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-6xl
            items-center
            justify-between
            px-6
            py-5
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
                size-11
                items-center
                justify-center
                rounded-xl
                border
                border-primary/30
                bg-primary/10
                text-primary
              "
            >

              <FlaskConical
                className="size-5"
              />

            </div>


            <div>

              <h1
                className="
                  font-[family-name:var(--font-display)]
                  text-2xl
                "
              >
                ChironAcademy Test Suite
              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Testes de integração para desenvolvimento.
              </p>

            </div>

          </div>


          <Link
            to="/sistema/gestor"

            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-border
              px-4
              py-2
              text-sm
              transition
              hover:bg-secondary
            "
          >

            <ArrowLeft
              className="size-4"
            />

            Voltar

          </Link>

        </div>

      </header>


      <main
        className="
          mx-auto
          max-w-6xl
          px-6
          py-8
        "
      >

        <div
          className="
            mb-8
            rounded-xl
            border
            border-primary/20
            bg-primary/5
            p-5
          "
        >

          <div
            className="
              flex
              items-start
              gap-3
            "
          >

            <ShieldCheck
              className="
                mt-0.5
                size-5
                shrink-0
                text-primary
              "
            />


            <div>

              <p
                className="
                  font-semibold
                "
              >
                Ambiente de desenvolvimento
              </p>


              <p
                className="
                  mt-1
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
              >
                Esta página cria registros temporários,
                testa as APIs reais e remove os dados
                utilizados ao final da execução.
              </p>

            </div>

          </div>

        </div>


        <div
          className="
            grid
            gap-4
            md:grid-cols-4
          "
        >

          <ResumoCard
            titulo="Executados"
            valor={resultados.length}
            icone={Server}
          />

          <ResumoCard
            titulo="PASS"
            valor={totalPass}
            icone={CircleCheck}
          />

          <ResumoCard
            titulo="FAIL"
            valor={totalFail}
            icone={CircleX}
          />

          <ResumoCard
            titulo="SKIP"
            valor={totalSkip}
            icone={CircleMinus}
          />

        </div>


        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Testes de integração
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Backend, MySQL, JWT, Cursos,
              Períodos, Alunos e integridade.
            </p>

          </div>


          <button
            type="button"

            onClick={
              executarTudo
            }

            disabled={
              executando
            }

            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-primary
              px-5
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
              executando
                ? (
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                  />
                )
                : (
                  <Play
                    className="size-4"
                  />
                )
            }

            {
              executando
                ? 'Executando...'
                : 'Executar todos'
            }

          </button>

        </div>


        {
          erroGeral && (

            <div
              className="
                mt-6
                rounded-lg
                border
                border-destructive/30
                bg-destructive/10
                p-4
                text-sm
                text-destructive
              "
            >

              {erroGeral}

            </div>

          )
        }


        <div
          className="
            mt-6
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-card
          "
        >

          {
            resultados.length === 0
              ? (

                <div
                  className="
                    flex
                    min-h-64
                    flex-col
                    items-center
                    justify-center
                    px-6
                    text-center
                  "
                >

                  <Database
                    className="
                      size-9
                      text-muted-foreground
                    "
                  />


                  <p
                    className="
                      mt-4
                      font-semibold
                    "
                  >
                    Nenhum teste executado
                  </p>


                  <p
                    className="
                      mt-1
                      max-w-md
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Clique em Executar todos para
                    validar a integração atual da branch.
                  </p>

                </div>

              )
              : (

                <div
                  className="
                    divide-y
                    divide-border
                  "
                >

                  {
                    resultados.map(
                      (
                        teste,
                        index
                      ) => (

                        <ResultadoTeste
                          key={
                            `${teste.grupo}-${teste.nome}-${index}`
                          }

                          teste={
                            teste
                          }
                        />

                      )
                    )
                  }

                </div>

              )
          }

        </div>


        {
          resumo && (

            <div
              className="
                mt-6
                rounded-xl
                border
                border-border
                bg-card
                p-6
              "
            >

              <h3
                className="
                  text-lg
                  font-semibold
                "
              >
                Resultado final
              </h3>


              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-6
                  text-sm
                "
              >

                <span>
                  Total:
                  {' '}
                  <strong>
                    {resumo.total}
                  </strong>
                </span>


                <span>
                  PASS:
                  {' '}
                  <strong>
                    {resumo.pass}
                  </strong>
                </span>


                <span>
                  FAIL:
                  {' '}
                  <strong>
                    {resumo.fail}
                  </strong>
                </span>


                <span>
                  SKIP:
                  {' '}
                  <strong>
                    {resumo.skip}
                  </strong>
                </span>

              </div>


              {
                resumo.fail === 0 && (

                  <p
                    className="
                      mt-4
                      text-sm
                      text-primary
                    "
                  >
                    Suite concluída sem falhas.
                  </p>

                )
              }

            </div>

          )
        }

      </main>

    </div>

  )

}


function ResumoCard({
  titulo,
  valor,
  icone: Icone
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-border
        bg-card
        p-5
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {titulo}
          </p>


          <p
            className="
              mt-2
              text-3xl
              font-semibold
            "
          >
            {valor}
          </p>

        </div>


        <Icone
          className="
            size-5
            text-primary
          "
        />

      </div>

    </div>

  )

}


function ResultadoTeste({
  teste
}) {

  let Icone =
    CircleMinus


  let classe =
    'text-muted-foreground'


  if (
    teste.status ===
    'PASS'
  ) {

    Icone =
      CircleCheck

    classe =
      'text-primary'

  }


  if (
    teste.status ===
    'FAIL'
  ) {

    Icone =
      CircleX

    classe =
      'text-destructive'

  }


  return (

    <div
      className="
        flex
        items-start
        gap-4
        p-5
      "
    >

      <Icone
        className={`
          mt-0.5
          size-5
          shrink-0
          ${classe}
        `}
      />


      <div
        className="
          min-w-0
          flex-1
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <span
            className="
              rounded-md
              border
              border-border
              px-2
              py-0.5
              text-xs
              text-muted-foreground
            "
          >
            {teste.grupo}
          </span>


          <p
            className="
              font-medium
            "
          >
            {teste.nome}
          </p>

        </div>


        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          {teste.detalhe}
        </p>

      </div>


      <span
        className="
          shrink-0
          text-xs
          text-muted-foreground
        "
      >
        {teste.duracaoMs} ms
      </span>

    </div>

  )

}


export default DevTests