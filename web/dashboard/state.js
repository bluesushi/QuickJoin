import { MeetingManager } from './models.js'

export let state =  {
	classLink: {
		url: "",
		time: "",
		name: ""
	},
	editLink: {
		'edit-name': "",
		'edit-time': "",
		'edit-url': "",
		key: "",
		edited: false
	}
}

export const meetingManager = new MeetingManager()