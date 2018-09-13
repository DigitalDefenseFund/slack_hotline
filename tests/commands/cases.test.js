const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

describe("cases",()=>{
  let flaggedCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"flagMcCase123",
      "label":"flag here!"
    },
    api: {
      id: 'flagMcCase123',
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

  let assignedCase = {
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

  let flaggedAssignedCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"flagsAssignsMcGee",
      "assignment":"someUsersId",
      "label":"urgent"
    },
    api: {
      id: 'flagsAssignsMcGee',
      name: 'sk-menacing-buffalo',
      is_channel: true,
      is_archived: false
    },
    history: {
      messages: [
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
        },
        {
          text: 'hellloooo',
          username: 'some_user replied',
          subtype: 'bot_message',
          ts: '1535601624.000100'
        }
      ]
    }
  }

  let unflaggedUnassignedCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"plainCase321"
    },
    api: {
      id: 'plainCase321',
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

  let allCases = [flaggedCase, assignedCase, flaggedAssignedCase, unflaggedUnassignedCase, archivedCase]

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
      return callback(null, flaggedCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, assignedCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, flaggedAssignedCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, unflaggedUnassignedCase.history)
    }).mockImplementationOnce(({}, callback)=>{
      return callback(null, archivedCase.history)
    })

    slashCommands(this.controller)

    this.sequence = [
      {
        type: 'slash_command',
        user: '12345',
        channel: 'general',
        messages: [
          {
            team_id: 'team_id_123',
            command: '/cases',
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

  describe('When current cases exist',()=>{
    let expectedFinalMsg = '```Open Cases:'
    expectedFinalMsg += `
Last Message            Flag               Assignee           Channel
volunteer 8/29 23:00    flag here!                            <#flagMcCase123>
patient   8/29 23:00                                          <#assignedCase666>
patient   8/29 23:00    urgent             <@someUsersId>     <#flagsAssignsMcGee>
volunteer 8/29 23:00                                          <#plainCase321>`
    expectedFinalMsg += '```'

    it('displays cases in a table format',()=>{
      return this.bot.usersInput(this.sequence).then(() => {
        const reply = this.bot.api.logByKey['replyPublic'][0].json;
        expect(reply.text).toEqual(expectedFinalMsg)
      })
    })
  })
})
