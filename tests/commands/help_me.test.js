const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('help',()=>{
  beforeEach(()=>{
    this.controller = Botmock({});
    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    slashCommands(this.controller)

    this.sequence = [
      {
        type: 'slash_command',
        user: '12345',
        channel: '54321',
        messages: [
          {
            command: '/helpme',
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
  })

  let commandsHelp = [
    "Type `/hello` to check that Pigeon's properly installed",
    "Type `/cases`to list all current cases",
    "Type `/cases_pretty` to list all current cases color coded. Unassigned cases are red, cases with the 'needs attention' flag are orange, cases where the patient is awaiting a response are yellow, and otherwise cases are green.",
    "Type `/nextcase` to assign yourself an unassigned case. This will select the oldest unassigned active case.",
    "Type `/assign` to assign yourself to the channel you're in. Alternatively you can `/assign @user #some-case-channel`.",
    "Type `/flag` to apply a label to a case. If you don't provide a flag, 'needs attention' is the default.",
    "Type `/unflag` to remove flags from a case. Either call this from the channel you wish to unflag or provide a channel name.",
    "Type `/getflags` to view a list of all flags used by your team.",
    "Type `/success` to close a case and archive its channel.",
    "Type `/logout` to unassign all cases (ends their volunteer shift)."
  ]

  it('returns the expected usage text',()=>{
    let expectedHelpText = commandsHelp.join("\n")

    return this.bot.usersInput(this.sequence).then(() => {
      const reply = this.bot.api.logByKey['replyPrivate'][0].json;
      expect(reply.text).toEqual(expectedHelpText)
    })
  })
})