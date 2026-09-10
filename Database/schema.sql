CREATE DATABASE IF NOT EXISTS chironAcademyData;
USE chironAcademyData;
CREATE TABLE IF NOT EXISTS Usuario (
    idUsuario BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,
    senhaHash VARCHAR(255) NOT NULL,

    perfil ENUM(
        'GESTOR',
        'PROFESSOR',
        'ALUNO'
    ) NOT NULL,
    recoveryTokenHash CHAR(64) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updatedAt TIMESTAMP NOT NULL
    DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_usuario_email
    UNIQUE (email),

    CONSTRAINT uq_usuario_recovery_token
    UNIQUE (recoveryTokenHash)
);
CREATE TABLE IF NOT EXISTS Curso (
    idCurso INT AUTO_INCREMENT PRIMARY KEY,

    nomeCurso VARCHAR(150) NOT NULL,

    modalidade ENUM(
        'PRESENCIAL',
        'EAD',
        'HIBRIDO'
    ) NOT NULL,

    duracaoSemestres INT NOT NULL
);
CREATE TABLE IF NOT EXISTS Periodo (
    idPeriodo INT AUTO_INCREMENT PRIMARY KEY,

    numeroPeriodo INT NOT NULL,

    nomePeriodo VARCHAR(100) NOT NULL,

    idCurso INT NOT NULL,

    CONSTRAINT fk_periodo_curso
        FOREIGN KEY (idCurso)
        REFERENCES Curso(idCurso)
);
CREATE TABLE IF NOT EXISTS Turma (
    idTurma INT AUTO_INCREMENT PRIMARY KEY,

    localTurma VARCHAR(150) NOT NULL,

    turnoTurma ENUM(
        'MANHA',
        'TARDE',
        'NOITE'
    ) NOT NULL,

    idCurso INT NOT NULL,

    CONSTRAINT fk_turma_curso
        FOREIGN KEY (idCurso)
        REFERENCES Curso(idCurso)
);

CREATE TABLE IF NOT EXISTS Disciplina (
    codDisciplina VARCHAR(50) PRIMARY KEY,

    nomeDisciplina VARCHAR(150) NOT NULL,

    tipoDisciplina ENUM(
        'OBRIGATORIA',
        'OPTATIVA'
    ) NOT NULL,

    cargaHoraria INT NOT NULL,

    idPeriodo INT NOT NULL,

    idCurso INT NOT NULL,

    CONSTRAINT fk_disciplina_periodo
        FOREIGN KEY (idPeriodo)
        REFERENCES Periodo(idPeriodo),

    CONSTRAINT fk_disciplina_curso
        FOREIGN KEY (idCurso)
        REFERENCES Curso(idCurso)
);

CREATE TABLE IF NOT EXISTS Professor (
    idProfessor INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    telefone VARCHAR(20),

    email VARCHAR(255) NOT NULL,

    CONSTRAINT uq_professor_email
        UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS ProfessorTurma (
    idProfessorTurma INT AUTO_INCREMENT PRIMARY KEY,

    idProfessor INT NOT NULL,

    idTurma INT NOT NULL,

    codDisciplina VARCHAR(50) NOT NULL,

    CONSTRAINT fk_professor_turma_professor
        FOREIGN KEY (idProfessor)
        REFERENCES Professor(idProfessor),

    CONSTRAINT fk_professor_turma_turma
        FOREIGN KEY (idTurma)
        REFERENCES Turma(idTurma),

    CONSTRAINT fk_professor_turma_disciplina
        FOREIGN KEY (codDisciplina)
        REFERENCES Disciplina(codDisciplina)
);
CREATE TABLE IF NOT EXISTS Aluno (
    idAluno INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,

    telefone VARCHAR(20),

    email VARCHAR(255) NOT NULL,

    numeroMatricula VARCHAR(50) NOT NULL,

    idCurso INT NOT NULL,

    idPeriodo INT NOT NULL,

    CONSTRAINT uq_aluno_matricula
        UNIQUE (numeroMatricula),

    CONSTRAINT uq_aluno_email
        UNIQUE (email),

    CONSTRAINT fk_aluno_curso
        FOREIGN KEY (idCurso)
        REFERENCES Curso(idCurso),

    CONSTRAINT fk_aluno_periodo
        FOREIGN KEY (idPeriodo)
        REFERENCES Periodo(idPeriodo)
);
INSERT INTO Curso (
    nomeCurso,
    modalidade,
    duracaoSemestres
)
VALUES (
    'Engenharia de Software',
    'PRESENCIAL',
    8
);
SELECT * FROM Curso;
INSERT INTO Periodo (
    numeroPeriodo,
    nomePeriodo,
    idCurso
)
VALUES (
    1,
    '1º Período',
    1
);
INSERT INTO Aluno (
    nome,
    telefone,
    email,
    numeroMatricula,
    idCurso,
    idPeriodo
)
VALUES (
    'Aluno Teste',
    '41999999999',
    'aluno@chiron.com',
    '20260001',
    1,
    1
);
SELECT * FROM Aluno;
SELECT * FROM Usuario;