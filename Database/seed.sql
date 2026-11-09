SET NAMES utf8mb4
    COLLATE utf8mb4_unicode_ci;

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
        AND idCurso = Curso.idCurso
  )
LIMIT 1;

-- =====================================================
-- NORMALIZAR NOME DO PERÍODO DE TESTE
-- Evita duplicidade e corrige dados gravados com charset incorreto.
-- =====================================================

UPDATE Periodo p
INNER JOIN Curso c
    ON c.idCurso = p.idCurso
SET p.nomePeriodo = '1º Período'
WHERE p.numeroPeriodo = 1
  AND c.nomeCurso = 'Engenharia de Software'
  AND c.modalidade = 'PRESENCIAL'
  AND p.nomePeriodo <> '1º Período';


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

-- =====================================================
-- DADOS DE DEMONSTRAÇÃO — PBIs 20 E 21
-- Cenários: alto rendimento, baixo rendimento e
-- dados insuficientes. Bloco idempotente.
-- =====================================================

INSERT INTO Curso (
    nomeCurso,
    modalidade,
    duracaoSemestres
)
SELECT
    demo.nomeCurso,
    demo.modalidade,
    demo.duracaoSemestres
FROM (
    SELECT
        'Ciência da Computação' AS nomeCurso,
        'PRESENCIAL' AS modalidade,
        8 AS duracaoSemestres

    UNION ALL

    SELECT
        'Sistemas de Informação',
        'PRESENCIAL',
        8

    UNION ALL

    SELECT
        'Engenharia de Computação',
        'PRESENCIAL',
        10
) demo
WHERE NOT EXISTS (
    SELECT 1
    FROM Curso c
    WHERE c.nomeCurso = demo.nomeCurso
      AND c.modalidade = demo.modalidade
);


INSERT INTO Periodo (
    numeroPeriodo,
    nomePeriodo,
    idCurso
)
SELECT
    1,
    '1º Período',
    c.idCurso
FROM Curso c
WHERE c.nomeCurso IN (
    'Ciência da Computação',
    'Sistemas de Informação',
    'Engenharia de Computação'
)
  AND NOT EXISTS (
      SELECT 1
      FROM Periodo p
      WHERE p.idCurso = c.idCurso
        AND p.numeroPeriodo = 1
  );


INSERT INTO Turma (
    localTurma,
    turnoTurma,
    idCurso
)
SELECT
    CASE c.nomeCurso
        WHEN 'Ciência da Computação'
            THEN 'LAB-CC-01'
        WHEN 'Sistemas de Informação'
            THEN 'LAB-SI-01'
        ELSE 'LAB-EC-01'
    END,
    'MANHA',
    c.idCurso
FROM Curso c
WHERE c.nomeCurso IN (
    'Ciência da Computação',
    'Sistemas de Informação',
    'Engenharia de Computação'
)
  AND NOT EXISTS (
      SELECT 1
      FROM Turma t
      WHERE t.idCurso = c.idCurso
        AND t.localTurma =
            CASE c.nomeCurso
                WHEN 'Ciência da Computação'
                    THEN 'LAB-CC-01'
                WHEN 'Sistemas de Informação'
                    THEN 'LAB-SI-01'
                ELSE 'LAB-EC-01'
            END
  );


INSERT INTO Disciplina (
    codDisciplina,
    nomeDisciplina,
    tipoDisciplina,
    cargaHoraria,
    idPeriodo,
    idCurso
)
SELECT
    demo.codDisciplina,
    demo.nomeDisciplina,
    'OBRIGATORIA',
    demo.cargaHoraria,
    p.idPeriodo,
    c.idCurso
FROM (
    SELECT
        'CC-ALG-01' AS codDisciplina,
        'Algoritmos e Estruturas de Dados' AS nomeDisciplina,
        80 AS cargaHoraria,
        'Ciência da Computação' AS nomeCurso

    UNION ALL

    SELECT
        'CC-ARQ-01',
        'Arquitetura de Computadores',
        60,
        'Ciência da Computação'

    UNION ALL

    SELECT
        'SI-BD-01',
        'Banco de Dados',
        80,
        'Sistemas de Informação'

    UNION ALL

    SELECT
        'SI-WEB-01',
        'Desenvolvimento Web',
        80,
        'Sistemas de Informação'

    UNION ALL

    SELECT
        'EC-CIR-01',
        'Circuitos Digitais',
        80,
        'Engenharia de Computação'
) demo
INNER JOIN Curso c
    ON c.nomeCurso = demo.nomeCurso
INNER JOIN Periodo p
    ON p.idCurso = c.idCurso
   AND p.numeroPeriodo = 1
WHERE NOT EXISTS (
    SELECT 1
    FROM Disciplina d
    WHERE d.codDisciplina = demo.codDisciplina
);


INSERT INTO Professor (
    nome,
    telefone,
    email
)
SELECT
    'Professora Demo',
    '41988880000',
    'prof.demo@chiron.com'
WHERE NOT EXISTS (
    SELECT 1
    FROM Professor
    WHERE email = 'prof.demo@chiron.com'
);


INSERT INTO ProfessorTurma (
    idProfessor,
    idTurma,
    codDisciplina
)
SELECT
    prof.idProfessor,
    t.idTurma,
    d.codDisciplina
FROM Professor prof
INNER JOIN Disciplina d
    ON d.codDisciplina IN (
        'CC-ALG-01',
        'CC-ARQ-01',
        'SI-BD-01',
        'SI-WEB-01',
        'EC-CIR-01'
    )
INNER JOIN Turma t
    ON t.idCurso = d.idCurso
   AND t.localTurma IN (
       'LAB-CC-01',
       'LAB-SI-01',
       'LAB-EC-01'
   )
WHERE prof.email = 'prof.demo@chiron.com'
  AND NOT EXISTS (
      SELECT 1
      FROM ProfessorTurma pt
      WHERE pt.idProfessor = prof.idProfessor
        AND pt.idTurma = t.idTurma
        AND pt.codDisciplina = d.codDisciplina
  );


INSERT INTO Aluno (
    nome,
    telefone,
    email,
    numeroMatricula,
    idCurso,
    idPeriodo
)
SELECT
    demo.nome,
    demo.telefone,
    demo.email,
    demo.numeroMatricula,
    c.idCurso,
    p.idPeriodo
FROM (
    SELECT
        'Alice Demo' AS nome,
        '41981000001' AS telefone,
        'alice.demo@chiron.com' AS email,
        'DEMO-CC-001' AS numeroMatricula,
        'Ciência da Computação' AS nomeCurso

    UNION ALL

    SELECT
        'Bruno Demo',
        '41981000002',
        'bruno.demo@chiron.com',
        'DEMO-CC-002',
        'Ciência da Computação'

    UNION ALL

    SELECT
        'Carla Demo',
        '41982000001',
        'carla.demo@chiron.com',
        'DEMO-SI-001',
        'Sistemas de Informação'

    UNION ALL

    SELECT
        'Diego Demo',
        '41982000002',
        'diego.demo@chiron.com',
        'DEMO-SI-002',
        'Sistemas de Informação'

    UNION ALL

    SELECT
        'Eva Demo',
        '41983000001',
        'eva.demo@chiron.com',
        'DEMO-EC-001',
        'Engenharia de Computação'
) demo
INNER JOIN Curso c
    ON c.nomeCurso = demo.nomeCurso
INNER JOIN Periodo p
    ON p.idCurso = c.idCurso
   AND p.numeroPeriodo = 1
WHERE NOT EXISTS (
    SELECT 1
    FROM Aluno a
    WHERE a.numeroMatricula = demo.numeroMatricula
       OR a.email = demo.email
);


INSERT INTO Matricula (
    dataMatricula,
    statusMatricula,
    idAluno,
    codDisciplina,
    idTurma
)
SELECT
    '2026-02-10',
    demo.statusMatricula,
    a.idAluno,
    demo.codDisciplina,
    t.idTurma
FROM (
    SELECT
        'DEMO-CC-001' AS numeroMatricula,
        'CC-ALG-01' AS codDisciplina,
        'APROVADO' AS statusMatricula

    UNION ALL

    SELECT
        'DEMO-CC-001',
        'CC-ARQ-01',
        'APROVADO'

    UNION ALL

    SELECT
        'DEMO-CC-002',
        'CC-ALG-01',
        'APROVADO'

    UNION ALL

    SELECT
        'DEMO-CC-002',
        'CC-ARQ-01',
        'APROVADO'

    UNION ALL

    SELECT
        'DEMO-SI-001',
        'SI-BD-01',
        'REPROVADO'

    UNION ALL

    SELECT
        'DEMO-SI-001',
        'SI-WEB-01',
        'REPROVADO'

    UNION ALL

    SELECT
        'DEMO-SI-002',
        'SI-BD-01',
        'REPROVADO'

    UNION ALL

    SELECT
        'DEMO-SI-002',
        'SI-WEB-01',
        'REPROVADO'

    UNION ALL

    SELECT
        'DEMO-EC-001',
        'EC-CIR-01',
        'APROVADO'
) demo
INNER JOIN Aluno a
    ON a.numeroMatricula = demo.numeroMatricula
INNER JOIN Disciplina d
    ON d.codDisciplina = demo.codDisciplina
   AND d.idCurso = a.idCurso
INNER JOIN Turma t
    ON t.idCurso = a.idCurso
   AND t.localTurma IN (
       'LAB-CC-01',
       'LAB-SI-01',
       'LAB-EC-01'
   )
WHERE NOT EXISTS (
    SELECT 1
    FROM Matricula m
    WHERE m.idAluno = a.idAluno
      AND m.codDisciplina = demo.codDisciplina
      AND m.idTurma = t.idTurma
);


INSERT INTO Avaliacao (
    titulo,
    descricao,
    dataAvaliacao,
    valorMaximo,
    pesoAvaliacao,
    idProfessorTurma
)
SELECT
    demo.titulo,
    demo.descricao,
    demo.dataAvaliacao,
    10.00,
    50.00,
    pt.idProfessorTurma
FROM (
    SELECT
        'Avaliação 1' AS titulo,
        'Primeira avaliação de demonstração' AS descricao,
        '2026-04-15' AS dataAvaliacao

    UNION ALL

    SELECT
        'Avaliação 2',
        'Segunda avaliação de demonstração',
        '2026-06-20'
) demo
CROSS JOIN ProfessorTurma pt
INNER JOIN Professor prof
    ON prof.idProfessor = pt.idProfessor
WHERE prof.email = 'prof.demo@chiron.com'
  AND pt.codDisciplina IN (
      'CC-ALG-01',
      'CC-ARQ-01',
      'SI-BD-01',
      'SI-WEB-01',
      'EC-CIR-01'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Avaliacao av
      WHERE av.idProfessorTurma = pt.idProfessorTurma
        AND av.titulo = demo.titulo
  );


INSERT INTO Aula (
    dataAula,
    conteudo,
    idProfessorTurma
)
SELECT
    demo.dataAula,
    demo.conteudo,
    pt.idProfessorTurma
FROM (
    SELECT
        '2026-03-10' AS dataAula,
        'Introdução e fundamentos' AS conteudo

    UNION ALL

    SELECT
        '2026-03-17',
        'Prática orientada'

    UNION ALL

    SELECT
        '2026-03-24',
        'Resolução de exercícios'

    UNION ALL

    SELECT
        '2026-03-31',
        'Revisão e consolidação'
) demo
CROSS JOIN ProfessorTurma pt
INNER JOIN Professor prof
    ON prof.idProfessor = pt.idProfessor
WHERE prof.email = 'prof.demo@chiron.com'
  AND pt.codDisciplina IN (
      'CC-ALG-01',
      'CC-ARQ-01',
      'SI-BD-01',
      'SI-WEB-01',
      'EC-CIR-01'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Aula au
      WHERE au.idProfessorTurma = pt.idProfessorTurma
        AND au.dataAula = demo.dataAula
  );


-- Notas altas para Ciência da Computação.
INSERT INTO Nota (
    valor,
    observacao,
    idAvaliacao,
    idMatricula
)
SELECT
    CASE
        WHEN a.numeroMatricula = 'DEMO-CC-001'
         AND av.titulo = 'Avaliação 1'
            THEN 9.40

        WHEN a.numeroMatricula = 'DEMO-CC-001'
            THEN 9.10

        WHEN av.titulo = 'Avaliação 1'
            THEN 8.60

        ELSE 8.80
    END,
    'Dado de demonstração — alto rendimento',
    av.idAvaliacao,
    m.idMatricula
FROM Matricula m
INNER JOIN Aluno a
    ON a.idAluno = m.idAluno
INNER JOIN ProfessorTurma pt
    ON pt.idTurma = m.idTurma
   AND pt.codDisciplina = m.codDisciplina
INNER JOIN Professor prof
    ON prof.idProfessor = pt.idProfessor
INNER JOIN Avaliacao av
    ON av.idProfessorTurma = pt.idProfessorTurma
WHERE prof.email = 'prof.demo@chiron.com'
  AND a.numeroMatricula IN (
      'DEMO-CC-001',
      'DEMO-CC-002'
  )
  AND av.titulo IN (
      'Avaliação 1',
      'Avaliação 2'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Nota n
      WHERE n.idAvaliacao = av.idAvaliacao
        AND n.idMatricula = m.idMatricula
  );


-- Notas baixas para Sistemas de Informação.
INSERT INTO Nota (
    valor,
    observacao,
    idAvaliacao,
    idMatricula
)
SELECT
    CASE
        WHEN a.numeroMatricula = 'DEMO-SI-001'
         AND av.titulo = 'Avaliação 1'
            THEN 4.20

        WHEN a.numeroMatricula = 'DEMO-SI-001'
            THEN 5.00

        WHEN av.titulo = 'Avaliação 1'
            THEN 5.80

        ELSE 5.40
    END,
    'Dado de demonstração — baixo rendimento',
    av.idAvaliacao,
    m.idMatricula
FROM Matricula m
INNER JOIN Aluno a
    ON a.idAluno = m.idAluno
INNER JOIN ProfessorTurma pt
    ON pt.idTurma = m.idTurma
   AND pt.codDisciplina = m.codDisciplina
INNER JOIN Professor prof
    ON prof.idProfessor = pt.idProfessor
INNER JOIN Avaliacao av
    ON av.idProfessorTurma = pt.idProfessorTurma
WHERE prof.email = 'prof.demo@chiron.com'
  AND a.numeroMatricula IN (
      'DEMO-SI-001',
      'DEMO-SI-002'
  )
  AND av.titulo IN (
      'Avaliação 1',
      'Avaliação 2'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Nota n
      WHERE n.idAvaliacao = av.idAvaliacao
        AND n.idMatricula = m.idMatricula
  );


-- Frequência alta para Ciência da Computação.
INSERT INTO Frequencia (
    statusFrequencia,
    observacao,
    idAula,
    idMatricula
)
SELECT
    'PRESENTE',
    'Dado de demonstração — frequência alta',
    au.idAula,
    m.idMatricula
FROM Matricula m
INNER JOIN Aluno a
    ON a.idAluno = m.idAluno
INNER JOIN ProfessorTurma pt
    ON pt.idTurma = m.idTurma
   AND pt.codDisciplina = m.codDisciplina
INNER JOIN Professor prof
    ON prof.idProfessor = pt.idProfessor
INNER JOIN Aula au
    ON au.idProfessorTurma = pt.idProfessorTurma
WHERE prof.email = 'prof.demo@chiron.com'
  AND a.numeroMatricula IN (
      'DEMO-CC-001',
      'DEMO-CC-002'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Frequencia f
      WHERE f.idAula = au.idAula
        AND f.idMatricula = m.idMatricula
  );


-- Frequência baixa para Sistemas de Informação:
-- Carla = 50%; Diego = 75%; agregado do curso < 75%.
INSERT INTO Frequencia (
    statusFrequencia,
    observacao,
    idAula,
    idMatricula
)
SELECT
    CASE
        WHEN a.numeroMatricula = 'DEMO-SI-001'
         AND au.dataAula IN (
             '2026-03-24',
             '2026-03-31'
         )
            THEN 'FALTA'

        WHEN a.numeroMatricula = 'DEMO-SI-002'
         AND au.dataAula = '2026-03-31'
            THEN 'FALTA'

        ELSE 'PRESENTE'
    END,
    'Dado de demonstração — frequência variada',
    au.idAula,
    m.idMatricula
FROM Matricula m
INNER JOIN Aluno a
    ON a.idAluno = m.idAluno
INNER JOIN ProfessorTurma pt
    ON pt.idTurma = m.idTurma
   AND pt.codDisciplina = m.codDisciplina
INNER JOIN Professor prof
    ON prof.idProfessor = pt.idProfessor
INNER JOIN Aula au
    ON au.idProfessorTurma = pt.idProfessorTurma
WHERE prof.email = 'prof.demo@chiron.com'
  AND a.numeroMatricula IN (
      'DEMO-SI-001',
      'DEMO-SI-002'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM Frequencia f
      WHERE f.idAula = au.idAula
        AND f.idMatricula = m.idMatricula
  );


-- Engenharia de Computação permanece deliberadamente
-- sem notas/frequências para demonstrar "dados insuficientes".

-- =====================================================
-- NORMALIZAÇÃO DOS DADOS DEMO
-- Corrige textos que possam ter sido gravados com
-- encoding incorreto em execuções anteriores no Windows.
-- =====================================================

UPDATE Curso
SET nomeCurso = CONVERT(
    0x4369C3AA6E63696120646120436F6D70757461C3A7C3A36F
    USING utf8mb4
)
WHERE idCurso = 5
   OR nomeCurso LIKE 'Ci?n%';

UPDATE Curso
SET nomeCurso = CONVERT(
    0x53697374656D617320646520496E666F726D61C3A7C3A36F
    USING utf8mb4
)
WHERE idCurso = 6
   OR nomeCurso LIKE 'Sistemas de Informa%';

UPDATE Curso
SET nomeCurso = CONVERT(
    0x456E67656E686172696120646520436F6D70757461C3A7C3A36F
    USING utf8mb4
)
WHERE idCurso = 7
   OR nomeCurso LIKE 'Engenharia de Computa%';


UPDATE Periodo p
INNER JOIN Curso c
    ON c.idCurso = p.idCurso
SET p.nomePeriodo = CONVERT(
    0x31C2BA20506572C3AD6F646F
    USING utf8mb4
)
WHERE p.numeroPeriodo = 1
  AND c.nomeCurso IN (
      CONVERT(
          0x4369C3AA6E63696120646120436F6D70757461C3A7C3A36F
          USING utf8mb4
      ),
      CONVERT(
          0x53697374656D617320646520496E666F726D61C3A7C3A36F
          USING utf8mb4
      ),
      CONVERT(
          0x456E67656E686172696120646520436F6D70757461C3A7C3A36F
          USING utf8mb4
      )
  );


UPDATE Disciplina
SET nomeDisciplina = CONVERT(
    0x416C676F7269746D6F7320652045737472757475726173206465204461646F73
    USING utf8mb4
)
WHERE codDisciplina = 'CC-ALG-01';

UPDATE Disciplina
SET nomeDisciplina = CONVERT(
    0x417271756974657475726120646520436F6D70757461646F726573
    USING utf8mb4
)
WHERE codDisciplina = 'CC-ARQ-01';

UPDATE Disciplina
SET nomeDisciplina = CONVERT(
    0x42616E636F206465204461646F73
    USING utf8mb4
)
WHERE codDisciplina = 'SI-BD-01';

UPDATE Disciplina
SET nomeDisciplina = CONVERT(
    0x446573656E766F6C76696D656E746F20576562
    USING utf8mb4
)
WHERE codDisciplina = 'SI-WEB-01';

UPDATE Disciplina
SET nomeDisciplina = CONVERT(
    0x436972637569746F73204469676974616973
    USING utf8mb4
)
WHERE codDisciplina = 'EC-CIR-01';

