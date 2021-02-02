const { transports } = require('winston')
const winston = require('winston')

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
})

module.exports = (cb) => (req, res, next) => cb(req, res).catch(err => {
    // log errors
    logger.error(err.message)
    next(err)
})
