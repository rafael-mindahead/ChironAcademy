export function calcularIndicadoresRendimento(
  avaliacoes,
  notas,
  frequencias
) {

  const pesosConfigurados =
    avaliacoes.length > 0 &&
    avaliacoes.every(
      avaliacao =>
        avaliacao.pesoAvaliacao !== null &&
        avaliacao.pesoAvaliacao !== undefined &&
        Number(avaliacao.pesoAvaliacao) > 0
    ) &&
    Math.abs(
      avaliacoes.reduce(
        (total, avaliacao) =>
          total + Number(avaliacao.pesoAvaliacao),
        0
      ) - 100
    ) <= 0.01

  const notasPorAvaliacao =
    new Map(
      notas.map(
        nota => [
          Number(nota.idAvaliacao),
          nota
        ]
      )
    )

  let pontosPonderados =
    0

  let pesoPendente =
    0

  let notasPendentes =
    0

  if (pesosConfigurados) {
    for (const avaliacao of avaliacoes) {
      const peso =
        Number(avaliacao.pesoAvaliacao)

      const nota =
        notasPorAvaliacao.get(
          Number(avaliacao.idAvaliacao)
        )

      if (!nota) {
        pesoPendente += peso
        notasPendentes += 1
        continue
      }

      pontosPonderados +=
        Number(nota.valor) /
        Number(avaliacao.valorMaximo) *
        peso /
        10
    }
  }

  const notaFinalDisponivel =
    pesosConfigurados &&
    notasPendentes === 0

  const notaMaximaPossivel =
    pesosConfigurados
      ? pontosPonderados + pesoPendente / 10
      : null

  const notaFinalPonderada =
    notaFinalDisponivel
      ? pontosPonderados
      : null

  let abaixoNota =
    null

  if (notaFinalDisponivel) {
    abaixoNota =
      notaFinalPonderada < 7
  } else if (
    pesosConfigurados &&
    notasPendentes > 0 &&
    notaMaximaPossivel < 7
  ) {
    abaixoNota = true
  }

  const presentes =
    frequencias
      .filter(
        item =>
          item.statusFrequencia === 'PRESENTE'
      )
      .reduce(
        (total, item) =>
          total + Number(item.total),
        0
      )

  const faltas =
    frequencias
      .filter(
        item =>
          item.statusFrequencia === 'FALTA'
      )
      .reduce(
        (total, item) =>
          total + Number(item.total),
        0
      )

  const justificadas =
    frequencias
      .filter(
        item =>
          item.statusFrequencia === 'JUSTIFICADA'
      )
      .reduce(
        (total, item) =>
          total + Number(item.total),
        0
      )

  const aulasConsideradas =
    presentes + faltas

  const percentualFrequencia =
    aulasConsideradas > 0
      ? presentes / aulasConsideradas * 100
      : null

  const abaixoFrequencia =
    percentualFrequencia !== null
      ? percentualFrequencia < 75
      : null

  const motivos =
    []

  if (abaixoFrequencia === true) {
    motivos.push('FREQUENCIA_ABAIXO_MINIMO')
  }

  if (abaixoNota === true) {
    motivos.push('MEDIA_FINAL_ABAIXO_MINIMO')
  }

  return {
    baixoRendimento: motivos.length > 0,
    motivos,
    percentualFrequencia,
    presentes,
    faltas,
    justificadas,
    aulasConsideradas,
    abaixoFrequencia,
    notaFinalPonderada,
    notaAtualPonderada:
      pesosConfigurados
        ? pontosPonderados
        : null,
    notaMaximaPossivel,
    abaixoNota,
    notasPendentes,
    quantidadeAvaliacoes: avaliacoes.length,
    totalPesoAvaliacao:
      avaliacoes.reduce(
        (total, avaliacao) =>
          total + Number(avaliacao.pesoAvaliacao || 0),
        0
      ),
    pesosConfigurados,
    notaFinalDisponivel
  }

}
