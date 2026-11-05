USE chironAcademyData;

SET NAMES utf8mb4;

SET @curso_es =
    CONVERT(0x456E67656E686172696120646520536F667477617265202844656D6F2064652066696C74726F29 USING utf8mb4);

SET @curso_adm =
    CONVERT(0x41646D696E6973747261C3A7C3A36F202844656D6F2064652066696C74726F29 USING utf8mb4);

SET @periodo_1 =
    CONVERT(0x31C2BA20506572C3AD6F646F USING utf8mb4);

SET @periodo_2 =
    CONVERT(0x32C2BA20506572C3AD6F646F USING utf8mb4);

START TRANSACTION;

UPDATE Curso
SET nomeCurso = @curso_es
WHERE nomeCurso = 'Demo Indicadores A';

UPDATE Curso
SET nomeCurso = @curso_adm
WHERE nomeCurso = 'Demo Indicadores B'
   OR nomeCurso LIKE 'Administra% (Demo de filtro)';

UPDATE Periodo p
INNER JOIN Curso c
    ON c.idCurso = p.idCurso
SET p.nomePeriodo =
    CASE p.numeroPeriodo
        WHEN 1 THEN @periodo_1
        WHEN 2 THEN @periodo_2
    END
WHERE c.nomeCurso IN (
    @curso_es,
    @curso_adm
)
  AND p.numeroPeriodo IN (1, 2);

UPDATE Turma t
INNER JOIN Disciplina d
    ON d.idCurso = t.idCurso
LEFT JOIN Turma existing
    ON existing.idCurso = t.idCurso
   AND existing.localTurma = CONCAT('Turma demo - ', d.codDisciplina)
SET t.localTurma = CONCAT('Turma demo - ', d.codDisciplina)
WHERE d.codDisciplina IN (
    'FILTRO-ES-P2',
    'FILTRO-ADM-P2'
)
  AND t.localTurma LIKE 'Turma demonstra%'
  AND existing.idTurma IS NULL;

DELETE t
FROM Turma t
INNER JOIN Disciplina d
    ON d.idCurso = t.idCurso
INNER JOIN Turma canonical
    ON canonical.idCurso = t.idCurso
   AND canonical.localTurma = CONCAT('Turma demo - ', d.codDisciplina)
LEFT JOIN ProfessorTurma pt
    ON pt.idTurma = t.idTurma
LEFT JOIN Matricula m
    ON m.idTurma = t.idTurma
   AND m.codDisciplina = d.codDisciplina
WHERE d.codDisciplina IN (
    'FILTRO-ES-P2',
    'FILTRO-ADM-P2'
)
  AND t.localTurma LIKE 'Turma demonstra%'
  AND pt.idProfessorTurma IS NULL
  AND m.idMatricula IS NULL;

INSERT INTO Periodo (
    numeroPeriodo,
    nomePeriodo,
    idCurso
)
SELECT
    2,
    @periodo_2,
    c.idCurso
FROM Curso c
WHERE c.nomeCurso IN (
    @curso_es,
    @curso_adm
)
  AND NOT EXISTS (
      SELECT 1
      FROM Periodo p
      WHERE p.idCurso = c.idCurso
        AND p.numeroPeriodo = 2
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
    dados.codDisciplina,
    dados.nomeDisciplina,
    'OBRIGATORIA',
    60,
    p.idPeriodo,
    c.idCurso
FROM (
    SELECT
        'FILTRO-ES-P2' AS codDisciplina,
        'Algoritmos e Estruturas de Dados' AS nomeDisciplina,
        @curso_es AS nomeCurso
    UNION ALL
    SELECT
        'FILTRO-ADM-P2',
        'Fundamentos de Administracao',
        @curso_adm
) AS dados
INNER JOIN Curso c
    ON c.nomeCurso = dados.nomeCurso
INNER JOIN Periodo p
    ON p.idCurso = c.idCurso
   AND p.numeroPeriodo = 2
WHERE NOT EXISTS (
    SELECT 1
    FROM Disciplina d
    WHERE d.codDisciplina = dados.codDisciplina
);

INSERT INTO Turma (
    localTurma,
    turnoTurma,
    idCurso
)
SELECT
    CONCAT('Turma demo - ', d.codDisciplina),
    'MANHA',
    c.idCurso
FROM Disciplina d
INNER JOIN Curso c
    ON c.idCurso = d.idCurso
WHERE d.codDisciplina IN (
    'FILTRO-ES-P2',
    'FILTRO-ADM-P2'
)
  AND NOT EXISTS (
      SELECT 1
      FROM Turma t
      WHERE t.localTurma = CONCAT('Turma demo - ', d.codDisciplina)
        AND t.idCurso = c.idCurso
  );

INSERT INTO ProfessorTurma (
    idProfessor,
    idTurma,
    codDisciplina
)
SELECT
    pr.idProfessor,
    t.idTurma,
    d.codDisciplina
FROM Professor pr
INNER JOIN Disciplina d
    ON d.codDisciplina IN (
        'FILTRO-ES-P2',
        'FILTRO-ADM-P2'
    )
INNER JOIN Turma t
    ON t.idCurso = d.idCurso
   AND t.localTurma = CONCAT('Turma demo - ', d.codDisciplina)
WHERE pr.email = 'professor.indicadores@example.invalid'
  AND NOT EXISTS (
      SELECT 1
      FROM ProfessorTurma pt
      WHERE pt.idProfessor = pr.idProfessor
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
    dados.nome,
    NULL,
    dados.email,
    dados.numeroMatricula,
    c.idCurso,
    p.idPeriodo
FROM (
    SELECT 'Aluno Demo Engenharia de Software P2-01' AS nome,
           'demo-filtro-es-p2-01@example.invalid' AS email,
           'DEMO-FILTRO-ES-P2-01' AS numeroMatricula,
           @curso_es AS nomeCurso
    UNION ALL
    SELECT 'Aluno Demo Engenharia de Software P2-02',
           'demo-filtro-es-p2-02@example.invalid',
           'DEMO-FILTRO-ES-P2-02',
           @curso_es
    UNION ALL
    SELECT 'Aluno Demo Engenharia de Software P2-03',
           'demo-filtro-es-p2-03@example.invalid',
           'DEMO-FILTRO-ES-P2-03',
           @curso_es
    UNION ALL
    SELECT 'Aluno Demo Administracao P2-01',
           'demo-filtro-adm-p2-01@example.invalid',
           'DEMO-FILTRO-ADM-P2-01',
           @curso_adm
    UNION ALL
    SELECT 'Aluno Demo Administracao P2-02',
           'demo-filtro-adm-p2-02@example.invalid',
           'DEMO-FILTRO-ADM-P2-02',
           @curso_adm
    UNION ALL
    SELECT 'Aluno Demo Administracao P2-03',
           'demo-filtro-adm-p2-03@example.invalid',
           'DEMO-FILTRO-ADM-P2-03',
           @curso_adm
) AS dados
INNER JOIN Curso c
    ON c.nomeCurso = dados.nomeCurso
INNER JOIN Periodo p
    ON p.idCurso = c.idCurso
   AND p.numeroPeriodo = 2
WHERE NOT EXISTS (
    SELECT 1
    FROM Aluno a
    WHERE a.numeroMatricula = dados.numeroMatricula
);

INSERT INTO Matricula (
    statusMatricula,
    idAluno,
    codDisciplina,
    idTurma
)
SELECT
    dados.statusMatricula,
    a.idAluno,
    d.codDisciplina,
    t.idTurma
FROM (
    SELECT 'DEMO-FILTRO-ES-P2-01' AS numeroMatricula,
           'FILTRO-ES-P2' AS codDisciplina,
           'CURSANDO' AS statusMatricula
    UNION ALL
    SELECT 'DEMO-FILTRO-ES-P2-02', 'FILTRO-ES-P2', 'REPROVADO'
    UNION ALL
    SELECT 'DEMO-FILTRO-ES-P2-03', 'FILTRO-ES-P2', 'TRANCADO'
    UNION ALL
    SELECT 'DEMO-FILTRO-ADM-P2-01', 'FILTRO-ADM-P2', 'CURSANDO'
    UNION ALL
    SELECT 'DEMO-FILTRO-ADM-P2-02', 'FILTRO-ADM-P2', 'APROVADO'
    UNION ALL
    SELECT 'DEMO-FILTRO-ADM-P2-03', 'FILTRO-ADM-P2', 'JUSTIFICADO'
) AS dados
INNER JOIN Aluno a
    ON a.numeroMatricula = dados.numeroMatricula
INNER JOIN Disciplina d
    ON d.codDisciplina = dados.codDisciplina
INNER JOIN Turma t
    ON t.idCurso = d.idCurso
   AND t.localTurma = CONCAT('Turma demo - ', d.codDisciplina)
WHERE NOT EXISTS (
    SELECT 1
    FROM Matricula m
    WHERE m.idAluno = a.idAluno
      AND m.codDisciplina = d.codDisciplina
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
    'Avaliacao demo',
    'Registro sintetico para validar os indicadores por periodo curricular.',
    '2026-03-15',
    10.00,
    100.00,
    pt.idProfessorTurma
FROM ProfessorTurma pt
WHERE pt.codDisciplina IN (
    'FILTRO-ES-P2',
    'FILTRO-ADM-P2'
)
  AND NOT EXISTS (
      SELECT 1
      FROM Avaliacao av
      WHERE av.idProfessorTurma = pt.idProfessorTurma
        AND av.titulo = 'Avaliacao demo'
  );

INSERT INTO Nota (
    valor,
    observacao,
    idAvaliacao,
    idMatricula
)
SELECT
    dados.valor,
    'Nota sintetica para teste de consolidacao.',
    av.idAvaliacao,
    m.idMatricula
FROM (
    SELECT 'DEMO-FILTRO-ES-P2-01' AS numeroMatricula,
           'FILTRO-ES-P2' AS codDisciplina,
           8.50 AS valor
    UNION ALL
    SELECT 'DEMO-FILTRO-ES-P2-02', 'FILTRO-ES-P2', 4.00
    UNION ALL
    SELECT 'DEMO-FILTRO-ADM-P2-01', 'FILTRO-ADM-P2', 7.50
    UNION ALL
    SELECT 'DEMO-FILTRO-ADM-P2-02', 'FILTRO-ADM-P2', 9.00
) AS dados
INNER JOIN Aluno a
    ON a.numeroMatricula = dados.numeroMatricula
INNER JOIN Matricula m
    ON m.idAluno = a.idAluno
   AND m.codDisciplina = dados.codDisciplina
INNER JOIN Avaliacao av
    ON av.titulo = 'Avaliacao demo'
INNER JOIN ProfessorTurma pt
    ON pt.idProfessorTurma = av.idProfessorTurma
   AND pt.codDisciplina = dados.codDisciplina
   AND pt.idTurma = m.idTurma
WHERE NOT EXISTS (
    SELECT 1
    FROM Nota n
    WHERE n.idAvaliacao = av.idAvaliacao
      AND n.idMatricula = m.idMatricula
);

INSERT INTO Aula (
    dataAula,
    conteudo,
    idProfessorTurma
)
SELECT
    dados.dataAula,
    dados.conteudo,
    pt.idProfessorTurma
FROM (
    SELECT 'FILTRO-ES-P2' AS codDisciplina,
           '2026-03-02' AS dataAula,
           'Aula demo 1' AS conteudo
    UNION ALL
    SELECT 'FILTRO-ES-P2', '2026-03-09', 'Aula demo 2'
    UNION ALL
    SELECT 'FILTRO-ADM-P2', '2026-03-02', 'Aula demo 1'
    UNION ALL
    SELECT 'FILTRO-ADM-P2', '2026-03-09', 'Aula demo 2'
) AS dados
INNER JOIN ProfessorTurma pt
    ON pt.codDisciplina = dados.codDisciplina
WHERE NOT EXISTS (
    SELECT 1
    FROM Aula au
    WHERE au.idProfessorTurma = pt.idProfessorTurma
      AND au.conteudo = dados.conteudo
);

INSERT INTO Frequencia (
    statusFrequencia,
    observacao,
    idAula,
    idMatricula
)
SELECT
    CASE
        WHEN a.numeroMatricula LIKE '%-03' THEN 'FALTA'
        WHEN au.conteudo = 'Aula demo 1' THEN 'PRESENTE'
        ELSE 'JUSTIFICADA'
    END,
    'Frequencia sintetica para teste de consolidacao.',
    au.idAula,
    m.idMatricula
FROM Matricula m
INNER JOIN Aluno a
    ON a.idAluno = m.idAluno
INNER JOIN Aula au
    ON au.idProfessorTurma IN (
        SELECT pt.idProfessorTurma
        FROM ProfessorTurma pt
        WHERE pt.idTurma = m.idTurma
          AND pt.codDisciplina = m.codDisciplina
    )
WHERE m.codDisciplina IN (
    'FILTRO-ES-P2',
    'FILTRO-ADM-P2'
)
  AND NOT EXISTS (
      SELECT 1
      FROM Frequencia f
      WHERE f.idAula = au.idAula
        AND f.idMatricula = m.idMatricula
  );

COMMIT;
