const {Router} = require('express')
const router = Router()
const Bike = require('../models/bike')
const adminMiddleware = require('../middlewares/admin')

router.post('/add', adminMiddleware, async (req, res) => {
    const {name, brand, img, price} = req.body
    try {
        const candidate = await Bike.findOne({name: name.toLowerCase().trim()})
        if (candidate) {
            return res.status(400).json({message: "Велосипед с таким названием уже существует"})
        }
        const newBike = new Bike({name: name.toLowerCase().trim(), brand: brand.trim(), img, price})
        await newBike.save()
        return res.status(200).json({message: "Вы успешно добавили новый товар"})
    } catch (error) {
        return res.status(500).json({message: 'Что-то пошло не так', error})
    }

})


router.get('/getAll', (req, res) => {
    Bike.find({}, (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Что-то пошло не так', err})
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