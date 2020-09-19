const express = require('express')
const app = express()

const login = require('./routes/login.js')
const signup = require('./routes/signup.js')

app.use(express.static('public'))
app.use(express.json())
app.use('/login', login)
app.use('/signup', signup)

let port = process.env.PORT || 8080

app.listen(port, () => console.log('Running at ' + port))
