const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('success',()=>{
  let channelFixture = {
    "id":"54321",
    "team_id":"team_id_123",
    // "assignment":"UCBR5SE87"
  }

  beforeEach(()=>{
    this.controller = Botmock({});
    // type can be ‘slack’, facebook’, or null
    this.bot = this.controller.spawn({type: 'slack'});

    this.controller.storage.channels.get = jest.fn((chan_id, cb)=>{
      cb(null, channelFixture);
    });

    console.log('CONTROLLER storage channels get', this.controller.storage.channels.get)

    this.bot.config.bot = { app_token: 'some_token' }
    // this.bot.config = { bot: { app_token: 'some_token' } }
    slashCommands(this.controller)

    // THE BELOW SUCCESSFULLY TRIGGERS THE SLASH COMMAND!
    this.sequence = [
      {
        type: 'slash_command', //if type null, default to direct_message
        user: '12345', //user required for each direct message
        // I THINK THIS NEEDS TO EXIST IN LOCAL STORAGE?
        channel: '54321', // user channel required for direct message
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
    console.log('RET VAL OF TEST ACTION', this.bot.usersInput(this.sequence))
    return this.bot.usersInput(this.sequence).then(() => {
      const reply = this.bot.api.logByKey['replyPublic'][0].json;
      console.log('REPLY', reply)
      expect(reply.text).toBe('You have successfully closed this conversation.')
      expect(reply.response_type).toBe('in_channel')
      // In message, we receive a full object that includes params:
      // {
      //    user: 'someUserId',
      //    channel: 'someChannel',
      //    text: 'help message',
      // }
      //return expect(message.text).toBe('You have successfully closed this conversation.');
    })
  });
})