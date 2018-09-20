const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('assign',()=>{
  let channels = [
    {
      "id":"channel_msg_called_in",
      "team_id":"team_id_123",
    },
    {
      "id":"some_other_channel",
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

    slashCommands(this.controller)
  });

  describe('When called with a user and channel',()=>{
    it('assigns the user provided to the channel provided',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_z_command',
          channel: 'channel_msg_called_in',
          messages: [
            {
              user_id: 'user_typing_z_command',
              channel_id: 'channel_msg_called_in',
              command: '/assign',
              text: '<@some_random_user|that_user_display_name> <#some_other_channel|channel_display_name>',
              actions: [{
                name: 'action',
                value: 'test'
              }],
              isAssertion: true,
            }
          ]
        }
      ];

      return this.bot.usersInput(this.sequence).then(() => {
        const reply = this.bot.api.logByKey['replyPublic'][0].json;
        expect(reply.text).toBe('<@some_random_user> assigned to <#some_other_channel>')
        expect(reply.response_type).toBe('in_channel')

        this.controller.storage.channels.get('some_other_channel', (err, chan)=>{
          expect(chan.assignment).toBe('some_random_user')
        })
      })
    })
  })

  describe('When called with only a user',()=>{
    it('assigns the user provided to the channel from which it was called',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_z_command',
          channel: 'channel_msg_called_in',
          messages: [
            {
              user_id: 'user_typing_z_command',
              channel_id: 'channel_msg_called_in',
              command: '/assign',
              text: '<@some_random_user|that_user_display_name>',
              actions: [{
                name: 'action',
                value: 'test'
              }],
              isAssertion: true,
            }
          ]
        }
      ];

      return this.bot.usersInput(this.sequence).then(() => {
        const reply = this.bot.api.logByKey['replyPublic'][0].json;
        expect(reply.text).toBe('<@some_random_user> assigned to <#channel_msg_called_in>')
        expect(reply.response_type).toBe('in_channel')

        this.controller.storage.channels.get('channel_msg_called_in', (err, chan)=>{
          expect(chan.assignment).toBe('some_random_user')
        })
      })
    })
  })

  describe('When called with only a channel',()=>{
    it('assigns the user who typed the message to the channel provided',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_z_command',
          channel: 'channel_msg_called_in',
          messages: [
            {
              user_id: 'user_typing_z_command',
              channel_id: 'channel_msg_called_in',
              command: '/assign',
              text: '<#some_other_channel|channel_display_name>',
              actions: [{
                name: 'action',
                value: 'test'
              }],
              isAssertion: true,
            }
          ]
        }
      ];

      return this.bot.usersInput(this.sequence).then(() => {
        const reply = this.bot.api.logByKey['replyPublic'][0].json;
        expect(reply.text).toBe('<@user_typing_z_command> assigned to <#some_other_channel>')
        expect(reply.response_type).toBe('in_channel')

        this.controller.storage.channels.get('some_other_channel', (err, chan)=>{
          expect(chan.assignment).toBe('user_typing_z_command')
        })
      })
    })
  })

  describe('When called with no arguments',()=>{
    it('assigns the user who typed the message to the channel from which it was called',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_z_command',
          channel: 'channel_msg_called_in',
          messages: [
            {
              user_id: 'user_typing_z_command',
              channel_id: 'channel_msg_called_in',
              command: '/assign',
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

      return this.bot.usersInput(this.sequence).then(() => {
        const reply = this.bot.api.logByKey['replyPublic'][0].json;
        expect(reply.text).toBe('<@user_typing_z_command> assigned to <#channel_msg_called_in>')
        expect(reply.response_type).toBe('in_channel')

        this.controller.storage.channels.get('channel_msg_called_in', (err, chan)=>{
          expect(chan.assignment).toBe('user_typing_z_command')
        })
      })
    })
  })

  describe('when called from #general channel',()=>{
    it("sets the provided flag for the channel provided",()=>{
      // TODO -- https://trello.com/c/V6SBmMmZ
    })
  })
})