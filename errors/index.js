class Errors {
    constructor(type, message) {
        switch (type) {
            case 'MONGO_ERROR':
                this.connectionError(message)
        }
    }

    connectionError(message) {
        throw new Error(message)
    }
}

module.exports = Errors