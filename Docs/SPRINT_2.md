# ChironAcademy — Sprint 2

## Estado inicial

A Sprint 1 é a baseline estável do projeto.

Entregue na Sprint 1:

- autenticação e autorização por perfil;
- PBIs 01–12;
- CRUDs acadêmicos do Gestor;
- vínculos e matrículas;
- área do Professor;
- avaliações;
- notas;
- aulas e frequência;
- integração React → REST API → Express → MySQL;
- suíte de desenvolvimento com baseline de 89 testes aprovados.

## Regra para a Sprint 2

Este arquivo não define funcionalidades novas.

Os PBIs da Sprint 2 devem vir do backlog oficial do projeto. Não criar por conta própria:

- entidades;
- campos;
- regras de negócio;
- dashboards;
- analytics;
- gráficos;
- funcionalidades de LMS;
- alterações de perfil ou autorização.

## Fluxo de implementação

Para cada PBI da Sprint 2:

```text
PBI
↓
User Story
↓
Critérios de aceite
↓
Impacto no banco
↓
Backend / autorização
↓
Service
↓
Frontend
↓
Testes
↓
Commit
```

### 1. Requisitos

Registrar:

- nome do PBI;
- persona;
- User Story;
- CA1 — fluxo principal;
- CA2 — erro/exceção;
- dependências com PBIs anteriores.

### 2. Banco

Alterar o schema somente quando o PBI exigir.

Antes de criar uma entidade ou coluna nova, confirmar que ela está prevista na especificação.

### 3. Backend

Manter o padrão atual:

```text
routes/
controllers/
middlewares/
config/
```

A autorização deve continuar sendo validada no backend.

### 4. Front-End

Manter:

```text
pages/
services/
components/
```

Requisições HTTP continuam na camada `services/`.

### 5. Testes

A Sprint 1 possui baseline de:

```text
89 PASS
0 FAIL
0 SKIP
```

Antes de integrar um PBI da Sprint 2:

- garantir que a baseline anterior continua funcionando;
- adicionar testes do novo PBI quando o fluxo estiver concluído;
- testar autorização;
- testar fluxo principal;
- testar pelo menos uma exceção relevante.

## Branch

Desenvolvimento da Sprint 2:

```text
feature/sprint-2
```

A `main` continua sendo a linha estável.

## Próximo passo

Adicionar aqui os PBIs oficiais da Sprint 2 assim que forem fornecidos pelo professor/Trello.

### Backlog oficial da Sprint 2

```text
A DEFINIR A PARTIR DA ESPECIFICAÇÃO OFICIAL.
```
