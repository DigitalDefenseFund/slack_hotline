const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('/getflags',()=>{
  let channelsInStorage = [
    {'id':'11111', 'team_id':'best_team_evah', 'label':'flag face mcgee'},
    {'id':'22222', 'team_id':'best_team_evah', 'label':'wavy flag'},
    {'id':'33333', 'team_id':'best_team_evah', 'label':'wavy flag'},
    {'id':'44444', 'team_id':'best_team_evah', 'label':'flaggy mcflag'},
    {'id':'55555', 'team_id':'omg_other_team', 'label':'should not appear'}
  ]

  beforeEach(()=>{
    this.controller = Botmock({});
    this.controller.storage.channels.all = jest.fn((callback)=>{
      return callback(null, channelsInStorage)
    })

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    slashCommands(this.controller)
  })

  let expectedResult = '```All Flags:'
  expectedResult += `
flag face mcgee
wavy flag
flaggy mcflag
`
  expectedResult += '```'

  it('returns a list of all flags ever used',()=>{
    this.sequence = [
      {
        type: 'slash_command',
        user: '12345',
        channel: 'general',
        messages: [
          {
            team_id: 'best_team_evah',
            command: '/getflags',
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
      const reply = this.bot.api.logByKey['replyPrivate'][0].json;
      expect(reply.text).toEqual(expectedResult)
    })
  })
})