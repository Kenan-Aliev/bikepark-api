const express = require('express')
const server = express()
const mongoose = require("mongoose")
require('dotenv').config()
const messages = require("./messages/index")
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
                console.log(messages.mongoErrors.connectionError)
            } else {
                server.listen(PORT, () => {
                        console.log(`${messages.server.started} ${PORT}`)
                    }
                )
            }
        }
    )
}

start()