const express = require('express')
const home = express.Router()

const { checkLoggedIn, redirectLogin } = require('../auth/auth.js')
const db = require('../db/index.js')
const errorControl = require('../errorControl.js')

home.get('/userlinks', checkLoggedIn, errorControl(async (req, res) => {
    const { rows } = await db.query('SELECT url, name, time, meeting_id FROM user_links WHERE user_id = $1', [req.session.userID])
    if (rows.length === 0) {
        return res.json({ message: 'no links' })
    } else {
        return res.json({ message: 'success', links: rows })
    }
}))

home.get(['/', '/dashboard'], redirectLogin, async (req, res) => {
    return res.render('dashboard', { user: { email: req.session.email }})
})

home.post('/addnewlink', checkLoggedIn, errorControl(async (req, res) => {
    const { url, name, time, id } = req.body
    const { rows } = await db.query('SELECT COUNT(*) FROM user_links WHERE user_id = $1',
        [req.session.userID])
    
    if (+rows[0].count >= 10)
        return res.sendStatus(403)

    await db.query(`INSERT INTO user_links (user_id, url, name, time, meeting_id)
        VALUES ($1, $2, $3, $4, $5)`, [req.session.userID, url, name, time, id])
    return res.sendStatus('200')
}))

home.post('/removeLink', checkLoggedIn, errorControl(async (req, res) => {
    const { id } = req.body
    await db.query('DELETE FROM user_links WHERE meeting_id = $1 AND user_id = $2', [id, req.session.userID])
    res.status(200).json('success')
}))

home.post('/editLink', checkLoggedIn, errorControl(async (req, res) => {
    const { key, 'edit-url': url, 'edit-time': time, 'edit-name': name } = req.body
    await db.query('UPDATE user_links SET url = $1, time = $2, name = $3' 
        + 'WHERE user_id = $4 AND meeting_id = $5',
        [url, time, name, req.session.userID, key])
    // TODO: very weird, if we don't send json value there is an error
    // with a hanging response on the frontend
    res.status(200).json('ok')
}))

module.exports = home