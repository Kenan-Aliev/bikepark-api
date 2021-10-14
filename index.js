const express = require('express')
const server = express()
const mongoose = require("mongoose")
require('dotenv').config()
const messages = require("./messages/index")
const authRoutes = require('./routes/auth')
const bikeRoutes = require('./routes/bike.js')
const cors = require('cors')

const PORT = process.env.PORT || 8080
const dbUrl = process.env.DB_URL


server.use(express.json())
server.use(cors())

server.use('/auth', authRoutes)
server.use('/bike', bikeRoutes)


const start = () => {
    mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error) => {
            if (error) {
                console.log(messages.server.mongoErrors.connectionError)
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