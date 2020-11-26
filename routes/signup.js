const express = require('express')
const signup = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')

const db = require('../db/index.js')

signup.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/signup.html'))
})

signup.post('/usersignup', async (req, res, next) => {
    const { email, password } = req.body

    try {
        if (await checkDuplicateUser(email)) { 
            return res.status(400).json({ error: 'user already exists' })
        }

        const hash = await genHash(password)
        await insertUser(hash)
        await sendConfirmation(email)
    } catch(err) {
        return next(err)
    }
    
    res.send('success')
})

async function checkDuplicateUser(email) {
    try {
        const { rows } = await db.query('SELECT email FROM users WHERE email = $1', [email])
        console.log(rows)
        return rows.length > 0
    } catch(err) {
        throw err
    }
}

async function genHash(password) {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch(err) {
        throw err
    }
}

async function insertUser(email, hash) {
    try {
        await db.query('INSERT INTO users(email, password) VALUES($1, $2)', [email, hash])
    } catch(err) {
        throw err
    }
}

module.exports = signup
