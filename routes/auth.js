const {Router} = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const User = require('../models/usersModel')
const {registerValidators} = require('../utils/validators')
const router = Router()

router.post('/registration', registerValidators,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            console.log(errors)
            if (!errors.isEmpty()) {
                return res.status(422).send({message: errors.array()[0].msg})
            }

        } catch (error) {

        }
    })

module.exports = router

