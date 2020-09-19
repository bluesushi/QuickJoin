const express = require('express')
const login = express.Router()
const path = require('path')

login.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../pages/login.html'))
})

module.exports = login
