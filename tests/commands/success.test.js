const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('success',()=>{

  beforeEach(()=>{
    this.controller = Botmock({});
    // type can be ‘slack’, facebook’, or null
    this.bot = this.controller.spawn({type: 'slack'});
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
    return this.bot.usersInput(this.sequence).then((message) => {
      console.log('MESSAGE IN TEST', message)
      // In message, we receive a full object that includes params:
      // {
      //    user: 'someUserId',
      //    channel: 'someChannel',
      //    text: 'help message',
      // }
      return expect(message.text).toBe('You have successfully closed this conversation.');
    })
  });
})