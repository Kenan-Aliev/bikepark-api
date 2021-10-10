const {Router} = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const {validationResult} = require('express-validator')
const User = require('../models/usersModel')
const regEmail = require('../emails/registration')
const Errors = require('../errors/index')
const {registerValidators} = require('../utils/validators')
const router = Router()


const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS
        }
    }
    ,
    {
        from: `Bike Park <${process.env.EMAIL_FROM}>`
    }
)

router.post('/registration',
    registerValidators,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).send({message: errors.array()[0].msg})
            }
            const {email, username, phone, password} = req.body
            let error
            const emailExists = await User.findOne({email})
            if (emailExists) {
                error = Errors.userExists('Пользователь с таким email уже существует')
                return res.status(400).json({message: error.message})
            }
            const usernameExists = await User.findOne({username})
            if (usernameExists) {
                error = Errors.userExists('Пользователь с таким именем уже существует')
                return res.status(400).json({message: error.message})
            }
            const token = jwt.sign({email, username, phone, password}, process.env.SECRET_KEY, {expiresIn: '3m'})
            transporter.sendMail(regEmail(email, token), (err, info) => {
                if (err) {
                    return res.status(500).send({
                        message: "Не удалось отправить письмо на вашу почту",
                        err: err.message
                    })
                } else {
                    return res.status(200).json({
                        message: 'Проверьте ваш почтовый ящик, чтобы подтвердить регистрацию',
                        info
                    })

                }
            })
        } catch (error) {
            return res.status(500).json({message: 'Ошибка сервера', error})
        }

    })


router.post('/activation', async (req, res) => {
        const {token} = req.body
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.message.includes('jwt expired')) {
                    err = Errors.asyncError('Срок действия токена истек.Попробуйте заново заполнить форму регистрации')
                } else {
                    err = Errors.asyncError('Неверный токен')
                }
                err.catch(err => res.status(500).json({message: err}))
            } else {
                const {email, username, phone, password} = decoded
                bcrypt.hash(password, 8, (err, hashPassword) => {
                    if (err) {
                        return res.status(500).json({message: 'Ошибка кодировки пароля'})
                    } else {
                        const user = new User({email, username, phone, password: hashPassword}).save()
                        user.then(response => res.status(500).json({
                                message: 'Поздравляем! Вы успешно зарегистрировались на нашем сайте',
                                response
                            })
                        )
                        user.catch(err => res.status(500).json({
                            message: 'Ошибка сохранения пользователя в базе данных.Возможно вы уже зарегистрированы на нашем сайте',
                            err
                        }))
                    }
                })

            }
        })
    }
)


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (!candidate) {
            return res.status(400).json({message: 'Пользователя с таким email не существует'})
        }
        bcrypt.compare(password, candidate.password, (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Ошибка сравнения паролей', err})
            } else if (!result) {
                return res.status(400).json({message: "Вы ввели неверный пароль"})
            } else {
                const token = jwt.sign({
                    id: candidate.__id,
                    email: candidate.email
                }, process.env.SECRET_KEY, {expiresIn: '24h'})
                return res.status(200).json({
                    message: 'Вы успешно вошли в свой аккаунт',
                    id: candidate._id,
                    email,
                    token
                })
            }
        })
    } catch (error) {
        return res.status(500).json({message: 'Ошибка на сервере', error})
    }

})

module.exports = router

