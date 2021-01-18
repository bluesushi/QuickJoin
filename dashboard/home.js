const express = require('express')
const home = express.Router()
const { checkLoggedIn } = require('../auth/auth.js')
const db = require('../db/index.js')

home.get('/userlinks', checkLoggedIn, async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT url, name, time, meeting_id FROM user_links WHERE user_id = $1', [req.session.userID])

        if (rows.length === 0) {
            return res.json({ message: 'no links' })
        } else {
            return res.json({ message: 'success', links: rows })
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
        const { url, name, time, id } = req.body 
        await db.query(`INSERT INTO user_links (user_id, url, name, time, meeting_id)
            VALUES ($1, $2, $3, $4, $5)`, [req.session.userID, url, name, time, id])
        res.json({ message: 'success' })
    } catch(err) {
        console.log(err)
        res.status(400).json({ message: 'Link could not be added to db (urls must be unique to be added)' })
    }
})

home.post('/removeLink', checkLoggedIn, async (req, res) => {
    try {
        const { id } = req.body
        await db.query('DELETE FROM user_links WHERE meeting_id = $1 AND user_id = $2', [id, req.session.userID])
        res.status(200).json('success')
    } catch(err) {
        console.log(err)
        res.status(300).json('failure')
    }
})

home.post('/editLink', checkLoggedIn, async (req, res) => {
    try {
        const { key, 'edit-url': url, 'edit-time': time, 'edit-name': name } = req.body
        await db.query('UPDATE user_links SET url = $1, time = $2, name = $3' 
            + 'WHERE user_id = $4 AND meeting_id = $5',
            [url, time, name, req.session.userID, key])
        // TODO: very weird, if we don't send json value there is an error
        // with a hanging response on the frontend
        res.status(200).json('ok')
    } catch(err) {
        console.log(err)
        res.status(500).json('failure')
    }
})

module.exports = home
