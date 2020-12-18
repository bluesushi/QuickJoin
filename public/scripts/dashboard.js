import { ajax } from './util.js'
import { renderLinks, renderNewLink } from './linksView.js'

const settingsButton = document.querySelector('.settings_button')
const tooltip = document.querySelector('#tooltip')
const settingsPageLink = document.querySelector('#settings-page-link')
const signoutPageLink = document.querySelector('.signout-button')

settingsButton.addEventListener('click', () => {
    if (tooltip.getAttribute('data-show')) {
        tooltip.removeAttribute('data-show')
    } else {
        tooltip.setAttribute('data-show', 't')
    }
})

signoutPageLink.addEventListener('click', () => {
    localStorage.clear()
    window.location.href = "/usersignout"
})
settingsPageLink.addEventListener('click', () => window.location.href = "/settings")

const modalOpenButton = document.querySelector('.add_link_button')
const modalCloseButton = document.querySelector('.cancel-modal')
const modal = document.querySelector('.add_link_modal')
const settingsBox = document.querySelector('.settings-box')
const settingsButtonImg = document.querySelector('#settings-button-image')

modalOpenButton.addEventListener('click', () => modal.style.display = 'block')
modalCloseButton.addEventListener('click', () => {
    modal.style.display = 'none'
    classLink = {}
})

window.addEventListener('click', (e) => {
    if (e.target != settingsBox && e.target != settingsButtonImg)
        tooltip.removeAttribute('data-show')
})

let classLink = {}
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => classLink[input.id] = input.value) 
})

const addLinkButton = document.querySelector('.add-link-button')
addLinkButton.addEventListener('click', async () => {
    try {
        await ajax('/addNewLink', classLink)
        renderNewLink(classLink)
    } catch(err) {
        console.log(err)
    }
})

window.addEventListener('load', () => {
    renderLinks()
})
