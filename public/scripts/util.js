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