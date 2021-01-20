const express = require('express')
const password = express.Router()

const path = require('path')
const { nanoid } = require('nanoid')

const db = require('../db/index.js')
const { sendPasswordReset } = require('../email/index.js')

password.get('/forgotpassword', (req, res) => {
    return res.sendFile(path.join(__dirname, '../views/forgotPassword.html'))
})

password.post('/forgotpassword', async (req, res, next) => {
    const { email } = req.body
    try {
        const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [email])
        if (rows[0]?.exists) { // should we have the ?. check here?
            const code = nanoid()
            await db.query('UPDATE users SET forgot_code = $1 WHERE email = $2', [code, email])
            // await sendPasswordReset(email, code)
            return res.sendStatus(200)
        } else {
            return res.sendStatus(400)
        }
    } catch(err) {
        console.log(err)
        next(err)
    }
})

password.get('/resetPassword/:randomToken', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT EXISTS(SELECT 1 FROM users '
            + 'WHERE user_id = $1 AND forgot_code = $2)', [req.session.userID, req.params.randomToken])
        
        if (rows[0]?.exists) {
            return res.sendFile(path.join(__dirname, '../views/passwordReset.html'))
        } else {
            return res.sendStatus(403)
        }
    } catch(err) {
        console.log(err)
        next(err)
    }
})

module.exports = password