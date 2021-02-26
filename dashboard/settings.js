const express = require('express')
const settings = express.Router()
const { checkLoggedIn } = require('../auth/auth.js')
const db = require('../db/index.js')

settings.get('/settings', checkLoggedIn, (req, res) => {
    res.render('settings')
})

settings.get('/deleteaccount', checkLoggedIn, async (req, res, next) => {
    try {
        await db.query('DELETE FROM users WHERE user_id = $1', [req.session.userID])
        return req.session.destroy((err) => {
            res.redirect('/login')
        })
    } catch(err) {
        console.log(err)
        next(err)
    }
})

module.exports = settings
