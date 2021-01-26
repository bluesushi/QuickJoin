const bcrypt = require('bcrypt')

async function genHash(password) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

module.exports = {
    genHash: genHash
}