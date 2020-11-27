const express = require('express')
const signup = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid').nanoid

const db = require('../db/index.js')
const mail = require('../email/index.js')

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
        const randomToken = nanoid()
        const user = new User(email, hash, randomToken)
        await insertUser(user)
        await mail.sendConfirmation(user)
        res.send('check email for confirmation')
    } catch(err) {
        return next(err)
    }
})

function User(email, hash, id) {
    this.email = email
    this.hash = hash
    this.id = id
}

async function checkDuplicateUser(email) {
    try {
        const { rows } = await db.query('SELECT email FROM users WHERE email = $1', [email])
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

async function insertUser({ email, hash, id }) {
    try {
        await db.query('INSERT INTO users(email, password, confirmation_code) VALUES($1, $2, $3)', [email, hash, id])
    } catch(err) {
        throw err
    }
}

module.exports = signup
