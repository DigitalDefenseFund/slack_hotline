const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('flag',()=>{
  let channelFixture = {
    "id":"54321",
    "team_id":"team_id_123",
  }

  beforeEach(()=>{
    this.controller = Botmock({});
    this.controller.storage.channels.save(channelFixture, function(err, response){
      if (err) { console.log('Something went wrong with test setup') }
    })

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    slashCommands(this.controller)
  });

  describe('default -- not passed any arguments',()=>{
    it("flags the channel it was called in as 'needs attention'",()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: '12345',
          channel: '54321',
          messages: [
            {
              command: '/flag',
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
          expect(chan.label).toBe('needs attention')
        })
      })
    })
  })

  describe('when passed a flag',()=>{
    it("flags the channel it was called in as the flag provided",()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: '12345',
          channel: '54321',
          messages: [
            {
              command: '/flag',
              text: 'the coolest flag you have ever laid eyes on',
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
          expect(chan.label).toBe('the coolest flag you have ever laid eyes on')
        })
      })
    })
  })

  describe('when passed a channel name',()=>{
    it("sets the default needs attention flag for the channel provided",()=>{
      let channelToFlag = {
        "id":"99999",
        "team_id":"team_id_123",
      }
      this.controller.storage.channels.save(channelToFlag, function(err, respponse){
        if (err) { console.log('Something went wrong with test setup') }
      })

      this.sequence = [
        {
          type: 'slash_command',
          user: '12345',
          channel: '54321',
          messages: [
            {
              command: '/flag',
              text: '<#99999|sk-excellent-barnacle>',
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
        this.controller.storage.channels.get('99999', (err, chan)=>{
          expect(chan.label).toBe('needs attention')
        })
      })
    })
  })

  describe('when passed a channel name and flag',()=>{
    it("sets the provided flag for the channel provided",()=>{
      let channelToFlag = {
        "id":"99999",
        "team_id":"team_id_123",
      }
      this.controller.storage.channels.save(channelToFlag, function(err, respponse){
        if (err) { console.log('Something went wrong with test setup') }
      })

      this.sequence = [
        {
          type: 'slash_command',
          user: '12345',
          channel: '54321',
          messages: [
            {
              command: '/flag',
              text: '<#99999|sk-excellent-barnacle> more magical than ever',
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
        this.controller.storage.channels.get('99999', (err, chan)=>{
          expect(chan.label).toBe('more magical than ever')
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