import { ajax } from '../util.js'
import { removeLinkConfirmed, openLinkEditor } from './modalControl.js'
import { encodeHTML } from 'entities'
import { state } from './state.js'
import { Meeting } from './models.js'
import { meetingManager } from './state.js'

const container = document.querySelector('.link-container')
const specialMessage = document.querySelector('.special-message')
const columnNames = document.querySelector('.column-names')

async function renderLinks() {
    // first check if links are in localstorage
    if (!localStorage.getItem('userLinks') || localStorage.getItem('userLinks') == '[]') {
        await ajax('/userlinks')
            .then(data => {
                if (data.message == 'no links') {
                    specialMessage.innerText = 'It seems you don\'t have any links yet. ' + 
                        'Add your first one by clicking the \'+\' in the top right corner'
                    specialMessage.style.display = 'block'
                    columnNames.style.display = 'none'
                } else {
                    // TODO take another at how special message is rendered when
                    // there are no links
                    data.links
                        .map(link => new Meeting({ ...link }))
                        .forEach(meeting => meetingManager.add(meeting))
                    meetingManager.emitToLocalStorage()
                    generateHtml(meetingManager.meetings)

                    columnNames.style.display = 'flex'
                }
            })
            .catch(err => {
                console.log(err) // TODO probably remove later
                specialMessage.textContent = 'Could not load links'
                specialMessage.style.display = 'block'
            })
    } else {
        meetingManager.meetings = JSON.parse(localStorage.getItem('userLinks'))
        generateHtml(meetingManager.meetings) 
        columnNames.style.display = 'flex'
    }
}

function generateHtml(links) {
    links.sort((a, b) => parseInt(a.time) - parseInt(b.time))
        .map(link => getLinkMarkup(link))
        .forEach(entry => container.appendChild(entry))
}

async function remoteUpload(link) {
    try {
        await ajax('/addNewLink', link)
    } catch(err) {
        renderOperationStatus('Could not upload link to database')
    }
}

function updateLink({ key, 'edit-url': url, 'edit-name': name, 'edit-time': time }) {
    let meeting = meetingManager.meetings.find(m => m.id === key)
    // make this prettier
    meeting.url = url
    meeting.name = name
    meeting.time = time
    meetingManager.emitToLocalStorage()

    const toEdit = Array.from(container.children)
        .find(e => e.lastElementChild.className == key)

    toEdit.querySelector('.link-name').innerText = name
    toEdit.querySelector('.link-time').innerText = time
    toEdit.querySelector('.link-join-button').onclick = linkOpener(key)
}

function localUpload(meeting) {
    meetingManager.add(meeting)
    meetingManager.emitToLocalStorage()
}

function renderNewLink(meeting) {
    if (meetingManager.arrSize() === 1) {
        specialMessage.style.display = 'none'
        columnNames.style.display = 'flex'
    }

    const entry = getLinkMarkup(meeting)
    container.appendChild(entry)
}

function getLinkMarkup({ name, time, url, id }) {
    const entry = document.createElement('div')

    entry.className = 'entry'
    entry.innerHTML = `
        <div class="link-name">${encodeHTML(name)}</div>
        <div class="link-time">${time}</div>
        <div class="link-join"><button class="link-join-button">Join</button></div>
        <div class="link-editors link-edit"><button class="link-edit-button"><img src="/images/pen.svg"></button></div>
        <div class="link-editors link-remove"><button class="link-remove-button"><img src="/images/x-circle.svg"></button></div>
        <div class="${id}" style="display:hidden;"></div>
    `
    entry.querySelector('.link-join-button').onclick = linkOpener(id)
    entry.querySelector('.link-remove-button').addEventListener('click', () => {
        removeLinkConfirmed(name)
            .then(async (result) => {
                if (result) {
                    removeLocalLink(id)
                    await removeRemoteLink(id)
                }
            })
            .catch(err => {
                console.error(err)
                renderOperationStatus('Could not remove link from db')
            })
    })
    entry.querySelector('.link-edit-button').addEventListener('click', () => {
        // MAJOR ERROR: we cannot use closures here because it doesn't get updated
        // if any of these values change
        openLinkEditor({ ...meetingManager.meetings.find(m => m.id === id) })
    })

    return entry
}

function linkOpener(id) {
    let url = meetingManager.meetings
        .find(m => m.id === id)
        .url

    return () => {
        window.open(url, '_blank')
    }
}

function removeLocalLink(id) {
    meetingManager.remove(id)
    meetingManager.emitToLocalStorage()

    if (meetingManager.arrSize() == 0) {
        specialMessage.style.display = 'block'
        columnNames.style.display = 'none'
        specialMessage.innerText = 'It seems you don\'t have any links yet. ' + 
            'Add your first one by clicking the \'+\' in the top right corner'
    }

    // TODO: innerText doesn't render whitespace on either ends so that needs to be fixed
    container.removeChild(Array.from(container.children)
        .find(entry => entry.lastElementChild.className == id))
}

async function removeRemoteLink(id) {
    await ajax('/removeLink', { id: id })
}

function renderOperationStatus(message) {
    let status
    if ((status = document.querySelector('.operation-status'))) {
        status.lastElementChild.innerText = message
        return
    }

    status = document.createElement('div')
    const content = document.createElement('span')
    content.innerText = message
    const close = document.createElement('button')
    const img = document.createElement('img')

    img.setAttribute('src', '/images/x.svg')
    img.setAttribute('id', 'close-op-status-image')
    close.appendChild(img)
    close.addEventListener('click', () => document.body.removeChild(status))

    status.appendChild(close)
    status.appendChild(content)
    status.className = 'operation-status'

    document.body.insertBefore(status, specialMessage)
}

export { renderLinks, renderNewLink, remoteUpload, 
    renderOperationStatus, localUpload, updateLink }
