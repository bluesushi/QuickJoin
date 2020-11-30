const button = document.querySelector('.settings_button')
const tooltip = document.querySelector('#tooltip')
/*
let popperInstance = null

function create() {
    popperInstance = Popper.createPopper(button, tooltip, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 8]
                }
            }
        ]
    })
}

function destroy() {
    if (popperInstance) {        // even though we call when we know the popper is
	    popperInstance.destroy() // there safer to have this check
	    popperInstance = null
    }
}
*/

button.addEventListener('click', () => {
    if (tooltip.getAttribute('data-show')) {
        tooltip.removeAttribute('data-show')
    } else {
        tooltip.setAttribute('data-show', 't')
    }
})
