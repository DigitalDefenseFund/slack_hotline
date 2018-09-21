const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('logout',()=>{
  let channelsApi = [
    { id: 'abc123channel', members: ['logoutUserID','someOtherUser']},
    { id: 'catChannel',    members: ['logoutUserID']},
    { id: 'otherChannel',  members: ['someOtherUser']}
  ]

  let channelsStorage = [
    { id: 'abc123channel', assignment: 'logoutUserID',  team_id: 'bestTeamEvah'},
    { id: 'catChannel',    assignment: 'logoutUserID',  team_id: 'bestTeamEvah'},
    { id: 'otherChannel',  assignment: 'someOtherUser', team_id: 'bestTeamEvah'}
  ]

  beforeEach(()=>{
    this.controller = Botmock({});

    channelsStorage.map((channel)=>{
      this.controller.storage.channels.save(channel, function(){})
    })

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    this.bot.api.channels.list = jest.fn((obj, callback) =>{
      return callback(null, {channels: channelsApi})
    })

    this.bot.api.channels.leave = jest.fn((obj, callback)=>{
      return callback(null, null)
    })

    slashCommands(this.controller)

    this.sequence = [
      {
        type: 'slash_command',
        user: 'logoutUserID',
        team_id: 'bestTeamEvah',
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
          channel: channelsApi[0].id,
          user: 'logoutUserID' },
        expect.any(Function)
      )
      expect(this.bot.api.channels.leave).toHaveBeenNthCalledWith(
        2,
        { token:this.bot.config.bot.app_token,
          channel: channelsApi[1].id,
          user: 'logoutUserID' },
        expect.any(Function)
      )
    })
  })

  it('unassigns the user from the case',()=>{
    return this.bot.usersInput(this.sequence).then(()=>{
      this.controller.storage.channels.get('abc123channel', (err, chan)=>{
        expect(chan.assignment).toBe(undefined)
      })

      this.controller.storage.channels.get('catChannel', (err, chan)=>{
        expect(chan.assignment).toBe(undefined)
      })

      this.controller.storage.channels.get('otherChannel', (err, chan)=>{
        expect(chan.assignment).toBe('someOtherUser')
      })
    })
  })
})