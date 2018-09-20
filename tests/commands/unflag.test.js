const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('unflag',()=>{
  let channels = [
    {
      "id":"54321",
      "team_id":"team_id_123",
      "label":"some cool and fancy flag"
    },
    {
      "id":"66666",
      "team_id":"team_id_123",
      "label":"flaggy mc wave wave"
    }
  ]

  beforeEach(()=>{
    this.controller = Botmock({});

    channels.map((channel)=>{
      this.controller.storage.channels.save(channel, function(err, response){
        if (err) { console.log('Something went wrong with test setup') }
      })
    })

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    slashCommands(this.controller)
  });

  describe('default -- not passed any arguments',()=>{
    it("removes flags from the channel it was called in",()=>{
      this.controller.storage.channels.get('54321', (err, chan)=>{
        expect(chan.label).toBe('some cool and fancy flag')
      })

      this.sequence = [
        {
          type: 'slash_command',
          user: '12345',
          channel: '54321',
          messages: [
            {
              command: '/unflag',
              channel_id: '54321',
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
        this.controller.storage.channels.get('54321', (err, chan)=>{
          expect(chan.label).toBe(undefined)
        })
      })
    })
  })

  describe('when passed a channel',()=>{
    it("removes flags fron the channel provided",()=>{
      this.controller.storage.channels.get('66666', (err, chan)=>{
        expect(chan.label).toBe('flaggy mc wave wave')
      })

      this.sequence = [
        {
          type: 'slash_command',
          user: '12345',
          channel: '54321',
          messages: [
            {
              command: '/unflag',
              channel_id: '54321',
              text: '<#66666|blah-blah-channel>',
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
        this.controller.storage.channels.get('66666', (err, chan)=>{
          expect(chan.label).toBe(undefined)
        })
      })
    })
  })
})