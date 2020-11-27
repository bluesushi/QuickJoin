const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    auth: {
        user: process.env.EMAILUSERNAME,
        pass: process.env.EMAILPASSWORD
    }
})

async function sendConfirmation({ email, id }) {
    try {
        await transporter.sendMail({
            from: process.env.EMAILUSERNAME,
            to: email,
            subject: "Quick Join confirmation email",
            html: `
                <h1>${id}</h1>
            `
        })
    } catch(err) {
        throw err
    }
}

module.exports = {
    sendConfirmation: sendConfirmation
}
