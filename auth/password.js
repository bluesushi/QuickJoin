const express = require('express')
const password = express.Router()

const path = require('path')
const { nanoid } = require('nanoid')

const db = require('../db/index.js')
const { sendPasswordReset } = require('../email/index.js')
const { genHash } = require('../util/index.js')
const { validatePassword } = require('./validator.js')

password.get('/forgotpassword', (req, res) => {
    return res.render('forgotPassword', { error: null })
})

password.post('/forgotpassword', async (req, res, next) => {
    const { email } = req.body
    try {
        const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [email])
        if (rows[0]?.exists) { // should we have the ?. check here?
            const code = nanoid()
            await db.query('UPDATE users SET forgot_code = $1 WHERE email = $2', [code, email])
            await sendPasswordReset(email, code)
            return res.sendFile(path.join(__dirname, '../views/emailSent.html'))
        } else {
            return res.render('forgotPassword', { error: { message: 'That email doesn\'t exist' }})
        }
    } catch(err) {
        console.log(err)
        next(err)
    }
})

password.get('/resetPassword/:randomToken', async (req, res, next) => {
    try {
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
    } catch(err) {
        console.log(err)
        next(err)
    }
})

password.post('/resetPassword', async (req, res, next) => {
    try {
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
    } catch(err) {
        console.log(err)
        next(err)
    }
})

module.exports = password