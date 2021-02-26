const alphanumerical = require('is-alphanumerical')

module.exports = {
    validateUrl: (url) => {
        
    },
    validatePassword: (password) => {
        if (password.length > 20 || password.length < 8) {
            return false
        }

        for (const c of password.split('')) {
            if (!alphanumerical(c))
                return false
        }

        return true
    }
}
