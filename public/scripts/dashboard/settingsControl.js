const settingsButton = document.querySelector('.settings_button')
const tooltip = document.querySelector('#tooltip')
const settingsPageLink = document.querySelector('#settings-page-link')
const signoutPageLink = document.querySelector('.signout-button')
const settingsBox = document.querySelector('.settings-box')
const settingsButtonImg = document.querySelector('#settings-button-image')

settingsButton.addEventListener('click', () => {
    if (tooltip.getAttribute('data-show')) {
        tooltip.removeAttribute('data-show')
    } else {
        tooltip.setAttribute('data-show', 't')
    }
})

window.addEventListener('click', (e) => {
    if (e.target != settingsBox && e.target != settingsButtonImg)
        tooltip.removeAttribute('data-show')
})

signoutPageLink.addEventListener('click', () => {
    localStorage.clear()
    window.location.href = "/usersignout"
})
settingsPageLink.addEventListener('click', () => window.location.href = "/settings")