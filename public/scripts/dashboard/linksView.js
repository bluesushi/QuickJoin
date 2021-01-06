import { ajax } from '../util.js'
import { removeLinkConfirmed } from './modalControl.js'
import { encodeHTML } from 'entities'
import { state } from './state.js'

const container = document.querySelector('.link-container')

async function renderLinks() {
    // first check if links are in localstorage
    if (!localStorage.getItem('userLinks') || localStorage.getItem('userLinks') == '[]') {
        await ajax('/userlinks')
            .then(data => {
                if (data.message == 'no links') {
                    const firstLink = document.createElement('p')
                    firstLink.textContent = 'It seems you don\'t have any links yet. ' + 
                        'Add your first one by clicking the \'+\' in the top right corner'
                    firstLink.id = 'linkStatus'
                    container.appendChild(firstLink)
                } else {
                    localStorage.setItem('userLinks', JSON.stringify(data.links))
                    state.linkArray = data.links
                    generateHtml(state.linkArray)
                }
            })
            .catch(err => {
                console.log(err) // TODO probably remove later
                const errMsg = document.createElement('p')
                errMsg.textContent = 'Could not load links'
                errMsg.id = 'linkErrMsg'
                container.appendChild(errMsg)
            })
    } else {
        state.linkArray = JSON.parse(localStorage.getItem('userLinks'))
        generateHtml(state.linkArray) 
    }
}

function generateHtml(links) {
    const columnNames = document.createElement('div')
    columnNames.className = 'column-names'
    columnNames.innerHTML = `
        <div><h3>Name</h3></div>
        <div><h3>Time</h3></div>
    `
    container.appendChild(columnNames)

    links.sort((a, b) => parseInt(a.link_time) - parseInt(b.link_time))
        .map(link => getLinkMarkup(link))
        .forEach(entry => container.appendChild(entry))
}

async function addNewLink(link) {
    try {
        await ajax('/addNewLink', link)
    } catch(err) {
        renderOperationStatus('Could not upload link to database')
    }
}

function renderNewLink(link) {
    state.linkArray.push(link)
    localStorage.setItem('userLinks', JSON.stringify(state.linkArray))

    const entry = getLinkMarkup(link)

    container.appendChild(entry)
}

function getLinkMarkup({ link_name, link_time, link_url }) {
    const entry = document.createElement('div')

    entry.className = 'entry'
    entry.innerHTML = `
        <div class="link-name">${encodeHTML(link_name)}</div>
        <div class="link-time">${link_time}</div>
        <div class="link-join"><button class="link-join-button">Join</button></div>
        <div class="link-editors link-edit"><button><img src="/images/pen.svg"></button></div>
        <div class="link-editors link-remove"><button class="link-remove-button"><img src="/images/x-circle.svg"></button></div>
    `
    entry.querySelector('.link-join-button').addEventListener('click', () => window.open(link_url, '_blank'))
    entry.querySelector('.link-remove-button').addEventListener('click', () => {
        removeLinkConfirmed(link_name)
            .then(async (result) => {
                if (result) {
                    removeLocalLink(link_name)
                    await removeRemoteLink(link_name)
                }
            })
            .catch(err => {
                console.error(err)
                renderOperationStatus('Could not remove link from db')
            })
    })

    return entry
}

function removeLocalLink(name) {
    state.linkArray = state.linkArray.filter(link => link.link_name != name)
    localStorage.setItem('userLinks', JSON.stringify(state.linkArray))

    // TODO: innerText doesn't render whitespace on either ends so that needs to be fixed
    container.removeChild(Array.from(container.children)
        .find(entry => entry.firstElementChild.innerText == name))
}

async function removeRemoteLink(name) {
    await ajax('/removeLink', { link_name: name })
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

    document.body.insertBefore(status, container)
}

export { renderLinks, renderNewLink, addNewLink, renderOperationStatus }
