import { google } from 'googleapis'

class App {

	constructor({ GAPI }) {

		console.log(google)

		window.GAPI = GAPI

		this.$dom = {}
		this.$dom.btnAuth = document.querySelector('[data-button="auth"]')
		this.$dom.btnSignout = document.querySelector('[data-button="signout"]')

	}

	init() {

		GAPI.load('client:auth2', initClient)

	}

	initClient() {

		GAPI.client.init({
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
		}).then(function () {
			// Listen for sign-in state changes.
			GAPI.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
			// Handle the initial sign-in state.
			updateSigninStatus(GAPI.auth2.getAuthInstance().isSignedIn.get())
			this.$dom.btnAuth.onclick = this.handleAuthClick
			this.$dom.btnAuth.onclick = this.handleSignoutClick
		}, function (error) {
			this.appendPre(JSON.stringify(error, null, 2))
		})

	}

	updateSigninStatus(isSignedIn) {
		if (isSignedIn) {
			this.$dom.btnAuth.style.display = 'none'
			this.$dom.btnSignout.style.display = 'block'
			this.listUpcomingEvents()
		} else {
			this.$dom.btnAuth.style.display = 'block'
			this.$dom.btnSignout.style.display = 'none'
		}
	}

	handleAuthClick() {

		GAPI.auth2.getAuthInstance().signIn()

	}

	handleSignoutClick() {

		GAPI.auth2.getAuthInstance().signOut()

	}

	appendPre() {

		var pre = document.getElementById('content')
		var textContent = document.createTextNode(message + '\n')
		pre.appendChild(textContent)

	}

	listUpcomingEvents() {
		GAPI.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 10,
			'orderBy': 'startTime'
		}).then(function (response) {
			var events = response.result.items
			appendPre('Upcoming events:')

			if (events.length > 0) {
				for (i = 0; i < events.length; i++) {
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

window.APP = new App()