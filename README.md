# ChironAcademy

ChironAcademy is a full-stack academic management platform built to organize academic operations, enforce role-based access and provide students and professors with structured academic information.

The project is developed as part of a Software Engineering academic project using an incremental, Sprint-based workflow.

## Current Status

Sprint 1 established the operational foundation of the platform and is complete.

Sprint 2 is currently in development.

### Sprint 2 — Rafael Alves scope

Completed:

- Consult enrolled disciplines
- Consult performance by discipline
- Track academic progress throughout the period

Next:

- Consult student performance — Professor

The current student area already supports:

- authenticated access;
- period selection;
- enrolled discipline listing;
- performance details by discipline;
- grades already registered;
- accumulated attendance records;
- partial-data handling;
- chronological academic progress timeline.

## User Roles

The application supports three profiles:

```text
GESTOR
PROFESSOR
ALUNO
```

Authorization is validated both in the Front-End and in the Back-End.

## Main Features

### Authentication

- User registration
- Login with e-mail and password
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- Role-based authorization
- Password recovery
- Recovery key hashing and rotation
- Session validation

### Academic Manager

- Courses
- Academic periods
- Disciplines
- Classes
- Professors
- Students
- Professor/class/discipline assignments
- Student enrollments

### Professor

- Consult assigned classes
- Manage assessments
- Register and update grades
- Manage classes/lessons
- Register and update attendance

### Student

- Consult enrolled disciplines
- Filter disciplines by academic period
- Consult grades and attendance by discipline
- View partial academic data without fabricated estimates
- Track academic progress chronologically

## Architecture

```text
Browser
   |
   v
React + Vite
   |
   | HTTP / REST
   v
Node.js + Express
   |
   v
MySQL 8.4
```

The project keeps Front-End, Back-End and Database responsibilities separated.

## Tech Stack

### Front-End

- React 19
- JavaScript / JSX
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Fetch API

### Back-End

- Node.js
- Express.js
- bcryptjs
- JSON Web Token
- dotenv
- CORS
- mysql2

### Database

- MySQL 8.4
- UTF-8 / utf8mb4

### Infrastructure and Tooling

- Docker
- Docker Compose
- Git
- GitHub
- GitHub Actions

## Project Structure

```text
ChironAcademy/
|
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── api.js
│   ├── package.json
│   └── package-lock.json
|
├── Database/
│   ├── schema.sql
│   └── seed.sql
|
├── Docs/
│   ├── PROVA_AUTORIA.md
│   ├── SPRINT_2.md
│   ├── Tech_stack.md
│   ├── promptContext.md
│   └── promptStyleContext.md
|
├── Frontend/
│   └── pages/
│       └── ChironAcademy/
│           ├── src/
│           │   ├── assets/
│           │   ├── components/
│           │   ├── pages/
│           │   ├── services/
│           │   ├── App.jsx
│           │   ├── index.css
│           │   └── main.jsx
│           ├── package.json
│           └── vite.config.js
|
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── Dockerfile
├── LICENSE
└── README.md
```

## Database Model

The academic model currently includes:

- Usuario
- Curso
- Periodo
- Disciplina
- Turma
- Professor
- ProfessorTurma
- Aluno
- Matricula
- Avaliacao
- Nota
- Aula
- Frequencia

No additional table was required for the current Sprint 2 student features; they reuse the academic model established during Sprint 1.

## API Highlights

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/recover
GET  /api/auth/me
```

### Student

```http
GET /api/aluno/disciplinas
GET /api/aluno/disciplinas?periodo={idPeriodo}
GET /api/aluno/disciplinas/{idMatricula}/desempenho
GET /api/aluno/evolucao?periodo={idPeriodo}
```

### Health

```http
GET /api/health
GET /api/database/health
```

## Running the Project

### Requirements

Install:

- Git
- Node.js
- npm
- Docker
- Docker Compose

### Clone

```bash
git clone https://github.com/rafael-mindahead/ChironAcademy.git
cd ChironAcademy
```

### Environment

Create a `.env` file in the repository root:

```env
JWT_SECRET=your_secure_development_secret
```

The `.env` file must not be committed.

The Front-End accepts an optional API URL:

```env
VITE_API_URL=http://localhost:3000
```

### Start Database and Back-End

From the repository root:

```bash
docker compose up -d --build
```

Useful checks:

```bash
docker compose ps
docker compose logs backend --tail=50
```

Back-End:

```text
http://localhost:3000
```

### Load Seed Data

```bash
docker compose exec -T database \
mysql -uroot -proot chironAcademyData < Database/seed.sql
```

### Start Front-End

```bash
cd Frontend/pages/ChironAcademy
npm ci
npm run dev
```

Vite normally starts at:

```text
http://localhost:5173
```

## Continuous Integration

GitHub Actions validates the Sprint 2 branch and `main`.

The CI workflow currently checks:

```text
Back-End
- npm ci
- JavaScript syntax validation

Front-End
- npm ci
- npm run build
```

## Sprint 1 Baseline

Sprint 1 delivered PBIs 01–12:

1. Maintain courses
2. Maintain academic periods
3. Maintain disciplines
4. Maintain classes
5. Maintain professors
6. Maintain students
7. Assign professor to class/discipline
8. Enroll student
9. Consult professor classes
10. Manage assessments
11. Register grades
12. Register attendance

The development test suite reached:

```text
89 PASS
0 FAIL
0 SKIP
```

Sprint 2 automated tests are planned after completion of the current development scope.

## Security Practices

The project currently applies:

- password hashing;
- JWT authentication;
- role-based authorization;
- protected Front-End routes;
- protected API endpoints;
- recovery-key hashing;
- environment variables for secrets;
- Back-End permission validation;
- separation between authentication and academic records.

The project is still under active academic development and is not production-ready.

## Development Workflow

Development follows:

```text
PBI
  ↓
User Story
  ↓
Acceptance Criteria
  ↓
Database impact
  ↓
Back-End / authorization
  ↓
Service
  ↓
Front-End
  ↓
Validation
  ↓
Commit
```

Sprint 2 development branch:

```text
feature/sprint-2
```

The `main` branch remains the stable integration line.

## Contributors

Developed as an academic Software Engineering project at PUCPR.

Team:

- Rafael Alves
- Vinicius
- Carlos Gabriel

## Repository

https://github.com/rafael-mindahead/ChironAcademy

## License

This project is licensed under the MIT License.

See [LICENSE](LICENSE).
