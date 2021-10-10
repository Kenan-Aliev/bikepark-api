class Errors {
    static asyncError(message) {
        return new Promise((resolve, reject) => {
                reject(message)
            }
        )
    }

    static userExists(message){
        throw new Error(message)
    }

}

module.exports = Errors