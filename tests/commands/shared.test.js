const Botmock = require('botkit-mock');
const shared = require('../../commands/shared');


describe('syncChannelsToDB',()=>{
  let channelsInSlack = [
    { name: 'sk-happy-elephant', id: 'caseChannel1' },
    { name: 'sk-dancing-pigeon', id: 'caseChannel2' },
    { name: 'general',           id: 'nonCaseChannel' },
  ]

  beforeEach(()=>{
    this.controller = Botmock({});

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    this.bot.api.channels.list = jest.fn(({}, callback)=>{
      return callback(null, {channels: channelsInSlack})
    })

    // Ensure records don't already exist in db
    channelsInSlack.map((channel)=>{
      this.controller.storage.channels.get(channel.id, (err,chan)=>{
        expect(err || !chan).toBeTruthy()
      })
    })
  })

  it('saves channels from the bot API to controller storage',()=>{
    shared.syncChannelsToDB(this.controller, this.bot)
    channelsInSlack.map((channel)=>{
      this.controller.storage.channels.get(channel.id, (err,chan)=>{
        expect(chan.id).toBe(channel.id)
        expect(chan.name).toBe(channel.name)
      })
    })
  })
})