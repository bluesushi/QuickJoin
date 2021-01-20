import { ajax } from './util.js'

const emailInput = document.querySelector('#emailInput')
const passwordResetBtn = document.querySelector('.password-reset-btn')

passwordResetBtn.addEventListener('click', () => {
    // TODO: fix this method so that it works correctly
    ajax('/forgotpassword', { email: emailInput.value })
        .then(res => {
            if (Array.from(res.headers)
                .filter(header => header[0] == 'content-type')
                .find(header => header[1].startsWith('text')))
                res.text().then(html => document.write(html))
            else
                res.json().then(data => console.log(data))
        })
        .catch(err => console.error(err))
})