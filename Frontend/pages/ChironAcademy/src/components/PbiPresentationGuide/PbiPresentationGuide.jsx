import {
  useLocation
} from 'react-router-dom'


const telas = [
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/cursos',
    pbis: [
      {
        numero: '01',
        titulo: 'Manter cadastro de cursos'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/periodos',
    pbis: [
      {
        numero: '02',
        titulo: 'Manter períodos acadêmicos'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/disciplinas',
    pbis: [
      {
        numero: '03',
        titulo: 'Manter disciplinas'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/turmas',
    pbis: [
      {
        numero: '04',
        titulo: 'Manter turmas'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/professores',
    pbis: [
      {
        numero: '05',
        titulo: 'Manter professores'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/alunos',
    pbis: [
      {
        numero: '06',
        titulo: 'Manter alunos'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/vinculos',
    pbis: [
      {
        numero: '07',
        titulo: 'Vincular professor à turma/disciplina'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/matriculas',
    pbis: [
      {
        numero: '08',
        titulo: 'Matricular aluno'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/professor',
    pbis: [
      {
        numero: '09',
        titulo: 'Consultar turmas sob responsabilidade'
      }
    ]
  },
  {
    corresponde: caminho =>
      /^\/sistema\/professor\/turmas\/[^/]+$/.test(
        caminho
      ),
    pbis: [
      {
        numero: '09',
        titulo: 'Consultar turmas sob responsabilidade'
      },
      {
        numero: '10',
        titulo: 'Manter avaliações da turma'
      }
    ]
  },
  {
    corresponde: caminho =>
      /^\/sistema\/professor\/turmas\/[^/]+\/avaliacoes\/[^/]+\/notas$/.test(
        caminho
      ),
    pbis: [
      {
        numero: '11',
        titulo: 'Registrar notas dos alunos'
      }
    ]
  },
  {
    corresponde: caminho =>
      /^\/sistema\/professor\/turmas\/[^/]+\/frequencia$/.test(
        caminho
      ) ||
      /^\/sistema\/professor\/turmas\/[^/]+\/aulas\/[^/]+\/frequencia$/.test(
        caminho
      ),
    pbis: [
      {
        numero: '12',
        titulo: 'Registrar frequência dos alunos'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/aluno',
    pbis: [
      {
        numero: '13',
        titulo: 'Consultar disciplinas matriculadas'
      }
    ]
  },
  {
    corresponde: caminho =>
      /^\/sistema\/aluno\/disciplinas\/[^/]+\/desempenho$/.test(
        caminho
      ),
    pbis: [
      {
        numero: '14',
        titulo: 'Consultar desempenho por disciplina'
      }
    ]
  },
  {
    corresponde: caminho =>
      /^\/sistema\/aluno\/evolucao\/[^/]+$/.test(
        caminho
      ),
    pbis: [
      {
        numero: '15',
        titulo: 'Acompanhar evolução no período'
      }
    ]
  },
  {
    corresponde: caminho =>
      /^\/sistema\/professor\/turmas\/[^/]+\/desempenho$/.test(
        caminho
      ) ||
      /^\/sistema\/professor\/turmas\/[^/]+\/alunos\/[^/]+\/desempenho$/.test(
        caminho
      ),
    pbis: [
      {
        numero: '16',
        titulo: 'Consultar desempenho dos alunos'
      },
      {
        numero: '17',
        titulo: 'Identificar baixo rendimento'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/indicadores',
    pbis: [
      {
        numero: '18',
        titulo: 'Visualizar indicadores dos cursos'
      },
      {
        numero: '19',
        titulo: 'Filtrar indicadores por período'
      }
    ]
  },
  {
    corresponde: caminho =>
      caminho === '/sistema/gestor/rendimento',
    pbis: [
      {
        numero: '20',
        titulo: 'Comparar cursos e disciplinas'
      },
      {
        numero: '21',
        titulo: 'Mapear cursos de alto e baixo rendimento'
      }
    ]
  }
]


function PbiPresentationGuide() {

  const {
    pathname
  } =
    useLocation()


  const tela =
    telas.find(
      item =>
        item.corresponde(
          pathname
        )
    )


  if (!tela) {

    return null

  }


  return (

    <aside
      aria-label="Guia de PBIs para apresentação"
      className="
        pointer-events-none
        fixed
        right-3
        top-3
        z-50
        flex
        max-w-[calc(100vw-1.5rem)]
        flex-col
        items-end
        gap-2
        sm:right-5
        sm:top-5
      "
    >

      {
        tela.pbis.map(
          pbi => (

            <div
              key={pbi.numero}
              className="
                max-w-xs
                rounded-xl
                border
                border-primary/30
                bg-background/95
                px-3
                py-2
                text-right
                shadow-lg
                backdrop-blur
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-primary
                "
              >
                PBI {pbi.numero}
              </p>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-medium
                  leading-tight
                  text-foreground
                "
              >
                {pbi.titulo}
              </p>

            </div>

          )
        )
      }

    </aside>

  )

}


export default PbiPresentationGuide
