import { ajax } from './util.js'

const container = document.querySelector('.link-container')

async function renderLinks() {
    if (!localStorage.getItem('userLinks')) {
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
                    state = data.links
                    generateHtml(state)
                }
            })
            .catch(err => {
                const errMsg = document.createElement('p')
                errMsg.textContent = 'Could not load links'
                errMsg.id = 'linkErrMsg'
                container.appendChild(errMsg)
            })
    } else {
        const links = JSON.parse(localStorage.getItem('userLinks'))
        state = links
        generateHtml(state) 
    }
}

let state = []
function generateHtml(links) {
    const columnNames = document.createElement('div')
    columnNames.className = 'column-names'
    columnNames.innerHTML = `
        <div><h3>Name</h3></div>
        <div><h3>Time</h3></div>
    `
    container.appendChild(columnNames)

    links.sort((a, b) => parseInt(a.link_time) - parseInt(b.link_time))
        .map(link => {
            const entry = document.createElement('div')

            entry.className = 'entry'
            entry.innerHTML = `
                <div class="link-name">${link.link_name}</div>
                <div class="link-time">${link.link_time}</div>
                <div class="link-join"><button class="link-join-button">Join</button></div>
            `
            entry.lastElementChild.addEventListener('click', () => window.open(link.link_url, '_blank'))

            return entry
        })
        .forEach(entry => container.appendChild(entry))
}

function renderNewLink(link) {
    console.log(link)
    
    state.push(link)
    localStorage.setItem('userLinks', JSON.stringify(state))

    const entry = document.createElement('div')

    entry.className = 'entry'
    entry.innerHTML = `
        <div class="link-name">${link.link_name}</div>
        <div class="link-time">${link.link_time}</div>
        <div class="link-join"><button class="link-join-button">Join</button></div>
    `
    entry.lastElementChild.addEventListener('click', () => window.open(link.link_url, '_blank'))

    container.appendChild(entry)
}

function removeLink(link) {

}

export { renderLinks, renderNewLink, removeLink }
