module.exports = {
    server: {
        mongoErrors: {
            connectionError: 'Ошибка подключения к базе данных',
        },
        error: 'Ошибка сервера',
        started: 'Сервер запущен на порту'
    },
    auth: {
        registration: {
            emailExists: 'Пользователь с таким email уже существует',
            usernameExists: 'Пользователь с таким именем уже существует',
            sendMailError: 'Не удалось отправить письмо на вашу почту',
            sendMailSuccess: 'Проверьте ваш почтовый ящик, чтобы подтвердить регистрацию',
            validation: {
                correctEmail: 'Введите корректный email',
                emailExists: 'Такой email уже занят',
                usernameLength: 'Имя должно быть больше 3 и меньше 15 символов',
                usernameExists: "Такой никнейм уже занят",
                phoneIsString: 'Номер должен быть в виде строки',
                inputCorrectPhone: 'Введите правильно номер. Пример: +996553484837',
                passwordLength: 'Пароль должен быть минимум 6 символов'
            }
        },
        activation: {
            tokenExpired: 'Срок действия токена истек.Попробуйте заново заполнить форму регистрации',
            hashError: 'Ошибка кодировки пароля',
            RegistrationSuccess: 'Поздравляем! Вы успешно зарегистрировались на нашем сайте',
            RegistrationFailed: 'Ошибка сохранения пользователя в базе данных.Возможно вы уже зарегистрированы на нашем сайте'
        },
        login: {
            emailNotExists: 'Пользователя с таким email не существует',
            compareError: 'Ошибка сравнения паролей',
            wrongPassword: 'Вы ввели неверный пароль',
            successLogin: 'Вы успешно вошли в свой аккаунт'
        },
        token: {
            tokenExpired: 'Срок действия токена истек.Попробуйте заново войти в свой аккаунт',
            wrongToken: 'Неверный токен'
        }
    },
    bike: {
        admin: {
            noAccess: 'У вас нет доступа',
            bikeExists: "Велосипед с таким названием уже существует",
            successAdd: "Вы успешно добавили новый товар"
        }
    },
    order: {
        newOrder:{
            noAccess:'У вас нет доступа к совершению нового заказа',
            success:'Ваш заказ успешно оформлен',

        }
    }
}

