let btn = document.getElementById('closeErrBtn')

btn?.addEventListener('click', () => {
    document.getElementsByClassName('loginerror')[0]?.remove()
})