import { ajax } from './util.js'

const deleteAccountBtn = document.querySelector('.delete-account-btn')
const deleteAccountModal = document.querySelector('.delete-account-modal')
const cancelBtn = document.querySelector('.cancel-delete-btn')
const confirmBtn = document.querySelector('.confirm-delete-btn')

deleteAccountBtn.addEventListener('click', () => {
    deleteAccountModal.style.display = 'block'
})

cancelBtn.addEventListener('click', () => {
    deleteAccountModal.style.display = 'none'
})

confirmBtn.addEventListener('click', async () => {
    window.open('/deleteaccount')
})

