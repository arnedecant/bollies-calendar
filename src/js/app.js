import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import GoogleCalendar from './controllers/google/calendar'

class App {

	constructor () {

		this.$dom = {}
		this.$dom.btnSignin = document.querySelector('[data-button="signin"]')
		this.$dom.btnSignout = document.querySelector('[data-button="signout"]')
		this.$dom.calendar = document.querySelector('[data-calendar]')

		this.GoogleCalendar = new GoogleCalendar({
			onStatusUpdate: this.onStatusUpdate.bind(this)
		})

		document.querySelector('body').addEventListener('click', this.click.bind(this))

		this.init()

	}

	init () {
		
		this.calendar = new Calendar(this.$dom.calendar, { plugins: [dayGridPlugin] })
		this.calendar.render()

	}

	click (e) {

		switch (e.target.dataset.button) {
			case 'signin': 
				this.GoogleCalendar.signIn()
				break
			case 'signout':
				this.GoogleCalendar.signOut()
				break
			case 'addTestEvent':
				this.addTestEvent()
				break
		}

	}

	onStatusUpdate (isSignedIn) {
		if (isSignedIn) {
			this.$dom.btnSignin.style.display = 'none'
			this.$dom.btnSignout.style.display = 'block'
			this.listUpcomingEvents()
		} else {
			this.$dom.btnSignin.style.display = 'block'
			this.$dom.btnSignout.style.display = 'none'
		}
	}

	appendPre (message) {

		const pre = document.getElementById('content')
		const textContent = document.createTextNode(message + '\n')
		pre.appendChild(textContent)

	}

	async listUpcomingEvents () {

		const events = await this.GoogleCalendar.getUpcomingEvents()
		this.appendPre('Upcoming events:')

		if (events.length > 0) {
			for (const event of events) {
				let when = event.start.dateTime
				if (!when) when = event.start.date
				this.appendPre(event.summary + ' (' + when + ')')
			}
		} else {
			this.appendPre('No upcoming events found.')
		}
	}

	async addTestEvent () {

		const data = {
			'summary': 'Test event',
			'start': {
				'dateTime': '2020-12-02T09:00:00-07:00',
				'timeZone': 'Europe/Brussels'
			},
			'end': {
				'dateTime': '2020-12-02T17:00:00-07:00',
				'timeZone': 'Europe/Brussels'
			},
			'reminders': {
				'useDefault': false,
				'overrides': []
			}
		}

		const event = await this.GoogleCalendar.addEvent(data)
		console.log(event)

	}

}

const app = new App()
export default app
