const slashCommands = require('../../commands/slash_handler');

// These have to be outside of the parent describe block or else
// the mocks don't work ??
jest.mock('../../commands/success')
const success = require('../../commands/success')

jest.mock('../../commands/get_flags')
const getFlags = require('../../commands/get_flags')

describe("slash_commands",()=>{
  let mockController = {}
  let mockBot = {
    replyPublic: function(){
      return 'replyPublic called'
    }
  }
  let botSpy = jest.spyOn(mockBot, 'replyPublic')

  describe("Some unknown command",()=>{
    let mockMessage = {
      command: "/unknown_command"
    }

    it("bot public replies that they don't know the command",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(botSpy).toHaveBeenCalledWith(mockMessage, "Sorry, I'm not sure what that command is")
    })
  })

  describe("/hello",()=>{
    let mockMessage = {
      command: "/hello"
    }

    it("bot public replies hello there",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(botSpy).toHaveBeenCalledWith(mockMessage, "hello there")
    })
  })

  describe("/success",()=>{
    let mockMessage = {
      command: "/success"
    }

    let successSpy = jest.spyOn(success, "call")

    it("calls success with controller, bot, and message",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(successSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/getflags",()=>{
    let mockMessage = {
      command: "/getflags"
    }

    let flagSpy = jest.spyOn(getFlags, "call")

    it("calls success with controller, bot, and message",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage, expect.any(Function))
    })
  })
})