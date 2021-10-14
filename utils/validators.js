const {body} = require('express-validator')
const User = require('../models/user')
const messages = require('../messages/index')

exports.registerValidators = [

    body('email')
        .isEmail().withMessage(messages.auth.registration.validation.correctEmail).custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.reject(messages.auth.registration.validation.emailExists)
            }
        } catch (e) {
            console.log(e)
        }
    })
        .normalizeEmail(),

    body('username')
        .isLength({
            min: 3,
            max: 15
        }).withMessage(messages.auth.registration.validation.usernameLength).isAlphanumeric().trim().custom(async (value, {req}) => {
        try {
            const user = await User.findOne({username: value})
            if (user) {
                return Promise.reject(messages.auth.registration.validation.usernameExists)
            }
        } catch (error) {
            console.log(error)
        }
    }),

    body('phone').isString().withMessage(messages.auth.registration.validation.phoneIsString).custom((value, {req}) => {
        const rgx = /^\+996(\d{9})$/
        if (rgx.test(value)) {
            return true
        } else {
            throw new Error(messages.auth.registration.validation.inputCorrectPhone)
        }
    }),

    body('password')
        .isLength({
            min: 6,
            max: 56
        }).withMessage(messages.auth.registration.validation.passwordLength).isAlphanumeric().trim()
]