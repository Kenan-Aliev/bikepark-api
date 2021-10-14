const {Schema, model} = require('mongoose')


const bikeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = model('bikes', bikeSchema)