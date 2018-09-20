const Botmock = require('botkit-mock');
const slashCommands = require('../../skills/slash_commands')

jest.mock('../../commands/assign')
const assign = require('../../commands/assign')

describe('next_case',()=>{

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

  let recentUnassignedCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"recentUnassignedCase444",
    },
    api: {
      id: 'recentUnassignedCase444',
      name: 'sk-happy-hyena',
      is_channel: true,
      is_archived: false
    },
    history: {
      messages: [
        {
          text: 'hellloooo',
          username: 'nicole replied',
          subtype: 'bot_message',
          ts: '1536946953.323'
        },
        {
          username: 'Happy Hyena',
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

  let olderUnassignedCase = {
    storage: {
      "team_id":"team_id_123",
      "id":"olderUnassignedCase555"
    },
    api: {
      id: 'olderUnassignedCase555',
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
  let unassignedArchivedCase = {
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

  let allCases = [assignedCase, recentUnassignedCase, olderUnassignedCase, unassignedArchivedCase]

  let allChannelsStorage = []
  let allChannelsApi = []
  allCases.map((c)=>{
    allChannelsStorage.push(c.storage)
    allChannelsApi.push(c.api)
  })

  let assignmentSpy = jest.spyOn(assign, "call")
  
  describe('No current unassigned cases exist',()=>{
    beforeEach(()=>{
      this.controller = Botmock({});

      this.controller.storage.channels.all = jest.fn((callback)=>{
        return callback(null, [assignedCase.storage, unassignedArchivedCase.storage])
      })

      this.bot = this.controller.spawn({type: 'slack'});
      this.bot.config.bot = { app_token: 'some_token' }

      this.bot.api.channels.list = jest.fn(({}, callback)=>{
        return callback(null, {channels: [assignedCase.api, unassignedArchivedCase.api]})
      })

      this.bot.api.channels.history = jest.fn(({}, callback)=>{
        return callback(null, null)
      }).mockImplementationOnce(({}, callback)=>{
        return callback(null, assignedCase.history)
      })

      slashCommands(this.controller)
    })

    it('replies indicating that no cases need assignment',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_the_command',
          channel: 'general',
          messages: [
            {
              team_id: 'team_id_123',
              command: '/nextcase',
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
        expect(reply.text).toEqual('No current cases need assignment.')
      })
    })
  })

  describe('When cases needing assignments are present',()=>{
    let messageWithoutText = {
      user_id: 'user_typing_the_command',
      team_id: 'team_id_123',
      command: '/nextcase',
      text: '',
      actions: [{
        name: 'action',
        value: 'test'
      }],
      isAssertion: true,
    }

    let messageWithText = {
      user_id: 'user_typing_the_command',
      team_id: 'team_id_123',
      command: '/nextcase',
      text: '<@some_other_user|Cats McGee>',
      actions: [{
        name: 'action',
        value: 'test'
      }],
      isAssertion: true,
    }

    beforeEach(()=>{
      this.controller = Botmock({});

      this.controller.storage.channels.all = jest.fn((callback)=>{
        return callback(null, allChannelsStorage)
      })

      this.bot = this.controller.spawn({type: 'slack'});
      this.bot.config.bot = { app_token: 'some_token' }

      this.bot.api.channels.list = jest.fn(({}, callback)=>{
        return callback(null, {channels: allChannelsApi})
      })

      this.bot.api.channels.history = jest.fn(({}, callback)=>{
        return callback(null, null)
      }).mockImplementationOnce(({}, callback)=>{
        return callback(null, assignedCase.history)
      }).mockImplementationOnce(({}, callback)=>{
        return callback(null, recentUnassignedCase.history)
      }).mockImplementationOnce(({}, callback)=>{
        return callback(null, olderUnassignedCase.history)
      })

      slashCommands(this.controller)
    })

    it('assigns the oldest unassigned case to the user',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_the_command',
          channel: 'general',
          messages: [messageWithoutText]
        }
      ];

      return this.bot.usersInput(this.sequence).then(() => {
          expect(assignmentSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          messageWithoutText,
          {id: 'olderUnassignedCase555'},
          'user_typing_the_command'
        )
      })
    })

    it('assigns the oldest unassigned case to the user provided',()=>{
      this.sequence = [
        {
          type: 'slash_command',
          user: 'user_typing_the_command',
          channel: 'general',
          messages: [messageWithText]
        }
      ];

      return this.bot.usersInput(this.sequence).then(() => {
        expect(assignmentSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          messageWithText,
          {id: 'olderUnassignedCase555'},
          'some_other_user'
        )
      })
    })
  })
})