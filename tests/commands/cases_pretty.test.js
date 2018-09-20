const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe('When using the pretty format',()=>{
  // should be orange
  let needsAttentionCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"needsAttentionCase321",
      "assignment":"someUsersId",
      "label":"needs attention"
    },
    api: {
      id: 'needsAttentionCase321',
      name: 'sk-flashy-bee',
      is_channel: true,
      is_archived: false,
    },
    history: {
      // Volunteer replied last
      messages: [
        {
          text: 'hellloooo',
          username: 'nicole replied',
          subtype: 'bot_message',
          ts: '1535601624.000100'
        },
        {
          username: 'Flashy Bee',
          // This is what a reply from a patient via smooch looks like in Slack
          attachments: [{
            fallback: 'Another pigeon flight',
            text: 'Use `/sk [text]` to reply',
            pretext: 'Another pigeon flight',
            id: 1,
            color: 'a24cb5',
            mrkdwn_in: [ 'text', 'pretext' ]
          }],
          subtype: 'bot_message',
          ts: '1535601624.000100'
        }
      ]
    }
  }

  // Should be yellow
  let assignedLastFromPatientCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"assignedCase666",
      "assignment":"someUsersId"
    },
    api: {
      id: 'assignedCase666',
      name: 'sk-sassy-bug',
      is_channel: true,
      is_archived: false,
    },
    history: {
      messages: [
        {
          username: 'Sassy Bug',
          // This is what a reply from a patient via smooch looks like in Slack
          attachments: [{
            fallback: 'Text from the patient',
            text: 'Use `/sk [text]` to reply',
            pretext: 'Text from the patient',
            id: 1,
            color: 'a24cb5',
            mrkdwn_in: [ 'text', 'pretext' ]
          }],
          subtype: 'bot_message',
          ts: '1535601624.000100'
        },
        {
          text: 'hellloooo',
          username: 'nicole replied',
          subtype: 'bot_message',
          ts: '1535601624.000100'
        }
      ]
    }
  }

  // should be green
  let assignedLastFromVolCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"assignedRespondedToCase555",
      "assignment":"someUsersId"
    },
    api: {
      id: 'assignedRespondedToCase555',
      name: 'sk-menacing-buffalo',
      is_channel: true,
      is_archived: false
    },
    history: {
      messages: [
        {
          text: 'hellloooo',
          username: 'some_user replied',
          subtype: 'bot_message',
          ts: '1535601624.000100'
        },
        {
          username: 'Menacing Buffalo',
          // This is what a reply from a patient via smooch looks like in Slack
          attachments: [{
            fallback: 'Text from the patient',
            text: 'Use `/sk [text]` to reply',
            pretext: 'Text from the patient',
            id: 1,
            color: 'a24cb5',
            mrkdwn_in: [ 'text', 'pretext' ]
          }],
          subtype: 'bot_message',
          ts: '1535601624.000100'
        }
      ]
    }
  }

  // will be red?
  let unassignedLastFromVolCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"unassignedLastFromVolCase333"
    },
    api: {
      id: 'unassignedLastFromVolCase333',
      name: 'sk-wobbly-lizard',
      is_channel: true,
      is_archived: false
    },
    history: {
      messages: [
        {
          text: 'hellloooo',
          username: 'nicole replied',
          subtype: 'bot_message',
          ts: '1535601624.000100'
        },
        {
          username: 'Wobbly Lizard',
          // This is what a reply from a patient via smooch looks like in Slack
          attachments: [{
            fallback: 'Text from the patient',
            text: 'Use `/sk [text]` to reply',
            pretext: 'Text from the patient',
            id: 1,
            color: 'a24cb5',
            mrkdwn_in: [ 'text', 'pretext' ]
          }],
          subtype: 'bot_message',
          ts: '1535601624.000100'
        }
      ]
    }
  }

  // Note -- in db storage, there"s no way of seeing that a channel was archived
  let archivedCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"archivedCase888"
    },
    api: {
      id: 'archivedCase888',
      name: 'sk-hungry-antelope',
      is_channel: true,
      is_archived: true
    },
    history: {
      messages: [
        {
          text: 'hellloooo',
          username: 'nicole replied',
          subtype: 'bot_message',
          ts: '1535601624.000100'
        },
        {
          username: 'Hungry Antelope',
          // This is what a reply from a patient via smooch looks like in Slack
          attachments: [{
            fallback: 'Text from the patient',
            text: 'Use `/sk [text]` to reply',
            pretext: 'Text from the patient',
            id: 1,
            color: 'a24cb5',
            mrkdwn_in: [ 'text', 'pretext' ]
          }],
          subtype: 'bot_message',
          ts: '1535601624.000100'
        }
      ]
    }
  }

  let allCases = [
    needsAttentionCase,
    assignedLastFromPatientCase,
    assignedLastFromVolCase,
    unassignedLastFromVolCase,
    archivedCase
  ]

  let channelsFromStorage = []
  let channelsFromApi = []
  allCases.map((c)=>{
    channelsFromStorage.push(c.storage)
    channelsFromApi.push(c.api)
  })

  beforeEach(()=>{
    this.controller = Botmock({});

    this.controller.storage.channels.all = jest.fn((callback)=>{
      return callback(null, channelsFromStorage)
    })

    this.bot = this.controller.spawn({type: 'slack'});
    this.bot.config.bot = { app_token: 'some_token' }

    this.bot.api.channels.list = jest.fn(({}, callback)=>{
      return callback(null, {channels: channelsFromApi})
    })

    this.bot.api.channels.history = jest.fn(({}, callback)=>{
      return callback(null, null)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, needsAttentionCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, assignedLastFromPatientCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, assignedLastFromVolCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, unassignedLastFromVolCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, archivedCase.history)
    })

    slashCommands(this.controller)
  })

  it('generates color formatted response with attachments',()=>{
    this.sequence = [
      {
        type: 'slash_command',
        user: '12345',
        channel: 'general',
        messages: [
          {
            team_id: 'team_id_123',
            command: '/cases_pretty',
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
      // colors:
      // 1. assigned, not flagged 'needs attention', volunteer responded [green] #00f566
      // 2. patient last spoke [yellow] #f5c400
      // 3. needs attention [orange] #f35a00
      // 4. unassigned [red] #f50056
      const reply = this.bot.api.logByKey['replyPublic'][0].json;

      expect(reply.attachments.length).toBe(4)

      // needsAttentionCase should be orange
      // assignedLastFromPatientCase should be yellow
      // assignedLastFromVolCase should be green
      // unassignedLastFromVolCase should be red
      let orangeCase = reply.attachments[0]
      let yellowCase = reply.attachments[1]
      let greenCase = reply.attachments[2]
      let redCase = reply.attachments[3]

      expect(orangeCase.fields).toEqual([
        {
          short: true,
          title: 'volunteer 8/29 23:00 (needs attention)',
          value: '<@someUsersId>'
        },
        {
          short: true,
          title: 'Channel',
          value: `<#${needsAttentionCase.api.id}>`
        }
      ])
      expect(orangeCase.color).toBe('#f35a00')

      expect(yellowCase.fields).toEqual([
        {
          short: true,
          title: 'patient 8/29 23:00',
          value: '<@someUsersId>'
        },
        {
          short: true,
          title: 'Channel',
          value: `<#${assignedLastFromPatientCase.api.id}>`
        }
      ])
      expect(yellowCase.color).toBe('#f5c400')

      expect(greenCase.fields).toEqual([
        {
          short: true,
          title: 'volunteer 8/29 23:00',
          value: '<@someUsersId>'
        },
        {
          short: true,
          title: 'Channel',
          value: `<#${assignedLastFromVolCase.api.id}>`
        }
      ])
      expect(greenCase.color).toBe('#00f566')

      expect(redCase.fields).toEqual([
        {
          short: true,
          title: 'volunteer 8/29 23:00',
          value: 'unassigned'
        },
        {
          short: true,
          title: 'Channel',
          value: `<#${unassignedLastFromVolCase.api.id}>`
        }
      ])
      expect(redCase.color).toBe('#f50056')
    })
  })
})