const db = require('../db/index.js')

module.exports = {
    redirectDashboard: async (req, res, next) => {
        try {
            if (req.session.userID) {
                const { rows } = await db.query('SELECT email FROM users WHERE user_id = $1', [req.session.userID])

                if (rows.length == 0)
                    next()
                else
                    res.render('dashboard', { user: { email: rows[0].email }})        
            } else {
                next()
            }
        } catch(err) {
            next() // TODO: figure out how to handle this; ignoring sufficient?
        }
    },

    checkLoggedIn: (req, res, next) => {
        if (req.session.userID) {
            next()
        } else {
            res.status(403).end()
        }
    }
}
