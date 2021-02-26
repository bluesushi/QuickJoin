function Meeting({ url, time, name }) {
	this.url = url
	this.time = time
	this.name = name
	this.id = -1
}

function MeetingManager() {
	let meetings = []

	this.add = (meeting) => {
		meeting.id = findSequential(meetings)
		meetings.push(meeting)
	}

	this.emitToLocalStorage = () => {
		localStorage.setItem('userLinks', JSON.stringify(meetings))
	}

	this.arrSize = () => {
		return meetings.length
	}

	this.remove = (id) => meetings = meetings.filter(m => m.id !== id)

	Object.defineProperty(this, 'meetings', {
		get: function() {
			return meetings
		},
		set: function(val) {
			meetings = val
		}
	})
}

function findSequential(meetings) {
	const ids = meetings.map(m => m.id)
		.sort((a, b) => a - b)
		
	let current = 1
	for (const id of ids) {
		if (id !== current)
			return current
		current++
	}

	return current
}

/*
if (process.env.NODE_ENV === 'test') {
	module.exports = {
		Meeting: Meeting,
		MeetingManager: MeetingManager,
		findSequential: findSequential
	}
}
*/


export { Meeting, MeetingManager }