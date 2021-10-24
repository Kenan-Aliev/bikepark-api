const {Router} = require('express')
const router = Router()
const Bike = require('../models/bike')
const adminMiddleware = require('../middlewares/admin')
const messages = require('../messages/index')

router.post('/add', adminMiddleware, async (req, res) => {
    const {name, brand, img, price, color, frameMaterial, frameSize, wheelsSize} = req.body
    try {
        const candidate = await Bike.findOne({name: name.toLowerCase().trim()})
        if (candidate) {
            return res.status(400).json({message: messages.bike.admin.bikeExists})
        }
        const newBike = new Bike({
            name: name.toLowerCase().trim(),
            brand: brand.trim(),
            img,
            price,
            color,
            frameMaterial,
            frameSize,
            wheelsSize
        })
        await newBike.save()
        return res.status(200).json({message: messages.bike.admin.successAdd})
    } catch (error) {
        return res.status(500).json({message: messages.server.error, error})
    }

})


router.get('/getAll', (req, res) => {
    Bike.find({}, (err, result) => {
        if (err) {
            return res.status(500).json({message: messages.server.error, err})
        }
        result = result.map((bike) => {
            if (bike.name.includes(' ')) {
                const bikeName = bike.name.split(' ').map((word) => word[0].toUpperCase() + word.substr(1)).join(' ')
                return {...bike, name: bikeName}
            } else {
                const bikeName = bike.name[0].toUpperCase() + bike.name.substr(1)
                return {...bike, name: bikeName}
            }
        })
        return res.status(200).json({bikes: result})
    })
        .lean()
})


module.exports = router