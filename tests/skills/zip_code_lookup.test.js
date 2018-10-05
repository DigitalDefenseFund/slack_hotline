const Botmock = require('botkit-mock');
const zipCodeLookup = require('../../skills/zip_code_lookup');


describe('zip_code_lookup',()=>{
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
		it('should detect when a user sends a message with a zip code',()=>{
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
				expect(message.text).toBe("Hi there")
			})
		})
	})
})
