const express = require('express')
const server = express()
const mongoose = require("mongoose")
require('dotenv').config()
const Errors = require("./errors/index")
const authRoutes = require('./routes/auth')

const PORT = process.env.PORT || 8080
const dbUrl = process.env.DB_URL


server.use(express.json())


server.use('/auth', authRoutes)


const start = () => {
    mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error) => {
            if (error) {
                console.log(error)
                error = Errors.asyncError('Ошибка подключения к базе данных')
                error.catch(error => console.log(error))
            } else {
                server.listen(PORT, () => {
                        console.log(`Сервер запущен на порту ${PORT}`)
                    }
                )
            }
        }
    )
}

start()