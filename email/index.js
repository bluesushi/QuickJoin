const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    auth: {
        user: process.env.EMAILUSERNAME,
        pass: process.env.EMAILPASSWORD
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
                    <a href="http://localhost:8080/confirmaccount/${code}"
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
            html: ``
        })
    } catch(err) {
        throw err
    }
}

module.exports = {
    sendConfirmation,
    sendPasswordReset
}
