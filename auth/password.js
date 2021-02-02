const express = require('express')
const password = express.Router()

const path = require('path')
const { nanoid } = require('nanoid')

const db = require('../db/index.js')
const { sendPasswordReset } = require('../email/index.js')
const { genHash } = require('../util/index.js')
const { validatePassword } = require('./validator.js')
const errorControl = require('../errorControl.js')

password.get('/forgotpassword', (req, res) => {
    return res.render('forgotPassword', { error: null })
})

password.post('/forgotpassword', errorControl(async (req, res) => {
    const { email } = req.body
        
    const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [email])
    if (rows[0]?.exists) { // should we have the ?. check here?
        const code = nanoid()
        await db.query('UPDATE users SET forgot_code = $1 WHERE email = $2', [code, email])
        await sendPasswordReset(email, code)
        return res.sendFile(path.join(__dirname, '../views/emailSent.html'))
    } else {
        return res.render('forgotPassword', { error: { message: 'That email doesn\'t exist' }})
    }
}))

password.get('/resetPassword/:randomToken', errorControl(async (req, res) => {
    const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users '
        + 'WHERE forgot_code = $1)', [req.params.randomToken])
    
    if (rows[0]?.exists) {
        res.cookie('forgotCode', req.params.randomToken, {
            maxAge: 8 * 3600000,
            httpOnly: true
        })
        return res.render('resetPassword', { error: null })
    } else {
        return res.sendStatus(403)
    }
}))

password.post('/resetPassword', errorControl(async (req, res) => {
    // first, validate password
    const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users '
        + 'WHERE forgot_code = $1)', [req.cookies.forgotCode])
    const { newpassword, repeatpassword } = req.body
    if (!rows[0].exists) {
        return res.sendStatus(403)
    } else if (newpassword !== repeatpassword) {
        return res.render('resetPassword', { error: { message: 'Passwords must match' }})
    } else if (!validatePassword(newpassword)) {
        return res.render('resetPassword', { error: { message: `
            Password can only include letters and numbers
        `
        }})
    } else {
        const hash = await genHash(newpassword)
        await db.query('UPDATE users SET password = $1 WHERE forgot_code = $2', [hash, req.cookies.forgotCode])
        await db.query('UPDATE users SET forgot_code = $1 WHERE forgot_code = $2', ['', req.cookies.forgotCode])
        res.clearCookie('forgotCode')
        return res.render('confirmed', { message: 'Password has been successfuly changed'})
    }
}))

module.exports = password