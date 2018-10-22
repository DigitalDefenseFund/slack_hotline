const slashCommands = require('../../skills/slash_commands');

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

jest.mock('../../commands/cases')
const cases = require('../../commands/cases')

jest.mock('../../commands/help_me')
const help = require('../../commands/help_me')

jest.mock('../../commands/find_clinic')
const findClinic = require('../../commands/find_clinic')

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
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(botSpy).toHaveBeenCalledWith(mockMessage, "Sorry, I'm not sure what that command is")
    })
  })

  describe("/hello",()=>{
    let mockMessage = {
      command: "/hello"
    }

    it("bot public replies hello there",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(botSpy).toHaveBeenCalledWith(mockMessage, "hello there")
    })
  })

  describe("/success",()=>{
    let mockMessage = {
      command: "/success"
    }

    let successSpy = jest.spyOn(success, "call")

    it("calls success with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(successSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/logout",()=>{
    let mockMessage = {
      command: "/logout"
    }

    let logoutSpy = jest.spyOn(logOut, "call")

    it("calls logout with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(logoutSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/getflags",()=>{
    let mockMessage = {
      command: "/getflags"
    }

    let flagSpy = jest.spyOn(getFlags, "call")

    it("calls getFlags with controller, bot, message, and callback",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage, expect.any(Function))
    })
  })

  describe("/flag",()=>{
    let mockMessage = {
      command: "/flag"
    }

    let flagSpy = jest.spyOn(flag, "call")

    it("calls flag with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/unflag",()=>{
    let mockMessage = {
      command: "/unflag"
    }

    let flagSpy = jest.spyOn(flag, "call")

    it("calls flag with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(flagSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/assign",()=>{
    let mockMessage = {
      command: "/assign"
    }

    let assignSpy = jest.spyOn(assign, "call")

    it("calls assign with controller, bot, and message (though it takes a 4th argument)",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(assignSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/nextcase",()=>{
    let mockMessage = {
      command: "/nextcase"
    }

    let nextCaseSpy = jest.spyOn(nextCase, "call")

    it("calls next_case with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(nextCaseSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

  describe("/cases",()=>{
    let mockMessage = {
      command: "/cases"
    }

    let casesSpy = jest.spyOn(cases, "call")

    it("calls next_case with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(casesSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage, 'normal')
    })
  })

  describe("/cases_pretty",()=>{
    let mockMessage = {
      command: "/cases_pretty"
    }

    let casesSpy = jest.spyOn(cases, "call")

    it("calls next_case with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(casesSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage, 'pretty')
    })
  })

  describe("/helpme",()=>{
    let mockMessage = {
      command: "/helpme"
    }

    let helpMeSpy = jest.spyOn(help, "call")

    it("calls next_case with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(helpMeSpy).toHaveBeenCalledWith(mockBot, mockMessage)
    })
  })

  describe("/find_clinic",()=>{
    let mockMessage = {
      command: "/find_clinic"
    }

    let clinicSpy = jest.spyOn(findClinic, "call")

    it("calls find_clinic with controller, bot, and message",()=>{
      mockController.on = jest.fn((event, callback)=>{
        return callback(mockBot, mockMessage)
      })
      slashCommands(mockController)

      expect(clinicSpy).toHaveBeenCalledWith(mockController, mockBot, mockMessage)
    })
  })

})
