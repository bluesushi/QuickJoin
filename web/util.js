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
}

export function clearValues(obj) {
    Object.keys(obj)
        .forEach(key => obj[key] = '')
}

export function checkLinkValid({ url, name }) {
    return url.length > 0 && name.length > 0
}

export function checkDuplicateName(arr, name) {
    return arr.map(meeting => meeting.name)
        .includes(name)
}