const {Router} = require('express')
const router = Router()
const userMiddleware = require('../middlewares/user.js')
const User = require('../models/user')
const Bike = require('../models/bike.js')
const rand = require('random-key')
const messages = require('../messages/index')

router.post('/new', userMiddleware, async (req, res) => {
    const {bikes, madeAt, expiresAt} = req.body
    try {
        const user = await User.findOne({_id: req.user.id})
        for (let i = 0; i < bikes.length; i++) {
            const candidate = await Bike.findOne({_id: bikes[i].bikeId})
            if (candidate) {
                if (candidate.isRented) {
                    if (i !== 0) {
                        for (let j = 0; j < i; j++) {
                            const previousCandidate = await Bike.findOne({_id: bikes[j].bikeId})
                            if (previousCandidate) {
                                previousCandidate.isRented = false
                                previousCandidate.rentedAmount -= 1
                                await previousCandidate.save()
                            } else {
                                continue
                            }
                        }
                    }
                    return res.status(400).json({message: `Велосипед ${candidate.name} арендован`})
                } else {
                    candidate.isRented = true
                    candidate.rentedAmount += 1
                    await candidate.save()
                }
            } else {
                continue
            }
        }

        const totalPrice = bikes.reduce((acc, rec) => {
            return acc + rec.price
        }, 0)
        const orderNumber = rand.generateDigits(8)
        user.orders = [...user.orders, {
            bikes,
            orderNumber,
            totalPrice,
            madeAt,
            expiresAt
        }]

        await user.save()
        return res.status(200).json({message: messages.order.newOrder.success})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: messages.server.error, error})
    }
})


module.exports = router