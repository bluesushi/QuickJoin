const express = require('express')
const login = express.Router()
const path = require('path')
const db = require('../db/index.js')

login.get('/', (req, res) => {
    res.render('login', { error: null })
})

login.post('/userlogin', (req, res, next) => {
    res.render('login', { error: { message: "incorrect password" }})
    /*
    db.query('SELECT * FROM admin', [], (err, r) => {

    })
    */
})


module.exports = login
