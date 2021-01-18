import { clearValues, checkLinkValid, checkDuplicateName, ajax } from '../util.js'
import { renderNewLink, remoteUpload, renderOperationStatus, updateLink, localUpload } from './linksView.js'
import { cloneDeep } from 'lodash/lang'
import { meetingManager, state } from './state.js'
import { Meeting } from './models.js'
const { classLink } = state

const modalOpenButton = document.querySelector('.add_link_button')
const modalCloseButton = document.querySelector('.cancel-modal')
const modal = document.querySelector('.add_link_modal')

modalOpenButton.addEventListener('click', () => modal.style.display = 'block')
modalCloseButton.addEventListener('click', () => {
    modal.style.display = 'none'
    clearValues(classLink)
})

let newLinkInputs = document.querySelectorAll('.new-link-input')
newLinkInputs.forEach(input => {
    input.addEventListener('input', () => classLink[input.id] = input.value.trim()) // trim values to avoid errors with innerText
})

const addLinkButton = document.querySelector('.add-link-button')
addLinkButton.addEventListener('click', async () => {
    // TODO: trim white space on link names
    if (!checkLinkValid(classLink)) {
        renderOperationStatus('Link url and link name cannot be empty')
        return closeAddLinkModal()
    } else if (checkDuplicateName(meetingManager.meetings, classLink.name)) {
        renderOperationStatus('Link name must be unique')
        return closeAddLinkModal()
    }

    if (!classLink.time) {
        classLink.time = 'N/A'
    }

    const meeting = new Meeting({ ...classLink })
    localUpload(meeting)
    await remoteUpload(meeting)
    renderNewLink(meeting)
    closeAddLinkModal()
})

function closeAddLinkModal() {
    modal.style.display = 'none'
    clearValues(classLink)
    newLinkInputs.forEach(field => field.value = '')
}

const removeLinkModal = document.querySelector('.remove-link-modal')
const removeLinkModalContent = document.querySelector('.remove-link-modal-content')
export function removeLinkConfirmed(linkName) {
    flipDisplay(removeLinkModal)

    removeLinkModal.firstElementChild.firstElementChild.innerText = 'Remove ' + linkName + '?'
    return new Promise((resolve) => {
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

const editLinkModal = document.querySelector('.edit-link-modal')
// const editLinkModalContent = document.querySelector('.edit-link-modal-content')
const editLinkInputs = document.querySelectorAll('.edit-link-input')
editLinkInputs.forEach(input => {
    input.addEventListener('input', () => {
        state.editLink[input.id] = input.value.trim()
        state.editLink.edited = true
    })
})

export function openLinkEditor({ url, name, time, id }) {
    editLinkInputs.forEach(input => {
        const inputId = input.id
        if (inputId == 'edit-name') {
            input.value = name
            state.editLink[inputId] = name
        } else if (inputId == 'edit-url') {
            input.value = url
            state.editLink[inputId] = url
        } else {
            input.value = time
            state.editLink[inputId] = time
        }

        state.editLink.key = id
    })
    editLinkModal.style.display = 'block'
}

document.querySelector('#close-link-editor')
    .addEventListener('click', () => {
        editLinkModal.style.display = 'none'
        // clearValues(state.editLink)
    })

document.querySelector('#save-edited-link')
    .addEventListener('click', async () => {
        editLinkModal.style.display = 'none'
        if (state.editLink.edited) {
            updateLink({ ...state.editLink })
            try {
                await ajax('/editLink', { ...state.editLink })
            } catch(err) {
                console.error(err)
                renderOperationStatus('Could not update link in db')
            }
        }

        // line right under function beginning can't go here?
        // clearValues(state.editLink)
    })

