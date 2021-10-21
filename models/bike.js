const {Schema, model} = require('mongoose')


const bikeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String
    },
    brand: {
        type: String,
        required: true
    },
    isRented: {
        type: Boolean,
        default: false
    },
    rentedAmount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = model('bikes', bikeSchema)