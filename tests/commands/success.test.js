const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('success',()=>{
  let channelFixture = {
    "id":"54321",
    "team_id":"team_id_123",
  }

  beforeEach(()=>{
    this.controller = Botmock({});
    this.controller.storage.channels.save(channelFixture, function(){})

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    slashCommands(this.controller)

    this.sequence = [
      {
        type: 'slash_command',
        user: '12345',
        channel: '54321',
        messages: [
          {
            command: '/success',
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
  });

  it('marks the channel success, archives the channel, and notifies the user', () => {
    let archiveSpy = jest.spyOn(this.bot.api.channels, "archive")
    
    return this.bot.usersInput(this.sequence).then(() => {
      const reply = this.bot.api.logByKey['replyPublic'][0].json;
      expect(reply.text).toBe('You have successfully closed this conversation.')
      expect(reply.response_type).toBe('in_channel')

      this.controller.storage.channels.get(reply.channel, (err, chan)=>{
        expect(chan.outcome).toBe('success')
      })
      
      expect(archiveSpy).toHaveBeenCalledWith({"channel": reply.channel, "token": "some_token"}, expect.any(Function))
    })
  });
})