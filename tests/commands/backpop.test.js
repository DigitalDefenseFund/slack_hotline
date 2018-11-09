const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands');


describe('backpop',()=>{
  let channelsInSlack = [
    { name: 'sk-happy-elephant', id: 'caseChannel1' },
    { name: 'sk-dancing-pigeon', id: 'caseChannel2' },
    { name: 'general',           id: 'nonCaseChannel' },
  ]

  let expectedBackpopped = [
    { name: 'sk-happy-elephant', id: 'caseChannel1' },
    { name: 'sk-dancing-pigeon', id: 'caseChannel2' },
  ]

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // this is important
    process.env = { ...OLD_ENV };
    delete process.env.MAINTENANCE_MODE;
    process.env.MAINTENANCE_MODE = true

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

    slashCommands(this.controller)
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('saves channels from the bot API to controller storage',()=>{
    this.sequence = [
      {
        type: 'slash_command',
        user: 'someUser',
        channel: '54321',
        messages: [
          {
            team_id: '12345',
            user_id: 'someUser',
            command: '/backpop',
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
      expectedBackpopped.map((channel)=>{
        this.controller.storage.channels.get(channel.id, (err,chan)=>{
          expect(chan.id).toBe(channel.id)
          expect(chan.name).toBe(channel.name)
          expect(chan.team_id).toBe('12345')
        })
      })
    })
  })
})