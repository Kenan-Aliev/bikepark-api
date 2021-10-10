const {body} = require('express-validator')
const User = require('../models/usersModel')

exports.registerValidators = [

    body('email', 'Введите корректный email')
        .isEmail().custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.reject('Такой email уже занят')
            }
        } catch (e) {
            console.log(e)
        }
    })
        .normalizeEmail(),

    body('username', 'Имя должно быть больше 3 и меньше 15 символов')
        .isLength({min: 3, max: 15}).isAlphanumeric().trim().custom(async (value, {req}) => {
        try {
            const user = await User.findOne({username: value})
            if (user) {
                return Promise.reject("Такой никнейм уже занят")
            }
        } catch (error) {
            console.log(error)
        }
    }),

    body('phone').isString().withMessage('Номер должен быть в виде строки').isLength({
        min: 18,
        max: 18
    }).withMessage('Длина должна быть 18 символов').custom((value, {req}) => {
        const rgx = /^\+\([0-9]{3}\)-[0-9]{3}-[0-9]{3}-[0-9]{3}$/
        if (rgx.test(value)) {
            return true
        } else {
            throw new Error('Введите правильно номер. Пример: +(996)-553-484-837')
        }
    }),

    body('password')
        .isLength({min: 6, max: 56}).withMessage('Пароль должен быть минимум 6 символов').isAlphanumeric().trim()
]