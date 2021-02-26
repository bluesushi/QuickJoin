const { app } = require('./app.js')

let port = process.env.PORT || 8080
app.listen(port, () => console.log('Running at ' + port))
