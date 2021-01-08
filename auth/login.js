const express = require('express')
const login = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const db = require('../db/index.js')
const { redirectDashboard } = require('./auth.js')

login.get('/login', redirectDashboard, async (req, res) => {
    return res.render('login', { error: null })
})

login.post('/userlogin', async (req, res, next) => {
    const { email, password } = req.body
    try {
        const { rows } = await db.query('SELECT user_id, password, confirmed FROM users WHERE email = $1', [email])
        
        if (rows.length == 0) {
            return loginError(res)         
        }

        if (await bcrypt.compare(password, rows[0].password) && rows[0].confirmed) {
            req.session.userID = rows[0].user_id 
            res.redirect('/')
        } else {
            return loginError(res)
            // TODO: return email page when they're not confirmed return res.sendFile(path.join(__dirname + '/../views/emailSent.html'))
        }
    } catch(err) {
        return next(err)
    }
})

function loginError(res) {
    res.render('login', { error: { message: "Incorrect username or password" }})
}

module.exports = login