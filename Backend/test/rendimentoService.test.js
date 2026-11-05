import assert from 'node:assert/strict'
import test from 'node:test'

import {
  calcularIndicadoresRendimento
} from '../src/services/rendimentoService.js'


const avaliacoes =
  [
    {
      idAvaliacao: 1,
      valorMaximo: 10,
      pesoAvaliacao: 40
    },
    {
      idAvaliacao: 2,
      valorMaximo: 20,
      pesoAvaliacao: 60
    }
  ]


test(
  'calcula média ponderada normalizada e não alerta no limite de frequência',
  () => {
    const rendimento =
      calcularIndicadoresRendimento(
        avaliacoes,
        [
          { idAvaliacao: 1, valor: 8 },
          { idAvaliacao: 2, valor: 14 }
        ],
        [
          { statusFrequencia: 'PRESENTE', total: 3 },
          { statusFrequencia: 'FALTA', total: 1 },
          { statusFrequencia: 'JUSTIFICADA', total: 4 }
        ]
      )

    assert.equal(rendimento.notaFinalPonderada, 7.4)
    assert.equal(rendimento.percentualFrequencia, 75)
    assert.equal(rendimento.baixoRendimento, false)
  }
)


test(
  'sinaliza frequência abaixo de 75%, excluindo justificadas do denominador',
  () => {
    const rendimento =
      calcularIndicadoresRendimento(
        avaliacoes,
        [
          { idAvaliacao: 1, valor: 10 },
          { idAvaliacao: 2, valor: 20 }
        ],
        [
          { statusFrequencia: 'PRESENTE', total: 2 },
          { statusFrequencia: 'FALTA', total: 1 },
          { statusFrequencia: 'JUSTIFICADA', total: 5 }
        ]
      )

    assert.ok(
      Math.abs(rendimento.percentualFrequencia - 200 / 3) < 1e-10
    )
    assert.equal(rendimento.abaixoFrequencia, true)
    assert.deepEqual(
      rendimento.motivos,
      ['FREQUENCIA_ABAIXO_MINIMO']
    )
  }
)


test(
  'só sinaliza nota incompleta quando a nota máxima restante não alcança 7',
  () => {
    const rendimento =
      calcularIndicadoresRendimento(
        [
          {
            idAvaliacao: 1,
            valorMaximo: 10,
            pesoAvaliacao: 40
          },
          {
            idAvaliacao: 2,
            valorMaximo: 10,
            pesoAvaliacao: 60
          }
        ],
        [
          { idAvaliacao: 1, valor: 0 }
        ],
        []
      )

    assert.equal(rendimento.notaFinalDisponivel, false)
    assert.equal(rendimento.notaMaximaPossivel, 6)
    assert.equal(rendimento.abaixoNota, true)
    assert.equal(rendimento.baixoRendimento, true)
  }
)


test(
  'não estima média nem classifica nota quando os pesos não totalizam 100%',
  () => {
    const rendimento =
      calcularIndicadoresRendimento(
        [
          {
            idAvaliacao: 1,
            valorMaximo: 10,
            pesoAvaliacao: 60
          }
        ],
        [
          { idAvaliacao: 1, valor: 0 }
        ],
        [
          { statusFrequencia: 'PRESENTE', total: 1 }
        ]
      )

    assert.equal(rendimento.pesosConfigurados, false)
    assert.equal(rendimento.notaFinalPonderada, null)
    assert.equal(rendimento.abaixoNota, null)
    assert.equal(rendimento.baixoRendimento, false)
  }
)


test(
  'não classifica frequência sem registros considerados',
  () => {
    const rendimento =
      calcularIndicadoresRendimento(
        [],
        [],
        [
          { statusFrequencia: 'JUSTIFICADA', total: 3 }
        ]
      )

    assert.equal(rendimento.percentualFrequencia, null)
    assert.equal(rendimento.abaixoFrequencia, null)
    assert.equal(rendimento.baixoRendimento, false)
  }
)
