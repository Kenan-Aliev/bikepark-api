const express = require('express')
const server = express()
const mongoose = require("mongoose")
require('dotenv').config()
const Errors = require("./errors/index")


const PORT = process.env.PORT || 8080
const dbUrl = process.env.DB_URL


const start = async () => {
    try {
        await mongoose.connect(dbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        server.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`)
        })
    } catch (error) {
        error = new Errors('MONGO_ERROR', 'Ошибка подключения к базе данных')
        console.log(error.message)
    }

}
start()