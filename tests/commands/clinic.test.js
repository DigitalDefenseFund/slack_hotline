const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('help',()=>{
  beforeEach(()=>{
    this.controller = Botmock({});
    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }
		this.controller.storage.clinics = {}
		this.controller.storage.clinics.find = jest.fn( (searchArgs, callback)=>{
			return {"clinic": "sample_clinic"}
		})
    slashCommands(this.controller)

    this.sequence = [
      {
        type: 'slash_command',
        user: '12345',
        channel: '54321',
        messages: [
          {
            command: '/find_clinic',
            text: '',
            actions: [{
              name: 'action',
              value: 'test'
            }],
            isAssertion: true,
          }
        ]
      }
    ];
  })


  it('returns the expected usage text',()=>{

    return this.bot.usersInput(this.sequence).then(() => {
      const reply = this.bot.api.logByKey['replyPrivate'][0].json;
      expect(reply.text).toEqual(expectedHelpText)
    })
  })
})
