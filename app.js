const express = require('express')
const app = express()

const login = require('./routes/login.js')
const signup = require('./routes/signup.js')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/login', login)
app.use('/signup', signup)

app.set('views', './views')
app.set('view engine', 'ejs')

let port = process.env.PORT || 8080

app.listen(port, () => console.log('Running at ' + port))
