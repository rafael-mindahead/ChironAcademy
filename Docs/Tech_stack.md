# Project Versions

## Runtime
- Node.js: 24.18.0 LTS
- npm: verificar com `npm -v`

## Frontend
- React: 19.2.8
- React DOM: 19.2.8
react
react-dom
vite
@vitejs/plugin-react
tailwindcss
@tailwindcss/vite
lucide-react
tw-animate-css usados no projeto
npm install react-router-dom

## Backend
- Node.js: 24.19.0 LTS
 npm install express mysql2 cors dotenv bcryptjs jsonwebtoken
 npm install -D nodemon

DOCKER:
Docker version 29.6.1, build 8900f1d
PARA INICIAR docker compose up -d --build
CONFERIR:
docker ps
DEVERA APARECER ALGO ASSIM:
chiron_academy_backend
chiron_academy_database
Criar a tabela no MySQL que já está rodando
docker compose exec database mysql -uroot -proot chironAcademyData
mysql>
cole a table 
se der certo
Query OK
SHOW TABLES;
mostra a table
DESCRIBE Usuario;
para sair
exit;
--Por que não existe senha?
--O backend vai transformar a senha usando bcryptjs:
--senhaHash e o mesmo para a chave de recuperacao

## Version commands

Node:
`node -v`

npm:
`npm -v`

React:
`npm list react`

React DOM:
`npm list react-dom`