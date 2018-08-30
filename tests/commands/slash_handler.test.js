const slashCommands = require('../../commands/slash_handler');

// These have to be outside of the parent describe block or else
// the mocks don't work ??
jest.mock('../../commands/success')
const success = require('../../commands/success')

jest.mock('../../commands/get_flags')
const getFlags = require('../../commands/get_flags')

jest.mock('../../commands/logout')
const logOut = require('../../commands/logout')

jest.mock('../../commands/flag')
const flag = require('../../commands/flag')

jest.mock('../../commands/assign')
const assign = require('../../commands/assign')

jest.mock('../../commands/next_case')
const nextCase = require('../../commands/next_case')

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

  describe("/logout",()=>{
    let mockMessage = {
      command: "/logout"
    }

    let logoutSpy = jest.spyOn(logOut, "call")

    it("calls logout with controller, bot, and message",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(logoutSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/getflags",()=>{
    let mockMessage = {
      command: "/getflags"
    }

    let flagSpy = jest.spyOn(getFlags, "call")

    it("calls getFlags with controller, bot, message, and callback",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage, expect.any(Function))
    })
  })

  describe("/flag",()=>{
    let mockMessage = {
      command: "/flag"
    }

    let flagSpy = jest.spyOn(flag, "call")

    it("calls flag with controller, bot, and message",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/unflag",()=>{
    let mockMessage = {
      command: "/unflag"
    }

    let flagSpy = jest.spyOn(flag, "call")

    it("calls flag with controller, bot, and message",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/assign",()=>{
    let mockMessage = {
      command: "/assign"
    }

    let assignSpy = jest.spyOn(assign, "call")

    it("calls assign with controller, bot, and message (though it takes a 4th argument)",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(assignSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/nextcase",()=>{
    let mockMessage = {
      command: "/nextcase"
    }

    let nextCaseSpy = jest.spyOn(nextCase, "call")

    it("calls next_case with controller, bot, and message",()=>{
      slashCommands.mainHandler(mockController, mockBot, mockMessage)
      expect(nextCaseSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })
})