import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  CircleAlert,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  School,
  UsersRound
} from 'lucide-react'

import AreaInterna
  from '../AreaInterna/AreaInterna.jsx'

import {
  consultarIndicadoresCursos
} from '../../services/gestorServices/indicadoresCursoService.js'


const nomesStatusMatricula = {
  CURSANDO: 'Cursando',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  TRANCADO: 'Trancado',
  JUSTIFICADO: 'Justificado'
}


const nomesStatusFrequencia = {
  PRESENTE: 'Presente',
  FALTA: 'Falta',
  JUSTIFICADA: 'Justificada'
}


const coresStatus = {
  CURSANDO: '#38bdf8',
  APROVADO: '#34d399',
  REPROVADO: '#fb7185',
  TRANCADO: '#94a3b8',
  JUSTIFICADO: '#a78bfa',
  PRESENTE: '#34d399',
  FALTA: '#fb7185',
  JUSTIFICADA: '#a78bfa'
}


function formatarNumero(valor) {
  return Number(valor || 0).toLocaleString('pt-BR')
}


function IndicadorCard({
  titulo,
  valor,
  descricao,
  Icone
}) {

  return (

    <article
      className="
        rounded-xl
        border
        border-border
        bg-background
        p-5
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
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
              mt-3
              text-3xl
              font-semibold
              tabular-nums
            "
          >
            {formatarNumero(valor)}
          </p>

          <p
            className="
              mt-2
              text-xs
              leading-relaxed
              text-muted-foreground
            "
          >
            {descricao}
          </p>

        </div>

        <span
          className="
            flex
            size-11
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-primary/10
            text-primary
          "
        >
          <Icone className="size-5" />
        </span>

      </div>

    </article>

  )

}


function GraficoStatus({
  titulo,
  descricao,
  linhas,
  statusDisponiveis,
  nomesStatus
}) {

  const totaisPorStatus =
    statusDisponiveis.map(
      status => ({
        status,
        total: linhas.reduce(
          (acumulado, linha) =>
            acumulado +
            Number(
              linha.status.find(
                item => item.status === status
              )?.total || 0
            ),
          0
        )
      })
    )

  const totalRegistros =
    totaisPorStatus.reduce(
      (total, item) => total + item.total,
      0
    )

  let acumulado = 0

  const segmentos =
    totaisPorStatus.map(
      item => {
        const segmento = {
          ...item,
          inicio: acumulado
        }

        acumulado += item.total
        return segmento
      }
    )

  const raio = 72
  const circunferencia = 2 * Math.PI * raio
  const statusComRegistros =
    segmentos.filter(item => item.total > 0).length


  return (

    <section
      className="
        rounded-2xl
        border
        border-border
        bg-background
        p-5
        shadow-sm
        sm:p-7
      "
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          {titulo}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {descricao}
        </p>
      </div>

      {
        totalRegistros === 0
          ? (
              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-dashed
                  border-border
                  px-5
                  py-10
                  text-center
                  text-sm
                  text-muted-foreground
                "
              >
                Não há registros para exibir neste indicador.
              </div>
            )
          : (
              <div
                className="
                  mt-7
                  grid
                  items-center
                  gap-8
                  md:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.1fr)]
                "
              >
                <div className="flex justify-center">
                  <svg
                    viewBox="0 0 220 220"
                    className="w-full max-w-[240px]"
                    role="img"
                    aria-label={`${titulo}: ${formatarNumero(totalRegistros)} registros no total`}
                  >
                    <circle
                      cx="110"
                      cy="110"
                      r={raio}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeWidth="26"
                    />

                    {
                      segmentos.map(
                        item => {
                          if (item.total <= 0) {
                            return null
                          }

                          const comprimento =
                            item.total / totalRegistros * circunferencia

                          const tracejado =
                            statusComRegistros === 1
                              ? `${circunferencia} ${circunferencia}`
                              : `${Math.max(0, comprimento - 3)} ${circunferencia}`

                          return (
                            <circle
                              key={item.status}
                              cx="110"
                              cy="110"
                              r={raio}
                              fill="none"
                              stroke={coresStatus[item.status] || '#d4a84f'}
                              strokeWidth="26"
                              strokeDasharray={tracejado}
                              strokeDashoffset={-item.inicio / totalRegistros * circunferencia}
                              transform="rotate(-90 110 110)"
                            >
                              <title>
                                {`${nomesStatus[item.status] || item.status}: ${formatarNumero(item.total)}`}
                              </title>
                            </circle>
                          )
                        }
                      )
                    }

                    <text
                      x="110"
                      y="106"
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize={totalRegistros >= 1000000 ? '19' : '25'}
                      fontWeight="700"
                    >
                      {formatarNumero(totalRegistros)}
                    </text>
                    <text
                      x="110"
                      y="130"
                      textAnchor="middle"
                      fill="currentColor"
                      fillOpacity="0.58"
                      fontSize="11"
                    >
                      registros
                    </text>
                  </svg>
                </div>

                <div
                  className="divide-y divide-border"
                  aria-label="Detalhamento por status"
                >
                  {
                    segmentos.map(
                      item => {
                        const percentual =
                          totalRegistros > 0
                            ? item.total / totalRegistros * 100
                            : 0

                        return (
                          <div
                            key={item.status}
                            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className="size-3 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    coresStatus[item.status] || '#d4a84f'
                                }}
                              />
                              <span className="truncate text-sm font-medium">
                                {nomesStatus[item.status] || item.status}
                              </span>
                            </div>
                            <div className="flex shrink-0 items-baseline gap-3 text-right tabular-nums">
                              <span className="text-sm font-semibold">
                                {formatarNumero(item.total)}
                              </span>
                              <span className="w-14 text-xs text-muted-foreground">
                                {percentual.toLocaleString('pt-BR', {
                                  maximumFractionDigits: 1
                                })}%
                              </span>
                            </div>
                          </div>
                        )
                      }
                    )
                  }
                </div>
              </div>
            )
      }
    </section>

  )

}

function DashboardGestor() {

  const navigate =
    useNavigate()


  const [
    cursos,
    setCursos
  ] =
    useState([])


  const [
    indicadores,
    setIndicadores
  ] =
    useState([])


  const [
    idCursoSelecionado,
    setIdCursoSelecionado
  ] =
    useState('')


  const [
    indicadorSelecionado,
    setIndicadorSelecionado
  ] =
    useState(null)


  const [
    carregando,
    setCarregando
  ] =
    useState(true)


  const [
    atualizandoCurso,
    setAtualizandoCurso
  ] =
    useState(false)


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


      async function carregarIndicadores() {

        setErro('')


        if (idCursoSelecionado) {

          setAtualizandoCurso(true)
          setIndicadorSelecionado(null)

        } else {

          setCarregando(true)

        }


        try {

          const resposta =
            await consultarIndicadoresCursos(
              idCursoSelecionado || null
            )


          if (!ativo) {
            return
          }


          setCursos(
            resposta.cursos || []
          )


          if (idCursoSelecionado) {

            setIndicadorSelecionado(
              resposta.indicadores?.[0] || null
            )

          } else {

            setIndicadores(
              resposta.indicadores || []
            )

          }

        } catch (error) {

          if (ativo) {

            setErro(
              error.message ||
              'Não foi possível carregar os indicadores.'
            )

          }

        } finally {

          if (ativo) {

            setCarregando(false)
            setAtualizandoCurso(false)

          }

        }

      }


      carregarIndicadores()


      return () => {
        ativo = false
      }

    },
    [
      idCursoSelecionado,
      tentativa
    ]
  )


  const nomeCursoSelecionado =
    cursos.find(
      curso =>
        String(curso.idCurso) ===
        idCursoSelecionado
    )?.nomeCurso


  const linhasMatriculas =
    indicadores.map(
      item => ({
        id: item.idCurso,
        nome: item.nomeCurso,
        status: item.matriculasPorStatus || []
      })
    )


  const linhasFrequencias =
    indicadores.map(
      item => ({
        id: item.idCurso,
        nome: item.nomeCurso,
        status: item.frequenciasPorStatus || []
      })
    )


  const matriculasPorStatus =
    indicadorSelecionado?.matriculasPorStatus || []


  const frequenciasPorStatus =
    indicadorSelecionado?.frequenciasPorStatus || []


  function selecionarCurso(evento) {
    setIdCursoSelecionado(
      evento.target.value
    )
  }


  return (

    <AreaInterna>

      <div className="space-y-8">

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <button
              type="button"
              onClick={() =>
                navigate('/sistema/gestor')
              }
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-sm
                text-muted-foreground
                transition
                hover:text-foreground
              "
            >
              <ArrowLeft className="size-4" />
              Voltar para gestão acadêmica
            </button>

            <p
              className="
                text-sm
                font-medium
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
              "
            >
              Indicadores dos cursos
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Contagens acadêmicas registradas no sistema. Os dados não representam médias nem taxas oficiais.
            </p>

          </div>


          <label
            className="
              block
              w-full
              sm:max-w-xs
            "
          >

            <span
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Detalhar curso
            </span>

            <select
              className="campo"
              value={idCursoSelecionado}
              onChange={selecionarCurso}
              disabled={carregando || cursos.length === 0}
            >
              <option value="">
                Visão de todos os cursos
              </option>

              {
                cursos.map(
                  curso => (
                    <option
                      key={curso.idCurso}
                      value={curso.idCurso}
                    >
                      {curso.nomeCurso}
                    </option>
                  )
                )
              }
            </select>

          </label>

        </div>


        {
          erro &&
          (
            <div
              className="
                flex
                flex-col
                gap-4
                rounded-lg
                border
                border-destructive/40
                bg-destructive/10
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
              role="alert"
            >
              <div className="flex items-start gap-3">
                <CircleAlert
                  className="
                    mt-0.5
                    size-5
                    shrink-0
                    text-destructive
                  "
                />
                <p className="text-sm">
                  {erro}
                </p>
              </div>

              <button
                type="button"
                className="botao-secundario inline-flex items-center gap-2"
                onClick={() =>
                  setTentativa(
                    atual => atual + 1
                  )
                }
              >
                <RefreshCw className="size-4" />
                Tentar novamente
              </button>
            </div>
          )
        }


        {
          carregando
            ? (
                <div
                  className="
                    flex
                    min-h-48
                    items-center
                    justify-center
                    gap-3
                    text-sm
                    text-muted-foreground
                  "
                >
                  <LoaderCircle className="size-5 animate-spin" />
                  Carregando indicadores...
                </div>
              )
            : erro && cursos.length === 0
              ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-border
                      p-8
                      text-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Não foi possível carregar a lista de cursos.
                  </div>
                )
            : cursos.length === 0
              ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-border
                      p-10
                      text-center
                    "
                  >
                    <School className="mx-auto size-8 text-primary" />
                    <h2 className="mt-4 font-semibold">
                      Nenhum curso cadastrado
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Cadastre um curso para visualizar os indicadores acadêmicos.
                    </p>
                  </div>
                )
              : (
                  <>

                    {
                      idCursoSelecionado
                        ? (
                            atualizandoCurso
                              ? (
                                  <div
                                    className="
                                      flex
                                      min-h-32
                                      items-center
                                      justify-center
                                      gap-3
                                      text-sm
                                      text-muted-foreground
                                    "
                                  >
                                    <LoaderCircle className="size-5 animate-spin" />
                                    Carregando dados do curso...
                                  </div>
                                )
                              : indicadorSelecionado
                                ? (
                                    <>

                                      <section
                                        className="
                                          rounded-xl
                                          border
                                          border-border
                                          bg-background
                                          p-5
                                          sm:p-6
                                        "
                                      >
                                        <p className="text-sm text-muted-foreground">
                                          Curso selecionado
                                        </p>
                                        <h2
                                          className="
                                            mt-1
                                            text-2xl
                                            font-semibold
                                          "
                                        >
                                          {nomeCursoSelecionado || indicadorSelecionado.nomeCurso}
                                        </h2>
                                      </section>


                                      <section
                                        className="
                                          grid
                                          gap-4
                                          sm:grid-cols-2
                                          xl:grid-cols-3
                                        "
                                        aria-label="Indicadores do curso selecionado"
                                      >
                                        <IndicadorCard
                                          titulo="Alunos cadastrados"
                                          valor={indicadorSelecionado.alunosCadastrados}
                                          descricao="Alunos associados ao curso."
                                          Icone={UsersRound}
                                        />

                                        <IndicadorCard
                                          titulo="Disciplinas"
                                          valor={indicadorSelecionado.disciplinas}
                                          descricao="Disciplinas cadastradas no curso."
                                          Icone={BookOpen}
                                        />

                                        <IndicadorCard
                                          titulo="Turmas"
                                          valor={indicadorSelecionado.turmas}
                                          descricao="Turmas cadastradas para o curso."
                                          Icone={School}
                                        />

                                        <IndicadorCard
                                          titulo="Notas lançadas"
                                          valor={indicadorSelecionado.notasLancadas}
                                          descricao="Registros de nota compatíveis com a matrícula e a disciplina."
                                          Icone={GraduationCap}
                                        />

                                        <IndicadorCard
                                          titulo="Frequências registradas"
                                          valor={indicadorSelecionado.frequenciasRegistradas}
                                          descricao="Marcações de frequência existentes, sem estimar registros ausentes."
                                          Icone={CalendarCheck}
                                        />

                                      </section>


                                      <GraficoStatus
                                        titulo="Matrículas por status"
                                        descricao="Quantidade e participação de cada status no total de matrículas do curso."
                                        linhas={[
                                          {
                                            id: indicadorSelecionado.idCurso,
                                            nome: indicadorSelecionado.nomeCurso,
                                            status: matriculasPorStatus
                                          }
                                        ]}
                                        statusDisponiveis={[
                                          'CURSANDO',
                                          'APROVADO',
                                          'REPROVADO',
                                          'TRANCADO',
                                          'JUSTIFICADO'
                                        ]}
                                        nomesStatus={nomesStatusMatricula}
                                      />


                                      <GraficoStatus
                                        titulo="Frequências registradas por status"
                                        descricao="Quantidade e participação de cada status entre as marcações registradas no curso."
                                        linhas={[
                                          {
                                            id: indicadorSelecionado.idCurso,
                                            nome: indicadorSelecionado.nomeCurso,
                                            status: frequenciasPorStatus
                                          }
                                        ]}
                                        statusDisponiveis={[
                                          'PRESENTE',
                                          'FALTA',
                                          'JUSTIFICADA'
                                        ]}
                                        nomesStatus={nomesStatusFrequencia}
                                      />

                                    </>
                                  )
                                : (
                                    <div
                                      className="
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-border
                                        p-8
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                      "
                                    >
                                      Não há indicadores disponíveis para o curso selecionado.
                                    </div>
                                  )
                          )
                        : (
                            <>

                              <GraficoStatus
                                titulo="Matrículas — todos os cursos"
                                descricao="Distribuição consolidada por status. A lista ao lado mostra a quantidade e a participação no total."
                                linhas={linhasMatriculas}
                                statusDisponiveis={[
                                  'CURSANDO',
                                  'APROVADO',
                                  'REPROVADO',
                                  'TRANCADO',
                                  'JUSTIFICADO'
                                ]}
                                nomesStatus={nomesStatusMatricula}
                              />


                              <GraficoStatus
                                titulo="Frequências — todos os cursos"
                                descricao="Distribuição consolidada das marcações registradas; ausência de registro não é contabilizada como falta."
                                linhas={linhasFrequencias}
                                statusDisponiveis={[
                                  'PRESENTE',
                                  'FALTA',
                                  'JUSTIFICADA'
                                ]}
                                nomesStatus={nomesStatusFrequencia}
                              />


                              <section>
                                <div className="mb-4">
                                  <h2 className="text-lg font-semibold">
                                    Resumo por curso
                                  </h2>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Selecione um curso acima para consultar os indicadores detalhados.
                                  </p>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                  {
                                    indicadores.map(
                                      indicador => (
                                        <button
                                          key={indicador.idCurso}
                                          type="button"
                                          onClick={() =>
                                            setIdCursoSelecionado(
                                              String(indicador.idCurso)
                                            )
                                          }
                                          className="
                                            rounded-xl
                                            border
                                            border-border
                                            bg-background
                                            p-5
                                            text-left
                                            transition
                                            hover:border-primary/50
                                            hover:bg-secondary/50
                                          "
                                        >
                                          <span className="font-semibold">
                                            {indicador.nomeCurso}
                                          </span>

                                          <span
                                            className="
                                              mt-4
                                              grid
                                              grid-cols-2
                                              gap-x-4
                                              gap-y-3
                                              text-sm
                                              sm:grid-cols-3
                                            "
                                          >
                                            <span>
                                              <span className="block text-xs text-muted-foreground">
                                                Alunos
                                              </span>
                                              <span className="mt-1 block font-medium tabular-nums">
                                                {formatarNumero(indicador.alunosCadastrados)}
                                              </span>
                                            </span>
                                            <span>
                                              <span className="block text-xs text-muted-foreground">
                                                Disciplinas
                                              </span>
                                              <span className="mt-1 block font-medium tabular-nums">
                                                {formatarNumero(indicador.disciplinas)}
                                              </span>
                                            </span>
                                            <span>
                                              <span className="block text-xs text-muted-foreground">
                                                Turmas
                                              </span>
                                              <span className="mt-1 block font-medium tabular-nums">
                                                {formatarNumero(indicador.turmas)}
                                              </span>
                                            </span>
                                            <span>
                                              <span className="block text-xs text-muted-foreground">
                                                Notas lançadas
                                              </span>
                                              <span className="mt-1 block font-medium tabular-nums">
                                                {formatarNumero(indicador.notasLancadas)}
                                              </span>
                                            </span>
                                            <span>
                                              <span className="block text-xs text-muted-foreground">
                                                Frequências
                                              </span>
                                              <span className="mt-1 block font-medium tabular-nums">
                                                {formatarNumero(indicador.frequenciasRegistradas)}
                                              </span>
                                            </span>
                                          </span>
                                        </button>
                                      )
                                    )
                                  }
                                </div>
                              </section>

                            </>
                          )
                    }

                  </>
                )
        }

      </div>

    </AreaInterna>

  )

}


export default DashboardGestor
