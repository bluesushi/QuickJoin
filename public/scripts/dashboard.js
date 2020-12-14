const button = document.querySelector('.settings_button')
const tooltip = document.querySelector('#tooltip')
const settingsPageLink = document.querySelector('#settings-page-link')
const signoutButton = document.querySelector('.signout-button')

button.addEventListener('click', () => {
    if (tooltip.getAttribute('data-show')) {
        tooltip.removeAttribute('data-show')
    } else {
        tooltip.setAttribute('data-show', 't')
    }
})

signoutButton.addEventListener('click', () => window.location.href = "/usersignout")
settingsPageLink.addEventListener('click', () => window.location.href = "/settings")

window.addEventListener('load', () => {
    let req = new XMLHttpRequest()

    req.addEventListener('load', () => {
        console.log(JSON.parse(req.response))
    })

    req.open('GET', '/userLinks')
    req.send()
})
