USE chironAcademyData;

-- =====================================================
-- CURSO DE TESTE
-- =====================================================

INSERT INTO Curso (
    nomeCurso,
    modalidade,
    duracaoSemestres
)
SELECT
    'Engenharia de Software',
    'PRESENCIAL',
    8
WHERE NOT EXISTS (
    SELECT 1
    FROM Curso
    WHERE nomeCurso = 'Engenharia de Software'
      AND modalidade = 'PRESENCIAL'
);

-- =====================================================
-- PERÍODO DE TESTE
-- =====================================================

INSERT INTO Periodo (
    numeroPeriodo,
    nomePeriodo,
    idCurso
)
SELECT
    1,
    '1º Período',
    idCurso
FROM Curso
WHERE nomeCurso = 'Engenharia de Software'
  AND modalidade = 'PRESENCIAL'
  AND NOT EXISTS (
      SELECT 1
      FROM Periodo
      WHERE numeroPeriodo = 1
        AND nomePeriodo = '1º Período'
        AND idCurso = Curso.idCurso
  )
LIMIT 1;

-- =====================================================
-- ALUNO DE TESTE
-- =====================================================

INSERT INTO Aluno (
    nome,
    telefone,
    email,
    numeroMatricula,
    idCurso,
    idPeriodo
)
SELECT
    'Aluno Teste',
    '41999999999',
    'aluno@chiron.com',
    '20260001',
    c.idCurso,
    p.idPeriodo
FROM Curso c
INNER JOIN Periodo p
    ON p.idCurso = c.idCurso
WHERE c.nomeCurso = 'Engenharia de Software'
  AND c.modalidade = 'PRESENCIAL'
  AND p.numeroPeriodo = 1
  AND NOT EXISTS (
      SELECT 1
      FROM Aluno
      WHERE numeroMatricula = '20260001'
  )
LIMIT 1;