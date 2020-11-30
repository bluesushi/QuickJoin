const express = require('express')
const login = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const db = require('../db/index.js')

login.get('/', (req, res) => {
    res.render('login', { error: null })
})

login.post('/userlogin', async (req, res, next) => {
    const { email, password } = req.body
    try {
        const { rows } = await db.query('SELECT password, confirmed FROM users WHERE email = $1', [email])
        
        if (rows.length == 0) {
            return loginError(res)         
        }

        if (await bcrypt.compare(password, rows[0].password) && rows[0].confirmed) {
            return res.render('dashboard')        
        } else {
            return loginError(res)
        }
    } catch(err) {
        return next(err)
    }
})

function loginError(res) {
    res.render('login', { error: { message: "Incorrect username or password" }})
}


module.exports = login
