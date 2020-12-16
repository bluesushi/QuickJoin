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

signoutPageLink.addEventListener('click', () => window.location.href = "/usersignout")
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
addLinkButton.addEventListener('click', () => {

})

window.addEventListener('load', () => {
    const container = document.querySelector('.link-container')

    fetch('/userlinks')
        .then(res => res.json())
        .then(data => {
            if (data.message == 'no links') {
                const firstLink = document.createElement('p')
                firstLink.textContent = 'It seems you don\'t have any links yet. ' + 
                    'Add your first one by clicking the \'+\' in the top right corner'
                firstLink.id = 'linkStatus'
                container.appendChild(firstLink)
            } else {
                console.log(data)
                /*
                data.links.map(link => {
                    const 
                })
                .forEach
                */
            }
        })
        .catch(err => {
            const errMsg = document.createElement('p')
            errMsg.textContent = 'Could not load links'
            errMsg.id = 'linkErrMsg'
            container.appendChild(errMsg)
        })
})
