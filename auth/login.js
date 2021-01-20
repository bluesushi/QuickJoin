const express = require('express')
const login = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')
const db = require('../db/index.js')
const { sendPasswordReset } = require('../email/index.js')
const { redirectDashboard } = require('./auth.js')

login.get('/login', redirectDashboard, async (req, res) => {
    return res.render('login', { error: null })
})

login.get('/forgotpassword', (req, res) => {
    return res.sendFile(path.join(__dirname, '../views/forgotPassword.html'))
})

login.post('/forgotpassword', async (req, res, next) => {
    const { email } = req.body
    try {
        const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [email])
        if (rows[0]?.exists) { // should we have the ?. check here?
            const code = nanoid()
            await db.query('UPDATE users SET forgot_code = $1 WHERE email = $2', [code, email])
            // await sendPasswordReset(email, code)
            res.type('html')
            return res.sendFile(path.join(__dirname, '../views/emailSent.html'))
        } else {
            res.type('json')
            return res.status(300).json({ status: false })
        }
    } catch(err) {
        console.log(err)
        next(err)
    }
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
            res.redirect('/dashboard')
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
