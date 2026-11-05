USE chironAcademyData;
INSERT INTO Usuario (email, senhaHash, perfil, recoveryTokenHash, ativo) VALUES ('gestor@chiron.com', '$2b$12$PbH9LC149KMWiiilNmnuM.0/olPgrki9z13hl6xIAjQN5D8b/6XrG', 'GESTOR', 'e449ffe0069bfcfd03fa54fabecbdd6000cb6a354ddd4b38fe076921bbabc617', 1);
SELECT * FROM Usuario;
