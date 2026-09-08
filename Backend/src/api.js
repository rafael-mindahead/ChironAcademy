console.log("bem vindo ao inicio do backend")

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import database from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import cursoRoutes from './routes/cursoRoutes.js'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursoRoutes)


app.get('/', (req, res)=>{
    res.json({
        sistema: 'ChironAcademy',
        api: 'Online'
    })
})
app.get('/api/health', (req, res)=>{
    res.status(200).json({
        status: 'ok',
        messagem: 'API esta funcionando'
    })
})

app.get('/api/database/health', async(req, res)=>{
    try{
        const [resultado] = await database.query('SELECT DATABASE() AS banco,NOW() AS horario')
            res.status(200).json({
                status: 'ok',
                message: 'conexao MYSQL esta funcionando',
                database: resultado[0].banco,
                horario: resultado[0].horario
            })
    } catch (error) {
        console.error('Erro ao verificar a conexão com o banco de dados:', error);
        res.status(500).json({
            status: 'error',
            message: 'nao foi possivel conectar ao banco de dados'
        })
    }
})
app.listen(PORT,()=>{
    console.log('servidor rodando na porta: '+ PORT)
})