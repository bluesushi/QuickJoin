const express = require('express')
const settings = express.Router()
const { checkLoggedIn } = require('../auth/auth.js')

settings.get('/settings', checkLoggedIn, (req, res) => {
    res.render('settings')
})

module.exports = settings
