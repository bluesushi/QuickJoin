const db = require('../db/index.js')

module.exports = {
    redirectDashboard: (req, res, next) => {
        if (req.session.userID) {
            res.redirect('/dashboard')     
        } else {
            next()
        }
    },

    checkLoggedIn: (req, res, next) => {
        if (req.session.userID) {
            next()
        } else {
            res.status(403).end()
        }
    },

    redirectLogin: (req, res, next) => {
        if (req.session.userID) {
            next()
        } else {
            res.redirect('/login')
        }
    }
}
