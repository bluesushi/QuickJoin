const express = require('express')
const app = express()

let port = process.env.PORT

app.listen(port, () => console.log('Running at ' + port))
