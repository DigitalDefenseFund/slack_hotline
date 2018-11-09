const Botmock = require('botkit-mock');
const channelCreate = require('../../skills/channel_create');

describe("channel_create",()=>{
  let message = {
    "channel_id":"54321",
    "team_id":"team_id_123",
  }

  beforeEach(()=>{
    this.controller = Botmock({});

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    channelCreate(this.controller)

    this.controller.on = jest.fn((event, callback)=>{
      return callback(this.bot, message)
    })

    // Ensure that the channel doesn't already exist
    // to weed out false positives in our it block
    this.controller.storage.channels.get('54321', (err, chan)=>{
      expect(err || !chan).toBeTruthy()
    })
  });

  it("saves the message's channel to the db",()=>{
    channelCreate(this.controller)
    this.controller.storage.channels.get('54321', (err, chan)=>{
      expect(chan.id).toBe('54321')
      expect(chan.team_id).toBe('team_id_123')
    })
  })
})