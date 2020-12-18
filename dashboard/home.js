const express = require('express')
const home = express.Router()
const { checkLoggedIn } = require('../auth/auth.js')
const db = require('../db/index.js')

home.get('/userlinks', checkLoggedIn, async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT link_url, link_name, link_time FROM user_links WHERE user_id = $1', [req.session.userID])

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

home.post('/addnewlink', checkLoggedIn, async (req, res) => {
    try {
        const { 'meeting-url': url, 'meeting-name': name, 'meeting-time': time } = req.body 
        await db.query(`INSERT INTO user_links (user_id, link_url, link_name, link_time)
            VALUES ($1, $2, $3, $4)`, [req.session.userID, url, name, time])
        res.json({ message: 'success' })
    } catch(err) {
        console.log(err)
        res.json({ error: 'failure' })
    }
})

module.exports = home
