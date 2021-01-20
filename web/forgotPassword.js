import { ajax } from './util.js'

const emailInput = document.querySelector('#emailInput')
const passwordResetBtn = document.querySelector('.password-reset-btn')
const wrapper = document.querySelector('.wrapper')

passwordResetBtn.addEventListener('click', () => {
    // TODO: fix this method so that it works correctly
    ajax('/forgotpassword', { email: emailInput.value })
        .then(res => {
            if (res.ok) {
                wrapper.innerHTML = `
                    <div class=success-box>
                        <p>
                            A password reset link has
                            been sent to your email.
                            Click on the link in the
                            email to be sent to the 
                            reset page.
                        </p>
                    </div>
                `
            } else {
                const failureBox = document.createElement('div')
                const message = document.createElement('p')
                // const button = document.createElement('button')

                message.innerText = `The email address could not be verified at this time`
                failureBox.append(message)
                failureBox.className = 'failure-box'
                wrapper.append(failureBox)
            }
        })
        .catch(err => console.error(err))
})