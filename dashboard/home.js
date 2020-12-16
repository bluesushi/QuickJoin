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

home.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT email FROM users WHERE user_id = $1', [req.session.userID])

        if (rows.length == 0)
            res.render('login', { error: null })
        else
            res.render('dashboard', { user: { email: rows[0].email }})
    } catch(err) {
        console.log(err)
        res.render('login', { error: null })
    }
})

home.post('addnewlink', checkLoggedIn, (req, res) => {
    console.log(req.body) 
})

module.exports = home
