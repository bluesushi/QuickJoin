const express = require('express')
const home = express.Router()
const { checkLoggedIn } = require('../auth/auth.js')
const db = require('../db/index.js')

home.get('/userlinks', checkLoggedIn, async (req, res) => {
    try {
        const { rows } = await db.query('SELECT class_link FROM user_links WHERE user_id = $1', [req.session.userID])

        if (rows.length === 0) {
            res.json({ message: 'no links' })
        } else {
            res.json({ message: 'success', links: rows })
        }
    } catch(err) {
        next(err)
    }
})

module.exports = home
