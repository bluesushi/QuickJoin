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
        const { link_url, link_name, link_time } = req.body 
        await db.query(`INSERT INTO user_links (user_id, link_url, link_name, link_time)
            VALUES ($1, $2, $3, $4)`, [req.session.userID, link_url, link_name, link_time])
        res.json({ message: 'success' })
    } catch(err) {
        console.log(err)
        res.json({ error: 'failure' })
    }
})

home.post('/removeLink', checkLoggedIn, async (req, res) => {
    try {
        const { link_name } = req.body
        await db.query('DELETE FROM user_links WHERE link_name = $1 AND user_id = $2', [link_name, req.session.userID])
        res.status(200).json('success')
    } catch(err) {
        console.log(err)
        res.status(300).json('failure')
    }
})

module.exports = home
