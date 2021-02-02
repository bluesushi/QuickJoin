const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'localhost',
    pool: true,
    port: 25,
    tls: {
        rejectUnauthorized: false
    }
})

async function sendConfirmation({ email, code }) {
    try {
        await transporter.sendMail({
            from: process.env.EMAILUSERNAME,
            to: email,
            subject: "Quick Join confirmation email",
            html: `
                <p>
                    <a href="http://${process.env.MYDOMAIN}/confirmaccount/${code}"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Confirm account
                    </a>
                </p>
            `
        })
    } catch(err) {
        throw err
    }
}

async function sendPasswordReset(email, code) {
    try {
        await transporter.sendMail({
            from: process.env.EMAILUSERNAME,
            to: email,
            subject: "Quick Join password reset email",
            html: `
                <p>
                    <a href="http://${process.env.MYDOMAIN}/resetPassword/${code}"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Reset password
                    </a>
                </p>
            `
        })
    } catch(err) {
        throw err
    }
}

module.exports = {
    sendConfirmation,
    sendPasswordReset
}