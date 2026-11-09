import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp
} from 'lucide-react'

import {
  useNavigate
} from 'react-router-dom'

import AreaInterna
  from '../AreaInterna/AreaInterna.jsx'

import {
  consultarAnaliseRendimento
} from '../../services/gestorServices/analiseRendimentoService.js'


const nomesClassificacao = {
  ALTO:
    'Alto rendimento',

  BAIXO:
    'Baixo rendimento',

  DADOS_INSUFICIENTES:
    'Dados insuficientes'
}


function formatarNota(
  valor
) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return '—'

  }


  return Number(
    valor
  ).toLocaleString(
    'pt-BR',
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }
  )

}


function formatarPercentual(
  valor
) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return '—'

  }


  return `${Number(
    valor
  ).toLocaleString(
    'pt-BR',
    {
      maximumFractionDigits: 1
    }
  )}%`

}


function AnaliseRendimentoGestor() {

  const navigate =
    useNavigate()


  const [
    dados,
    setDados
  ] =
    useState(null)


  const [
    aba,
    setAba
  ] =
    useState('comparar')


  const [
    tipoComparacao,
    setTipoComparacao
  ] =
    useState('cursos')


  const [
    numeroPeriodo,
    setNumeroPeriodo
  ] =
    useState('')


  const [
    selecionados,
    setSelecionados
  ] =
    useState([])


  const [
    cursoAberto,
    setCursoAberto
  ] =
    useState(null)


  const [
    carregando,
    setCarregando
  ] =
    useState(true)


  const [
    erro,
    setErro
  ] =
    useState('')


  const [
    tentativa,
    setTentativa
  ] =
    useState(0)


  useEffect(
    () => {

      let ativo = true


      async function carregar() {

        try {

          setCarregando(true)
          setErro('')


          const resposta =
            await consultarAnaliseRendimento(
              numeroPeriodo ||
              null
            )


          if (!ativo) {
            return
          }


          setDados(
            resposta
          )

          setSelecionados([])

        } catch (error) {

          if (!ativo) {
            return
          }


          setErro(
            error.message ||
            'Não foi possível carregar a análise.'
          )

        } finally {

          if (ativo) {
            setCarregando(false)
          }

        }

      }


      carregar()


      return () => {
        ativo = false
      }

    },
    [
      numeroPeriodo,
      tentativa
    ]
  )


  const itensComparacao =
    useMemo(
      () => {

        if (!dados) {
          return []
        }


        if (
          tipoComparacao ===
          'disciplinas'
        ) {

          return (
            dados.comparacao
              ?.disciplinas ||
            []
          ).map(
            item => ({
              ...item,
              chave:
                `disciplina-${item.idCurso}-${item.codDisciplina}`,
              nome:
                item.nomeDisciplina,
              contexto:
                item.nomeCurso
            })
          )

        }


        return (
          dados.comparacao
            ?.cursos ||
          []
        ).map(
          item => ({
            ...item,
            chave:
              `curso-${item.idCurso}`,
            nome:
              item.nomeCurso,
            contexto:
              'Curso'
          })
        )

      },
      [
        dados,
        tipoComparacao
      ]
    )


  const itensSelecionados =
    itensComparacao.filter(
      item =>
        selecionados.includes(
          item.chave
        )
    )


  function alternarSelecionado(
    chave
  ) {

    setSelecionados(
      atual =>
        atual.includes(
          chave
        )
          ? atual.filter(
              item =>
                item !== chave
            )
          : [
              ...atual,
              chave
            ]
    )

  }


  return (

    <AreaInterna
      mostrarResumoUsuario={false}
    >

      <div
        className="
          space-y-8
        "
      >

        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <button
            type="button"
            onClick={() =>
              navigate(
                '/sistema/gestor'
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-muted-foreground
              transition
              hover:text-foreground
            "
          >
            <ArrowLeft
              className="size-4"
            />

            Gestão acadêmica
          </button>


          <div
            className="
              mt-7
              flex
              items-start
              gap-4
            "
          >

            <span
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <BarChart3
                className="size-6"
              />
            </span>


            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-primary
                "
              >
                Visão institucional
              </p>

              <h1
                className="
                  mt-2
                  font-[family-name:var(--font-display)]
                  text-3xl
                  font-semibold
                  tracking-tight
                  sm:text-4xl
                "
              >
                Análise de rendimento
              </h1>

              <p
                className="
                  mt-3
                  max-w-3xl
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
              >
                Compare indicadores equivalentes de cursos e disciplinas ou mapeie o rendimento usando matrículas concluídas.
              </p>

            </div>

          </div>


          {
            dados?.criterios && (

              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-border
                  bg-background/60
                  px-4
                  py-3
                  text-xs
                  text-muted-foreground
                "
              >
                Critério institucional:
                {' '}
                nota mínima
                {' '}
                <strong className="text-foreground">
                  {dados.criterios.notaMinima}
                </strong>
                {' '}
                e frequência mínima
                {' '}
                <strong className="text-foreground">
                  {dados.criterios.frequenciaMinima}%
                </strong>
                .
                {' '}
                Base:
                {' '}
                {dados.criterios.base}.
              </div>

            )
          }

        </section>


        <section
          className="
            flex
            flex-wrap
            gap-3
          "
        >

          <button
            type="button"
            onClick={() =>
              setAba(
                'comparar'
              )
            }
            className={
              aba === 'comparar'
                ? 'botao-principal'
                : 'botao-secundario'
            }
          >
            Comparar cursos e disciplinas
          </button>

          <button
            type="button"
            onClick={() =>
              setAba(
                'mapear'
              )
            }
            className={
              aba === 'mapear'
                ? 'botao-principal'
                : 'botao-secundario'
            }
          >
            Mapear rendimento dos cursos
          </button>

        </section>


        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            shadow-sm
            sm:p-7
          "
        >

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            {
              aba === 'comparar' && (

                <label>

                  <span
                    className="
                      mb-2
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-muted-foreground
                    "
                  >
                    Comparar
                  </span>

                  <select
                    className="campo"
                    value={tipoComparacao}
                    onChange={
                      event => {
                        setTipoComparacao(
                          event.target.value
                        )
                        setSelecionados([])
                      }
                    }
                  >
                    <option value="cursos">
                      Cursos
                    </option>

                    <option value="disciplinas">
                      Disciplinas
                    </option>
                  </select>

                </label>

              )
            }


            <label>

              <span
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                Período curricular comum
              </span>

              <select
                className="campo"
                value={numeroPeriodo}
                onChange={
                  event =>
                    setNumeroPeriodo(
                      event.target.value
                    )
                }
              >
                <option value="">
                  Todos os períodos
                </option>

                {
                  (
                    dados?.periodos ||
                    []
                  ).map(
                    periodo => (

                      <option
                        key={periodo}
                        value={periodo}
                      >
                        {periodo}º período
                      </option>

                    )
                  )
                }
              </select>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                "
              >
                O mesmo número de período é aplicado a todos os itens.
              </p>

            </label>

          </div>

        </section>


        {
          carregando
            ? (

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    py-16
                    text-sm
                    text-muted-foreground
                  "
                >
                  <LoaderCircle
                    className="
                      size-5
                      animate-spin
                    "
                  />

                  Carregando análise...
                </div>

              )
            : erro
              ? (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-destructive/40
                      bg-destructive/10
                      p-6
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <CircleAlert
                        className="
                          mt-0.5
                          size-5
                          text-destructive
                        "
                      />

                      <p className="text-sm">
                        {erro}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="
                        botao-secundario
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                      "
                      onClick={() =>
                        setTentativa(
                          atual =>
                            atual + 1
                        )
                      }
                    >
                      <RefreshCw
                        className="size-4"
                      />

                      Tentar novamente
                    </button>

                  </div>

                )
              : aba === 'comparar'
                ? (

                    <Comparacao
                      itens={itensComparacao}
                      selecionados={selecionados}
                      itensSelecionados={itensSelecionados}
                      alternarSelecionado={alternarSelecionado}
                    />

                  )
                : (

                    <Mapeamento
                      cursos={
                        dados?.mapeamento ||
                        []
                      }
                      cursoAberto={cursoAberto}
                      setCursoAberto={setCursoAberto}
                    />

                  )
        }

      </div>

    </AreaInterna>

  )

}


function Comparacao({
  itens,
  selecionados,
  itensSelecionados,
  alternarSelecionado
}) {

  return (

    <div className="space-y-6">

      <section
        className="
          rounded-2xl
          border
          border-border
          bg-card
          p-5
          shadow-sm
          sm:p-7
        "
      >

        <h2
          className="
            text-lg
            font-semibold
          "
        >
          Itens para comparação
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          Selecione pelo menos dois itens. Os mesmos indicadores serão mostrados lado a lado.
        </p>


        {
          itens.length === 0
            ? (

                <p
                  className="
                    mt-6
                    rounded-xl
                    border
                    border-dashed
                    border-border
                    p-6
                    text-sm
                    text-muted-foreground
                  "
                >
                  Não há dados concluídos para este filtro.
                </p>

              )
            : (

                <div
                  className="
                    mt-5
                    grid
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >

                  {
                    itens.map(
                      item => (

                        <label
                          key={item.chave}
                          className="
                            flex
                            cursor-pointer
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-border
                            bg-background/50
                            p-4
                            transition
                            hover:border-primary/40
                          "
                        >

                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={
                              selecionados.includes(
                                item.chave
                              )
                            }
                            onChange={() =>
                              alternarSelecionado(
                                item.chave
                              )
                            }
                          />

                          <span>

                            <span
                              className="
                                block
                                font-medium
                              "
                            >
                              {item.nome}
                            </span>

                            <span
                              className="
                                mt-1
                                block
                                text-xs
                                text-muted-foreground
                              "
                            >
                              {item.contexto}
                            </span>

                          </span>

                        </label>

                      )
                    )
                  }

                </div>

              )
        }

      </section>


      {
        itensSelecionados.length < 2
          ? (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-border
                  bg-card
                  p-8
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                Selecione dois ou mais itens para comparar.
              </div>

            )
          : (

              <div
                className="
                  grid
                  gap-4
                  lg:grid-cols-2
                "
              >

                {
                  itensSelecionados.map(
                    item => (

                      <IndicadorComparacao
                        key={item.chave}
                        item={item}
                      />

                    )
                  )
                }

              </div>

            )
      }

    </div>

  )

}


function IndicadorComparacao({
  item
}) {

  return (

    <article
      className="
        rounded-2xl
        border
        border-border
        bg-card
        p-6
        shadow-sm
      "
    >

      <p
        className="
          text-xs
          uppercase
          tracking-wide
          text-muted-foreground
        "
      >
        {item.contexto}
      </p>

      <h3
        className="
          mt-1
          text-xl
          font-semibold
        "
      >
        {item.nome}
      </h3>


      <div
        className="
          mt-6
          grid
          grid-cols-3
          gap-3
        "
      >

        <Metrica
          titulo="Matrículas concluídas"
          valor={
            item.matriculasConcluidas
          }
        />

        <Metrica
          titulo="Média"
          valor={
            formatarNota(
              item.mediaNota
            )
          }
        />

        <Metrica
          titulo="Frequência"
          valor={
            formatarPercentual(
              item.percentualFrequencia
            )
          }
        />

      </div>


      <div
        className="
          mt-5
          border-t
          border-border
          pt-4
        "
      >
        <Classificacao
          valor={
            item.classificacao
          }
        />
      </div>

    </article>

  )

}


function Mapeamento({
  cursos,
  cursoAberto,
  setCursoAberto
}) {

  if (
    cursos.length === 0
  ) {

    return (

      <div
        className="
          rounded-xl
          border
          border-dashed
          border-border
          bg-card
          p-8
          text-center
          text-sm
          text-muted-foreground
        "
      >
        Não há matrículas concluídas para mapear neste período.
      </div>

    )

  }


  return (

    <div
      className="
        grid
        gap-4
      "
    >

      {
        cursos.map(
          curso => {

            const aberto =
              String(
                cursoAberto
              ) ===
              String(
                curso.idCurso
              )


            return (

              <article
                key={curso.idCurso}
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-6
                  shadow-sm
                "
              >

                <button
                  type="button"
                  className="
                    w-full
                    text-left
                  "
                  onClick={() =>
                    setCursoAberto(
                      aberto
                        ? null
                        : curso.idCurso
                    )
                  }
                >

                  <div
                    className="
                      flex
                      flex-col
                      justify-between
                      gap-5
                      md:flex-row
                      md:items-center
                    "
                  >

                    <div>

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-wide
                          text-muted-foreground
                        "
                      >
                        Curso
                      </p>

                      <h2
                        className="
                          mt-1
                          text-xl
                          font-semibold
                        "
                      >
                        {curso.nomeCurso}
                      </h2>

                    </div>


                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        Média
                        {' '}
                        <strong className="text-foreground">
                          {formatarNota(
                            curso.mediaNota
                          )}
                        </strong>
                      </span>

                      <span
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        Frequência
                        {' '}
                        <strong className="text-foreground">
                          {formatarPercentual(
                            curso.percentualFrequencia
                          )}
                        </strong>
                      </span>

                      <Classificacao
                        valor={
                          curso.classificacao
                        }
                      />

                    </div>

                  </div>

                </button>


                {
                  aberto && (

                    <div
                      className="
                        mt-6
                        border-t
                        border-border
                        pt-5
                      "
                    >

                      <h3
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        Disciplinas que sustentam a classificação
                      </h3>


                      {
                        curso.disciplinas
                          ?.length
                          ? (

                              <div
                                className="
                                  mt-4
                                  grid
                                  gap-3
                                "
                              >

                                {
                                  curso.disciplinas.map(
                                    disciplina => (

                                      <div
                                        key={
                                          disciplina.codDisciplina
                                        }
                                        className="
                                          flex
                                          flex-col
                                          justify-between
                                          gap-3
                                          rounded-xl
                                          border
                                          border-border
                                          bg-background/50
                                          p-4
                                          sm:flex-row
                                          sm:items-center
                                        "
                                      >

                                        <div>

                                          <p className="font-medium">
                                            {disciplina.nomeDisciplina}
                                          </p>

                                          <p
                                            className="
                                              mt-1
                                              text-xs
                                              text-muted-foreground
                                            "
                                          >
                                            {disciplina.codDisciplina}
                                          </p>

                                        </div>


                                        <div
                                          className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-3
                                            text-sm
                                          "
                                        >
                                          <span>
                                            Média:
                                            {' '}
                                            {formatarNota(
                                              disciplina.mediaNota
                                            )}
                                          </span>

                                          <span>
                                            Frequência:
                                            {' '}
                                            {formatarPercentual(
                                              disciplina.percentualFrequencia
                                            )}
                                          </span>

                                          <Classificacao
                                            valor={
                                              disciplina.classificacao
                                            }
                                          />
                                        </div>

                                      </div>

                                    )
                                  )
                                }

                              </div>

                            )
                          : (

                              <p
                                className="
                                  mt-4
                                  text-sm
                                  text-muted-foreground
                                "
                              >
                                Não há dados suficientes de disciplinas para detalhar este curso.
                              </p>

                            )
                      }

                    </div>

                  )
                }

              </article>

            )

          }
        )
      }

    </div>

  )

}


function Metrica({
  titulo,
  valor
}) {

  return (

    <div
      className="
        rounded-xl
        bg-background/70
        p-3
      "
    >

      <p
        className="
          text-lg
          font-semibold
        "
      >
        {valor}
      </p>

      <p
        className="
          mt-1
          text-xs
          leading-tight
          text-muted-foreground
        "
      >
        {titulo}
      </p>

    </div>

  )

}


function Classificacao({
  valor
}) {

  const Icone =
    valor === 'ALTO'
      ? TrendingUp
      : valor === 'BAIXO'
        ? TrendingDown
        : CircleAlert


  return (

    <span
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        border-primary/30
        bg-primary/10
        px-3
        py-1.5
        text-xs
        font-medium
        text-primary
      "
    >
      <Icone className="size-3.5" />

      {
        nomesClassificacao[
          valor
        ] ||
        valor
      }
    </span>

  )

}


export default AnaliseRendimentoGestor
