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
                    generateHtml(data.links)
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
        generateHtml(links) 
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
        .map(link => {
            const entry = document.createElement('div')

            entry.className = 'entry'
            entry.innerHTML = `
                <div class="link-name">${link.link_name}</div>
                <div class="link-time">${link.link_time}</div>
            `
            const joinBtn = document.createElement('button')
            joinBtn.className = 'link-join-button'
            joinBtn.textContent = 'Join'
            joinBtn.addEventListener('click', () => window.open(link.link_url, '_blank'))
            entry.appendChild(joinBtn)

            return entry
        })
        .forEach(entry => container.appendChild(entry))
}

function renderNewLink(link) {

}

function removeLink(link) {

}

export { renderLinks, renderNewLink, removeLink }
