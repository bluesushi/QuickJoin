import { ajax, clearValues } from '../util.js'
import { renderNewLink } from './linksView.js'

const modalOpenButton = document.querySelector('.add_link_button')
const modalCloseButton = document.querySelector('.cancel-modal')
const modal = document.querySelector('.add_link_modal')

modalOpenButton.addEventListener('click', () => modal.style.display = 'block')
modalCloseButton.addEventListener('click', () => {
    modal.style.display = 'none'
    clearValues(classLink)
})

let classLink = {
    link_time: '',
    link_name: '',
    link_url: ''
}
const addLinkButton = document.querySelector('.add-link-button')

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => classLink[input.id] = input.value) 
})

addLinkButton.addEventListener('click', async () => {
    try {
        await ajax('/addNewLink', classLink)
        renderNewLink(classLink)
        modal.style.display = 'none'
        clearValues(classLink)
    } catch(err) {
        console.log(err)
    }
})

const removeLinkModal = document.querySelector('.remove-link-modal')
const removeLinkModalContent = document.querySelector('.remove-link-modal-content')
export function removeLinkConfirmed(linkName) {
    flipDisplay(removeLinkModal)

    return new Promise((resolve, reject) => {
        removeLinkModalContent.children[1].onclick = () => {
            flipDisplay(removeLinkModal)
            resolve(true)
        }
        removeLinkModalContent.children[2].onclick = () => {
            flipDisplay(removeLinkModal)
            resolve(false)
        }
    })
}

function flipDisplay(e) {
    e.style.display ? e.style.display = '' : e.style.display = 'block'
}