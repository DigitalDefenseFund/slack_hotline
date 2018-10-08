const Botmock = require('botkit-mock');
const zipCodeLookup = require('../../skills/zip_code_lookup');


describe('zip_code_lookup',()=>{
	let lookup_response = {
		"name": "Austin Clinic",
		"street": "1 A Street",
		"street2": "",
		"city": "Austin",
		"state": "Texas",
		"zip": "12345",
		"url": "www.clinic.com",
		"phone": "123-456-7890",
		"hours": "M-F 9-4"
	}

	let channels = [
		{
			"id":"some__channel",
			"team_id":"team_id_123"
		}
	]

	beforeEach(()=>{
		this.controller = Botmock({});
		channels.map((channel)=>{
			this.controller.storage.channels.save(channel, function(){})
		})

		this.bot = this.controller.spawn({type: 'slack'});
		this.bot.config.bot = { app_token: 'some_token' }

		zipCodeLookup(this.controller)
	});

	describe('message suggestions',()=>{
		it('should detect when a user sends a zip code',()=>{
			return this.bot.usersInput(
				[
					{
						user: 'someUserId',
						channel: 'some_channel',
						messages: [
							{
								text: '00000', isAssertion: true, type:"ambient"
							}
						]
					}
				]
			).then((message) => {
				expect(message.text).toBe("00000")
			})
		})
	})

	describe('message suggestions',()=>{
		it('should detect when a user sends a message containing a zip code',()=>{
			return this.bot.usersInput(
				[
					{
						user: 'someUserId',
						channel: 'some_channel',
						messages: [
							{
								text: 'my zip code is 00000.', isAssertion: true, type:"ambient"
							}
						]
					}
				]
			).then((message) => {
				expect(message.text).toBe("00000")
			})
		})
	})

})
