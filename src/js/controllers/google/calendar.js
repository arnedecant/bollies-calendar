// TEMP -- eventually to remove from repo and generate new keys
// --------------------------------------------------------------------------------------------------
const CLIENT_ID = '106691038549-ko29mp6qulumr4cpfi36ik5v6m4i1gcv.apps.googleusercontent.com'
const API_KEY = 'AIzaSyB85HGh550U2vflSGW9Q72vXAz-n86Oubo'
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
const SCOPES = 'https://www.googleapis.com/auth/calendar'
// --------------------------------------------------------------------------------------------------

export default class GoogleCalendar {

	constructor (args) {

		this.args = args
		this.calendarId = 'primary'

		let timeout = 0

		const interval = window.setInterval(() => {

			timeout++
			this.API = gapi
			if (!this.API && timeout <= 600) return

			window.clearInterval(interval)
			this.API.load('client:auth2', this.init.bind(this))

		}, 100)

	}

	init () {

		const args = {
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			discoveryDocs: DISCOVERY_DOCS,
			scope: SCOPES
		}

		this.API.client.init(args).then(() => {
			this.API.auth2.getAuthInstance().isSignedIn.listen(this.args.onStatusUpdate.bind(this))
			this.args.onStatusUpdate(this.API.auth2.getAuthInstance().isSignedIn.get())
		}, (error) => console.error(error))

	}


	signIn () {

		return this.API.auth2.getAuthInstance().signIn()

	}

	signOut () {

		return this.API.auth2.getAuthInstance().signOut()

	}

	setCalendar (id = 'primary') {

		this.calendarId = id

	}

	async getUpcomingEvents () {

		const response = await this.API.client.calendar.events.list({
			calendarId: this.calendarId,
			timeMin: (new Date()).toISOString(),
			showDeleted: false,
			singleEvents: true,
			maxResults: 10,
			orderBy: 'startTime'
		})

		return response.result.items

	}

	async addEvent (event) {

		console.log(event)

		const request = this.API.client.calendar.events.insert({ 
			calendarId: this.calendarId, 
			resource: event 
		})
		
		return await request.execute()

	}

}
