# ChironAcademy

> Academic management platform focused on operational organization, role-based access and future educational data intelligence.

ChironAcademy is a full-stack web application designed to centralize and manage academic information such as courses, academic periods, disciplines, classes, professors, students, enrollments, assessments, grades and attendance.

The project is currently being developed as part of a Software Engineering academic project using an incremental, Sprint-based approach.

---

## Project Overview

ChironAcademy aims to provide a clean and structured academic management environment for three main user profiles:

- Academic Manager
- Professor
- Student

The system is not intended to be an LMS such as Moodle or Google Classroom.

Its main purpose is academic administration and data organization.

Future versions may include analytical features, but Sprint 1 is focused on building the operational foundation of the platform.

---

## Current Development Status

### Authentication and Authorization

The authentication infrastructure is currently implemented.

Features include:

- User registration
- Login with email and password
- Password hashing using bcrypt
- JWT authentication
- Session management
- Logout
- Protected routes
- Role-based authorization
- Password recovery
- Backend-generated recovery keys
- Recovery key hashing
- Recovery key invalidation after password reset
- Account validation based on academic records

The application currently supports the following roles:

```text
GESTOR
PROFESSOR
ALUNO
Recovery Key System

During account registration, the Back-End generates a unique recovery key.

Example:

CHIRON-XXXX-XXXX-XXXX-XXXX

The original recovery key is shown to the user only when it is generated.

The database stores only its cryptographic hash.

Password recovery follows this flow:
Email
  ↓
Recovery Key
  ↓
New Password
  ↓
Back-End validation
  ↓
Password updated
  ↓
Old Recovery Key invalidated
  ↓
New Recovery Key generated
Passwords are never stored as plain text.
ech Stack
Front-End
React
JavaScript / JSX
Vite
Tailwind CSS
React Router DOM
Lucide React
Fetch API
Back-End
Node.js
Express.js
bcryptjs
JSON Web Token
dotenv
CORS
Database
MySQL 8.4
mysql2
Infrastructure
Docker
Docker Compose
Version Control
Git
GitHub
Architecture

The application follows a separated Front-End, Back-End and Database architecture.

Browser
   │
   ▼
React + Vite
   │
   │ HTTP / REST
   ▼
Node.js + Express
   │
   ▼
MySQL
Authentication flow:

React
   ↓
POST /api/auth/login
   ↓
Express
   ↓
MySQL
   ↓
bcrypt.compare()
   ↓
JWT
   ↓
React Session
ChironAcademy/
│
├── Backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── api.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── Database/
│   └── schema.sql
│
├── Docs/
│   ├── Frontend_Context.md
│   └── screenshots/
│
├── Frontend/
│   └── pages/
│       └── ChironAcademy/
│           │
│           ├── src/
│           │   ├── assets/
│           │   ├── components/
│           │   ├── pages/
│           │   ├── services/
│           │   ├── App.jsx
│           │   ├── index.css
│           │   └── main.jsx
│           │
│           ├── package.json
│           └── vite.config.js
│
├── docker-compose.yml
├── Dockerfile
├── .gitignore
└── README.md
Front-End Design System

The ChironAcademy interface follows a dark, minimalistic and academic visual identity.

Main characteristics:

Dark backgrounds
Graphite surfaces
Off-white typography
Gold / beige accent colors
Minimal use of saturated colors
Clean layouts
Subtle borders
Reusable components
Responsive interfaces

The visual identity is inspired by the Greek origin of the name Chiron, but references are intentionally subtle.

The application avoids excessive decorative elements, gaming aesthetics or overly colorful interfaces.

Screenshots
Home

Login

Registration

Password Recovery

Current Pages

The Front-End currently contains:

Home
Login
Registration
Password Recovery
Access Denied
Internal Area
Student Area
Professor Area
Academic Manager Area

Protected routes prevent users from accessing areas outside their role.

Example:

ALUNO
  ↓
/sistema/aluno       ✅

/sistema/professor   ❌

/sistema/gestor      ❌

The Back-End performs the same authorization validation independently.

API

Current authentication routes:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/recover

GET /api/auth/me

Development authorization test routes:

GET /api/auth/test/aluno
GET /api/auth/test/professor
GET /api/auth/test/gestor

Health endpoints:

GET /api/health
GET /api/database/health
Database

Current main authentication table:

Usuario

Important fields include:

idUsuario
email
senhaHash
perfil
recoveryTokenHash
ativo
createdAt
updatedAt

Academic entities currently include:

Curso
Periodo
Professor
Aluno

Additional entities will be introduced according to the Sprint 1 requirements.

Sprint 1

Sprint 1 focuses on the operational foundation of ChironAcademy.

The Product Backlog Items are implemented in the following order:

01 - MANTER CADASTRO DE CURSOS

02 - MANTER CADASTRO DE PERÍODOS ACADÊMICOS

03 - MANTER CADASTRO DE DISCIPLINAS

04 - MANTER CADASTRO DE TURMAS

05 - MANTER CADASTRO DE PROFESSORES

06 - MANTER CADASTRO DE ALUNOS

07 - VINCULAR PROFESSOR À TURMA/DISCIPLINA

08 - MATRICULAR ALUNO EM TURMA/DISCIPLINA

09 - CONSULTAR TURMAS SOB RESPONSABILIDADE

10 - MANTER CADASTRO DE AVALIAÇÕES DA TURMA

11 - REGISTRAR NOTAS DOS ALUNOS

12 - REGISTRAR FREQUÊNCIA DOS ALUNOS

A "MANTER CADASTRO" PBI represents a complete CRUD operation:

Create
Read
Update
Delete
Next Milestone

The authentication and authorization foundation is nearly complete.

The next main development milestone is:

PBI 01
MANTER CADASTRO DE CURSOS

This module will introduce the first complete academic CRUD integrated across:

React
   ↓
REST API
   ↓
Express
   ↓
MySQL
Running the Project
Requirements

Make sure you have installed:

Git
Node.js
npm
Docker
Docker Compose
Clone the repository
git clone https://github.com/rafael-mindahead/ChironAcademy.git

Enter the project:

cd ChironAcademy
Environment Variables

Create a .env file in the project root:

JWT_SECRET=your_secure_development_secret

The .env file must never be committed to GitHub.

The Front-End also uses an environment variable for the API URL.

Inside:

Frontend/pages/ChironAcademy/

create:

VITE_API_URL=http://localhost:3000
Start Back-End and Database

Make sure Docker Desktop is running.

From the project root:

docker compose up --build

The services will be available at:

Back-End:
http://localhost:3000

MySQL:
localhost:3306

Test the API:

http://localhost:3000/api/health

Test the database connection:

http://localhost:3000/api/database/health
Start the Front-End

Open another terminal:

cd Frontend/pages/ChironAcademy

Install dependencies:

npm ci

Start Vite:

npm run dev

Vite will display the local URL, usually:

http://localhost:5173
Security Concepts Implemented

ChironAcademy currently applies several security practices:

Password hashing
JWT authentication
Role-based authorization
Protected API endpoints
Protected Front-End routes
Recovery key hashing
Recovery key rotation
Generic authentication error messages
Environment variables for secrets
Back-End validation of permissions
Separation between academic records and authentication

The project is still under development and should not yet be considered production-ready.

Development Principles

The project follows several architectural principles:

Separation of concerns
Reusable Front-End components
Centralized API services
Environment-based configuration
Back-End authorization
Consistent UI patterns
Incremental development
Sprint-based delivery
Git-based version control
Front-End Development Context

The project includes a shared Front-End context file:

Docs/Frontend_Context.md

This document should be used by all team members and AI-assisted development tools before generating new interfaces or Front-End code.

Its purpose is to ensure consistency across:

visual identity
component structure
routing
API integration
authentication
role-based access
CRUD patterns
responsive behavior
Sprint scope

All contributors should follow the same design system and architecture so every page feels like part of the same application.

Contributors

Developed as an academic Software Engineering project.

Team
Rafael Alves
Vinicius
carlos gabriel
PucPR

[INSTITUTION NAME]

Repository

GitHub:

https://github.com/rafael-mindahead/ChironAcademy

Project Status

🚧 ChironAcademy is currently under active development.

Current focus:

Authentication & Authorization ✅

Academic Management Modules 🚧
Sprint 1 🚧
License

This project was created for educational and academic purposes.

License information may be added as the project evolves.