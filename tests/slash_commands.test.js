const slashCommands = require('../skills/slash_commands');

describe("slash_commands",()=>{
  let mockBot = {}
  let mockMessage = {}

  // const mockController = {
  //   on: jest.fn(function(event_arg) {
  //     if (event_arg === 'slack_command') {
  //       return [mockBot, mockMessage]
  //     } else {
  //       return 'was not triggered'
  //     }
  //   })
  // }

  const mockController = {
    on: jest.fn((event_arg) => {
      if (event_arg === 'slack_command') {
        return 'slash_command triggered'
      } else {
        return 'was not triggered'
      }
    })
  }
  
  it("does not trigger a slash command when one not present",()=>{
    expect(mockController.on('literally_anything_else')).toBe('was not triggered');
  })

  it("handles slash_command when one detected",()=>{
    expect(mockController.on('slack_command')).toBe('slash_command triggered');
  })

  describe("/hello",()=>{
    let mockMessage = {
      command: "/hello"
    }

    const mockReplyPublic = jest.fn()
    let mockBot = {
      replyPublic: mockReplyPublic
    }

    let botSpy = jest.spyOn(mockBot, 'replyPublic')

    it("returns hello when command is /hello",()=>{
      mockController.on('slack_command')
      //expect(mockReplyPublic).toHaveBeenCalledWith(mockMessage, "hello there")
      expect(botSpy).toHaveBeenCalledWith(mockMessage, "hello there")
    })
  })

  describe("/cases",()=>{
    // let mockMessage = {
    //   command: "/cases"
    // }

    // it("returns cases when command is /cases",()=>{
    //   mockController.on('slack_command')
    //   expect(botSpy).toHaveBeenCalled
    // })
  })
})
