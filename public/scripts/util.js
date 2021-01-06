export async function ajax(path, data = undefined) {
    const options = {
        method: data ? 'POST' : 'GET',
    }

    if (data) {
        options.body = JSON.stringify(data) 
        options.headers = {
            'Content-Type': 'application/json'
        }
    }

    return await fetch(path, options)
        .then(res => res.json())
}

export function clearValues(obj) {
    Object.keys(obj)
        .forEach(key => obj[key] = '')
}

export function checkLinkValid({ link_url, link_name }) {
    return link_url.length > 0 && link_name.length > 0
}

export function checkDuplicateName(arr, name) {
    return arr.map(link => link.link_name)
        .includes(name)
}