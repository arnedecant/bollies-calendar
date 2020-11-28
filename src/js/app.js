const CLIENT_ID = '106691038549-ko29mp6qulumr4cpfi36ik5v6m4i1gcv.apps.googleusercontent.com'
const API_KEY = 'AIzaSyB85HGh550U2vflSGW9Q72vXAz-n86Oubo'
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly"

// import GoogleCalendar from './controllers/google/calendar'

class App {

	constructor () {

		this.$dom = {}
		this.$dom.btnSignin = document.querySelector('[data-button="signin"]')
		this.$dom.btnSignout = document.querySelector('[data-button="signout"]')

		this.init()

	}

	init () {

		let timeout = 0

		const interval = window.setInterval(() => {

			timeout++
			window.GAPI = gapi
			if (!window.GAPI && timeout <= 600) return

			window.clearInterval(interval)
			GAPI.load('client:auth2', this.initClient.bind(this))

		}, 100)

	}

	initClient () {

		GAPI.client.init({
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
		}).then(() => {
			// Listen for sign-in state changes.
			GAPI.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this))
			// Handle the initial sign-in state.
			this.updateSigninStatus(GAPI.auth2.getAuthInstance().isSignedIn.get())
			this.$dom.btnSignin.onclick = this.handleSigninClick.bind(this)
			this.$dom.btnSignout.onclick = this.handleSignoutClick.bind(this)
		}, (error) => {
			this.appendPre(JSON.stringify(error, null, 2))
		})

	}

	updateSigninStatus (isSignedIn) {
		if (isSignedIn) {
			this.$dom.btnSignin.style.display = 'none'
			this.$dom.btnSignout.style.display = 'block'
			this.listUpcomingEvents()
		} else {
			this.$dom.btnSignin.style.display = 'block'
			this.$dom.btnSignout.style.display = 'none'
		}
	}

	handleSigninClick () {

		GAPI.auth2.getAuthInstance().signIn()

	}

	handleSignoutClick () {

		GAPI.auth2.getAuthInstance().signOut()

	}

	appendPre (message) {

		var pre = document.getElementById('content')
		var textContent = document.createTextNode(message + '\n')
		pre.appendChild(textContent)

	}

	listUpcomingEvents () {
		GAPI.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 10,
			'orderBy': 'startTime'
		}).then((response) => {
			var events = response.result.items
			this.appendPre('Upcoming events:')

			if (events.length > 0) {
				for (let i = 0; i < events.length; i++) {
					var event = events[i]
					var when = event.start.dateTime
					if (!when) when = event.start.date
					this.appendPre(event.summary + ' (' + when + ')')
				}
			} else {
				this.appendPre('No upcoming events found.')
			}
		})
	}

}

const app = new App()
export default app