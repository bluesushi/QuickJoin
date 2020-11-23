const express = require('express')
const signup = express.Router()
const path = require('path')

signup.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/signup.html'))
})

module.exports = signup
