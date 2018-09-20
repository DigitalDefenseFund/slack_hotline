const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('logout',()=>{
  let channels = [
    { id: 'abc123channel', members: ['logoutUserID','someOtherUser']},
    { id: 'catChannel', members: ['logoutUserID']},
    { id: 'otherChannel', members: ['someOtherUser']}
  ]

  beforeEach(()=>{
    this.controller = Botmock({});

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    this.bot.api.channels.list = jest.fn((obj, callback) =>{
      return callback(null, {channels: channels})
    })

    this.bot.api.channels.leave = jest.fn((obj, callback)=>{
      return callback(null, null)
    })

    slashCommands(this.controller)

    this.sequence = [
      {
        type: 'slash_command',
        user: 'logoutUserID',
        channel: '54321',
        messages: [
          {
            user_id: 'logoutUserID',
            command: '/logout',
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

  it('takes user out of channels they are a part of and replies with a logout message',()=>{
    return this.bot.usersInput(this.sequence).then(() => {
      const reply = this.bot.api.logByKey['replyPublic'][0].json;
      expect(reply.text).toEqual('You have logged out! Thank you so much for volunteering your time - you are so appreciated!')
      expect(this.bot.api.channels.leave).toHaveBeenNthCalledWith(
        1,
        { token:this.bot.config.bot.app_token,
          channel: channels[0].id,
          user: 'logoutUserID' },
        expect.any(Function)
      )
      expect(this.bot.api.channels.leave).toHaveBeenNthCalledWith(
        2,
        { token:this.bot.config.bot.app_token,
          channel: channels[1].id,
          user: 'logoutUserID' },
        expect.any(Function)
      )
    })
  })

  it('unassigns the user from the case',()=>{
    // TODO -- https://trello.com/c/lcIMqEr8/51-logout-does-not-unassign-a-user-from-a-case
  })
})